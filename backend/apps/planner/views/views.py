from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import requests
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
import json
import logging

logger = logging.getLogger(__name__)

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": f"Hello, {request.user.username}! This is a protected endpoint.",
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
            }
        }, status=200) 

@method_decorator(csrf_exempt, name='dispatch')
class GoogleLoginView(APIView):
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
        try:
            # Debug: Print request data
            logger.info(f"Request data: {request.data}")
            
            token = request.data.get("token")
            if not token:
                logger.error("No token provided in request")
                return Response({
                    "success": False,
                    "error": "Token is required"
                }, status=400)
            
            logger.info(f"Token received: {token[:50]}...")  # Log first 50 chars
            
            # Use settings for client ID
            # client_id = getattr(settings, 'GOOGLE_OAUTH2_CLIENT_ID', None)
            client_id = "213670148556-dq7i7pqpnmltnt6hdeftn2fl41ljpod2.apps.googleusercontent.com"
            if not client_id:
                logger.error("Google OAuth2 Client ID not configured")
                return Response({
                    "success": False,
                    "error": "OAuth not properly configured"
                }, status=500)
            
            # Verify the Google token
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                client_id
            )
            
            logger.info(f"Token verified successfully for email: {idinfo.get('email')}")
            
            # Validate issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                logger.error(f"Invalid token issuer: {idinfo['iss']}")
                return Response({
                    "success": False,
                    "error": "Invalid token issuer"
                }, status=400)
            
            # Extract user info
            email = idinfo.get("email")
            name = idinfo.get("name", "")
            given_name = idinfo.get("given_name", "")
            family_name = idinfo.get("family_name", "")
            picture = idinfo.get("picture", "")
            
            if not email:
                return Response({
                    "success": False,
                    "error": "Email not found in token"
                }, status=400)
            
            # Create or get user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email,  # Use email as username
                    "first_name": given_name,
                    "last_name": family_name,
                }
            )
            
            # Update user info if not created
            if not created:
                user.first_name = given_name
                user.last_name = family_name
                user.save()
            
            # Create or get token
            auth_token, token_created = Token.objects.get_or_create(user=user)
            
            logger.info(f"User authentication successful: {user.email}, created: {created}")
            
            return Response({
                "success": True,
                "token": auth_token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "name": f"{user.first_name} {user.last_name}".strip() or user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
                "created": created
            }, status=200)
            
        except ValueError as e:
            logger.error(f"ValueError: {str(e)}")
            return Response({
                "success": False,
                "error": f"Invalid token: {str(e)}"
            }, status=400)
        except Exception as e:
            logger.error(f"Exception: {str(e)}")
            return Response({
                "success": False,
                "error": "Authentication failed"
            }, status=500)

class GitHubLoginView(APIView):
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
        try:
            code = request.data.get("code")
            if not code:
                return Response({
                    "success": False,
                    "error": "Authorization code is required"
                }, status=400)

            # Get GitHub OAuth settings from Django settings
            client_id = getattr(settings, 'GITHUB_CLIENT_ID', None)
            client_secret = getattr(settings, 'GITHUB_CLIENT_SECRET', None)
            
            if not client_id or not client_secret:
                logger.error("GitHub OAuth credentials not configured")
                return Response({
                    "success": False,
                    "error": "GitHub OAuth not properly configured"
                }, status=500)

            # 1️⃣ Exchange code for access_token
            token_url = "https://github.com/login/oauth/access_token"
            headers = {"Accept": "application/json"}
            data = {
                "client_id": client_id, 
                "client_secret": client_secret, 
                "code": code
            }

            token_res = requests.post(token_url, headers=headers, data=data)
            
            if token_res.status_code != 200:
                logger.error(f"GitHub token exchange failed: {token_res.text}")
                return Response({
                    "success": False,
                    "error": "Failed to exchange code for token"
                }, status=400)
            
            token_json = token_res.json()
            access_token = token_json.get("access_token")

            if not access_token:
                logger.error(f"No access token in response: {token_json}")
                return Response({
                    "success": False,
                    "error": "Failed to get GitHub access token"
                }, status=400)

            # 2️⃣ Fetch user info
            user_res = requests.get("https://api.github.com/user", headers={
                "Authorization": f"Bearer {access_token}",  # Updated to Bearer
                "Accept": "application/vnd.github.v3+json"
            })
            
            if user_res.status_code != 200:
                logger.error(f"GitHub user fetch failed: {user_res.text}")
                return Response({
                    "success": False,
                    "error": "Failed to fetch user information"
                }, status=400)
            
            user_json = user_res.json()
            
            # Get user email (might be private)
            email_res = requests.get("https://api.github.com/user/emails", headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json"
            })
            
            primary_email = user_json.get("email")
            if not primary_email and email_res.status_code == 200:
                emails = email_res.json()
                for email_obj in emails:
                    if email_obj.get("primary"):
                        primary_email = email_obj.get("email")
                        break
            
            # Fallback if no email found
            if not primary_email:
                primary_email = f"{user_json['login']}@github.com"

            # 3️⃣ Create or get user in Django
            user, created = User.objects.get_or_create(
                username=user_json["login"], 
                defaults={
                    "email": primary_email,
                    "first_name": user_json.get("name", "").split(" ")[0] if user_json.get("name") else "",
                    "last_name": " ".join(user_json.get("name", "").split(" ")[1:]) if user_json.get("name") and len(user_json.get("name", "").split(" ")) > 1 else "",
                }
            )
            
            # Create or get auth token
            auth_token, token_created = Token.objects.get_or_create(user=user)
            
            logger.info(f"GitHub authentication successful: {user.username}, created: {created}")

            return Response({
                "success": True,
                "token": auth_token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "name": user_json.get("name", user.username),
                    "avatar_url": user_json.get("avatar_url"),
                },
                "created": created
            }, status=200)
            
        except Exception as e:
            logger.error(f"GitHub OAuth error: {str(e)}")
            return Response({
                "success": False,
                "error": "GitHub authentication failed"
            }, status=500)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Delete the user's token
            request.user.auth_token.delete()
            logger.info(f"User {request.user.username} logged out successfully")
            return Response({
                "success": True,
                "message": "Logout successful"
            }, status=200)
        except Exception as e:
            logger.error(f"Logout error: {str(e)}")
            return Response({
                "success": False,
                "error": "Logout failed"
            }, status=500)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": f"{user.first_name} {user.last_name}".strip() or user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }, status=200)
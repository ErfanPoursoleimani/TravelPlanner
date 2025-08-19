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
import json
import logging

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": f"Hello, {request.user.username}! This is a protected endpoint."
        })
        
logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class GoogleLoginView(APIView):
    authentication_classes = []
    permission_classes = []
    
    def post(self, request):
        try:
            # Debug: Print request data
            logger.info(f"Request data: {request.data}")
            logger.info(f"Request body: {request.body}")
            
            token = request.data.get("token")
            if not token:
                logger.error("No token provided in request")
                return Response({"error": "Token is required"}, status=400)
            
            logger.info(f"Token received: {token[:50]}...")  # Log first 50 chars
            
            # Verify the Google token
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                "213670148556-dq7i7pqpnmltnt6hdeftn2fl41ljpod2.apps.googleusercontent.com"
            )
            
            logger.info(f"Token verified successfully: {idinfo}")
            
            email = idinfo.get("email")
            if not email:
                return Response({"error": "Email not found in token"}, status=400)
            
            # Create or get user
            user, created = User.objects.get_or_create(
                username=email, 
                defaults={"email": email}
            )
            
            # Create or get token
            auth_token, _ = Token.objects.get_or_create(user=user)
            
            logger.info(f"User authentication successful: {user.email}")
            
            return Response({
                "token": auth_token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "created": created
            })
            
        except ValueError as e:
            logger.error(f"ValueError: {str(e)}")
            return Response({"error": f"Invalid token: {str(e)}"}, status=400)
        except Exception as e:
            logger.error(f"Exception: {str(e)}")
            return Response({"error": f"Authentication failed: {str(e)}"}, status=500)

class GitHubLoginView(APIView):
    def post(self, request):
        code = request.data.get("code")

        # 1️⃣ Exchange code for access_token
        token_url = "https://github.com/login/oauth/access_token"
        client_id = "Ov23li9UjJEiOsYldolY"
        client_secret = "243335a3d62bc4bc7ab3f26ee4e2a41e3b98de93"
        headers = {"Accept": "application/json"}
        data = {"client_id": client_id, "client_secret": client_secret, "code": code}

        token_res = requests.post(token_url, headers=headers, data=data)
        token_json = token_res.json()
        access_token = token_json.get("access_token")

        if not access_token:
            return Response({"error": "Failed to get GitHub token"}, status=400)

        # 2️⃣ Fetch user info
        user_res = requests.get("https://api.github.com/user", headers={
            "Authorization": f"token {access_token}"
        })
        user_json = user_res.json()
        email = user_json.get("email") or f"{user_json['login']}@github.com"

        # 3️⃣ Create or get user in Django
        user, created = User.objects.get_or_create(username=user_json["login"], defaults={"email": email})
        token, _ = Token.objects.get_or_create(user=user)

        return Response({"token": token.key})

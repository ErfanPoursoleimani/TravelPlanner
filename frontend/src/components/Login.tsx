// src/components/Login.tsx
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import axiosInstance from "../api/axiosInstance";

export default function Login() {
  const handleLogin = async (credentialResponse: CredentialResponse) => {
    console.log("Google login response:", credentialResponse);
    
    if (!credentialResponse.credential) {
      console.error("No credential received from Google");
      return;
    }

    try {
      console.log("Token length:", credentialResponse.credential.length);
      console.log("Token preview:", credentialResponse.credential.substring(0, 50) + "...");
      
      const response = await axiosInstance.post("/auth/google/", {
        token: credentialResponse.credential,
      });

      console.log("Backend response:", response.data);

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        axiosInstance.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
        console.log("Login successful! User:", response.data.user);
      }

    } catch (error) {
      console.error("Detailed error:", error);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => {
          console.error("Google OAuth failed");
        }}
      />
    </div>
  );
}
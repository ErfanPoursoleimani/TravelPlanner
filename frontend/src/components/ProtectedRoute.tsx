import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import apiInstance from "../api/axiosInstance";

const ProtectedRoute = ({ children }: { children: ReactNode}) => {
  const token = localStorage.getItem("authToken");

  apiInstance.get("/protected/")
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

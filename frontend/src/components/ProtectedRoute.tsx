import type { ReactNode } from "react";
/* import { Navigate } from "react-router-dom";
import { useProtectedData } from "../hooks/useProtectedData"; */

const ProtectedRoute = ({ children }: { children: ReactNode}) => {
  // const token = localStorage.getItem("authToken");
  // const token = getCookie("auth-token");

  // const { data, loading } = useProtectedData()


  // return loading ? <div>Loading.......</div> : data ? children : <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;

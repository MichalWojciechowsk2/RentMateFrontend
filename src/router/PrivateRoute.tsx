import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {


  const { currentUser: user, loading } = useAuth() as any;


  if (loading) {
    return <div style={{ padding: 50, textAlign: "center" }}>Weryfikacja uprawnień...</div>;
  }


  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
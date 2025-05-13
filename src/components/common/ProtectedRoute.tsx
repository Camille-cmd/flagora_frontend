import { Navigate, Outlet } from "react-router-dom";
import {useAuthContext} from "../../contexts/AuthContext.tsx";

interface ProtectedRouteProps {
  isAuthenticated?: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
};


/*
  Component to render element only if user is authenticated.
  If not, redirect to the specified path.

  @param {boolean} isAuthenticated - Whether the user is authenticated or not.
  @param {string} redirectPath - The path to redirect to if the user is not authenticated.
  @param {React.ReactNode} children - The children to render if the user is authenticated.
*/
export default function ProtectedRoute ({
  redirectPath = "/",
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

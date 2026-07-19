import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getStoredUser } from "../helper/helper";

const USER_ROLES = ["user"];

interface Props {
  children: ReactNode;
}

export default function UserRoute({ children }: Props) {
  const user = getStoredUser();
  if (!user?.token) return <Navigate to="/" replace />;
  if (user.loginStep === 1) return <Navigate to="/login-step" replace />;
  if (!USER_ROLES.includes(user.userRole)) {
    if (user.userRole === "sup") return <Navigate to="/admin" replace />;
    if (user.userRole === "teacher") return <Navigate to="/teacher" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

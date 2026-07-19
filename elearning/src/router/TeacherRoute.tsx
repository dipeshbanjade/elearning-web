import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getStoredUser } from "../helper/helper";

const TEACHER_ROLES = ["teacher"];

interface Props {
  children: ReactNode;
}

export default function TeacherRoute({ children }: Props) {
  const user = getStoredUser();

  // Not logged in, or no token → treat as logged out
  if (!user?.token) return <Navigate to="/" replace />;

  // Wrong role → redirect to the panel that matches their actual role
  if (!TEACHER_ROLES.includes(user?.userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

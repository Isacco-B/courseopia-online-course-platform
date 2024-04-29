import { selectCurrentToken } from "@/features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

export function useAuth() {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;
  let isTeacher = false;
  let status = "student";

  if (token) {
    const decoded = jwtDecode(token.accessToken);
    const { email, role, slug, id } = decoded.UserInfo;

    isTeacher = role.includes("teacher");
    isAdmin = role.includes("admin");
    status = isAdmin ? "admin" : isTeacher ? "teacher" : "student";

    return { email, slug, role, isAdmin, isTeacher, status, id };
  }

  return { email: "", roles: [], isAdmin, isTeacher, status, id: "" };
}

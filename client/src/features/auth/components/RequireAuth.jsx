import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";


export default function RequireAuth({allowedRoles}) {
  const location = useLocation()
  const {role} = useAuth()
  const content = (
    allowedRoles.includes(role) ? (
      <Outlet />
    ) : (
      <Navigate to="/dash" state={{ from: location }} replace />
    )
  )
  return content
}

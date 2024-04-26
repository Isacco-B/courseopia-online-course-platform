/* eslint-disable no-undef */
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGetUserQuery } from "@/features/users/api/usersApiSlice";

export default function AccountStatusChecker() {
  const { slug } = useAuth();
  const { data: user, isSuccess, isError } = useGetUserQuery(slug);

  let content;
  if (isSuccess && user?.active) {
    content = <Outlet />;
  } else if (isError || user?.active === false) {
    content = (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 p-2">
        <h1 className="text-4xl font-bold md:text-6xl">OOPS</h1>
        <p className="text-xl text-center md:text-2xl">
          Il tuo account è stato disabibilitato, per favore contattaci
        </p>
        <Link
          to="/login"
          className="bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:scale-105"
        >
          Login again
        </Link>
      </div>
    );
  }

  return content;
}

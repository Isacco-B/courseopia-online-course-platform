/* eslint-disable no-undef */
import { Link, Outlet } from "react-router-dom";
import { selectCurrentToken } from "../authSlice";
import { useSelector } from "react-redux";
import { useRefreshMutation } from "../api/authApiSlice";
import { useEffect, useRef, useState } from "react";

export default function PersistLogin() {
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isSuccess, isError }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          await refresh();
          setTrueSuccess(true);
        } catch (err) {
          console.error(err);
        }
      };
      if (!token) {
        verifyRefreshToken();
      }
    }

    return () => {
      effectRan.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let content;
  if (isSuccess && trueSuccess) {
    content = <Outlet />;
  } else if (isError) {
    content = (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 p-2">
        <h1 className="text-4xl font-bold md:text-6xl">OOPS</h1>
        <p className="text-xl text-center md:text-2xl">
          Autenticazione non riuscita. La sessione di autenticazione è scaduta.
        </p>
        <Link
          to="/login"
          className="bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:scale-105"
        >
          Login again
        </Link>
      </div>
    );
  } else if (token && isUninitialized) {
    content = <Outlet />;
  }

  return content;
}

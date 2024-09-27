/* eslint-disable no-undef */
import { Outlet, Navigate } from "react-router-dom";
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
    content = <Navigate to="/login" replace />;
  } else if (token && isUninitialized) {
    content = <Outlet />;
  }

  return content;
}

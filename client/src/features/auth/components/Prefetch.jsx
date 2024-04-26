import { store } from "@/app/store";
import { courseApiSlice } from "@/features/course/api/courseApiSlice";
import { masterApiSlice } from "@/features/master/api/masterApiSlice";
import { lessonApiSlice } from "@/features/lessons/api/lessonApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function Prefetch() {
  useEffect(() => {
    store.dispatch(
      courseApiSlice.util.prefetch("getCourses", "coursesList", { force: true})
    );
    store.dispatch(
      masterApiSlice.util.prefetch("getMasters", "mastersList", { force: true })
    );
    store.dispatch(
      lessonApiSlice.util.prefetch("getLessons", "lessonsList", { force: true })
    );
  }, []);
  return <Outlet />;
}

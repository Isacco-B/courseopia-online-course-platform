import { useTitle } from "@/hooks/useTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetCoursesQuery } from "@/features/course/api/courseApiSlice";
import MasterForm from "./MasterForm";
import { useGetCategoriesQuery } from "@/features/category/api/categoryApiSlice";

export default function UpdateMaster({ master }) {
  useTitle("Modifica Master | Courseopia");

  const { courses, isLoading, isError, isSuccess } = useGetCoursesQuery(
    "coursesList",
    {
      selectFromResult: ({ data, isLoading, isError, isSuccess }) => ({
        courses: data,
        isLoading,
        isError,
        isSuccess,
      }),
    }
  );

  const {
    categories,
    isLoadingCategories,
    isErrorCategories,
    isSuccessCategories,
  } = useGetCategoriesQuery("master", {
    selectFromResult: ({ data, isLoading, isError, isSuccess }) => ({
      categories: data,
      isLoadingCategories: isLoading,
      isErrorCategories: isError,
      isSuccessCategories: isSuccess,
    }),
  });

  let content;

  if (isLoading || isLoadingCategories) {
    content = (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || isErrorCategories) {
    content = (
      <div>There was a problem with your request. Please try again.</div>
    );
  }

  if (isSuccess && isSuccessCategories) {
    content = <MasterForm courses={courses} categories={categories} initialValues={master} type={"update"}/>;
  }

  return content;
}

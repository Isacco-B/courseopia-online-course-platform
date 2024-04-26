/* eslint-disable react/prop-types */
import { useGetCategoriesQuery } from "@/features/category/api/categoryApiSlice";
import { useTitle } from "@/hooks/useTitle";
import LessonForm from "./LessonForm";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function UpdateLesson({ lesson }) {
  useTitle("Modifica Lezione | Courseopia");

  const {
    categories,
    isLoadingCategories,
    isErrorCategories,
    isSuccessCategories,
  } = useGetCategoriesQuery("lesson", {
    selectFromResult: ({ data, isLoading, isError, isSuccess }) => ({
      categories: data,
      isLoadingCategories: isLoading,
      isErrorCategories: isError,
      isSuccessCategories: isSuccess,
    }),
  });

  let content;

  if (isLoadingCategories) {
    content = (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isErrorCategories) {
    content = (
      <div>There was a problem with your request. Please try again.</div>
    );
  }

  if (isSuccessCategories) {
    content = (
      <LessonForm
        categories={categories}
        initialValues={lesson}
        type={"update"}
      />
    );
  }

  return content;
}

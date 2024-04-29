import { useGetCategoriesQuery } from "@/features/category/api/categoryApiSlice";
import { useGetLessonsQuery } from "@/features/lessons/api/lessonApiSlice";
import { useGetUsersQuery } from "@/features/users/api/usersApiSlice";
import { useTitle } from "@/hooks/useTitle";
import CourseForm from "./CourseForm";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CreateCourse() {
  useTitle("Aggiungi Corso | Courseopia");

  const {
    categories,
    isLoadingCategories,
    isErrorCategories,
    isSuccessCategories,
  } = useGetCategoriesQuery("course",{
    selectFromResult: ({ data, isLoading, isError, isSuccess }) => ({
      categories: data,
      isLoadingCategories: isLoading,
      isErrorCategories: isError,
      isSuccessCategories: isSuccess,
    }),
  });

  const { lessons, isLoadingLessons, isErrorLessons, isSuccessLessons } =
    useGetLessonsQuery("lessonsList", {
      selectFromResult: ({ data, isLoading, isError, isSuccess }) => ({
        lessons: data,
        isLoadingLessons: isLoading,
        isErrorLessons: isError,
        isSuccessLessons: isSuccess,
      }),
    });

  const { users, isLoadingUsers, isErrorUsers, isSuccessUsers } =
    useGetUsersQuery("usersList", {
      selectFromResult: ({ data, isLoading, isError, isSuccess }) => ({
        users: data,
        isLoadingUsers: isLoading,
        isErrorUsers: isError,
        isSuccessUsers: isSuccess,
      }),
    });

  let content;

  if (isLoadingCategories || isLoadingLessons || isLoadingUsers) {
    content = (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isErrorCategories || isErrorLessons || isErrorUsers) {
    content = (
      <div>There was a problem with your request. Please try again.</div>
    );
  }

  if (isSuccessCategories && isSuccessLessons && isSuccessUsers) {
    content = (
      <CourseForm categories={categories} lessons={lessons} users={users} />
    );
  }

  return content;
}

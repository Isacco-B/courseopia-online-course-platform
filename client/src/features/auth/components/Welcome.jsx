import { SquarePen } from "lucide-react";
import { Link } from "react-router-dom";
import { useTitle } from "@/hooks/useTitle";
import { useAuth } from "@/hooks/useAuth";
import { useGetUserQuery } from "@/features/users/api/usersApiSlice";
import { useGetCoursesQuery } from "@/features/course/api/courseApiSlice";
import CourseCard from "@/features/course/components/CourseCard";
import CourseSkeletonCard from "@/components/Skeleton/CourseSkeletonCard";

export default function Welcome() {
  useTitle("Home | Courseopia");
  const { slug } = useAuth();
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useGetUserQuery(slug);
  const {
    courses,
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
  } = useGetCoursesQuery("coursesList", {
    selectFromResult: ({ data, isLoading, isError, isSuccess }) => ({
      courses: data?.filter((course) =>
        user?.currentMaster?.courses.includes(course?._id)
      ),
      isLoading,
      isError,
      isSuccess,
    }),
  });

  return (
    <div>
      {isErrorUser || isErrorCourses ? (
        <div>There was a problem with your request. Please try again.</div>
      ) : (
        <>
          <section className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="flex flex-row justify-between items-center">
              <h3 className="text-base font-medium mb-2">
                Il Master che hai scelto è:
              </h3>
              <Link to={"/dash/master"}>
                <SquarePen size={16} />
              </Link>
            </div>
            <div className="p-3 bg-primary/15 rounded-lg font-semibold">
              {isLoadingUser ? (
                <p>Loading...</p>
              ) : (
                <>
                  {user?.currentMaster ? (
                    user.currentMaster.title
                  ) : (
                    <Link to={"/dash/master"} className="hover:underline">
                      Seleziona un master
                    </Link>
                  )}
                </>
              )}
            </div>
          </section>
          <section className="mt-20">
            <div>
              <h2 className="font-bold text-2xl mb-4">
                I Corsi del tuo Master:
              </h2>
              {isLoadingCourses ? (
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  {new Array(6).fill(null).map((_, index) => (
                    <CourseSkeletonCard key={index} />
                  ))}
                </div>
              ) : (
                <>
                  {courses?.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {courses?.map((course) => (
                          <CourseCard
                            key={course?._id}
                            course={course}
                            showActionButtons={false}
                            showfooter={false}
                          />
                      ))}
                    </div>
                  ) : (
                    <p>Seleziona un master</p>
                  )}
                </>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

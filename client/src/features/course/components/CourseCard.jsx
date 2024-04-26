/* eslint-disable react/prop-types */
import { BookText, FileCode, Clock, Pen, Trash2, Award } from "lucide-react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useStaticFile } from "@/hooks/useStaticFile";
import useTimeConverter from "@/hooks/useTimeConverter";
import AvatarDisplay from "@/components/AvatarDisplay";
import ToolTip from "@/components/ToolTip";
import { useAuth } from "@/hooks/useAuth";
import DialogComponent from "@/components/DialogComponent";
import UpdateCourse from "./UpdateCourse";
import DeleteCourse from "./DeleteCourse";
import { useGetUserQuery } from "@/features/users/api/usersApiSlice";

export default function CourseCard({
  course,
  showHeader = true,
  showContent = true,
  showfooter = true,
  showActionButtons = true,
}) {
  const { isAdmin, slug } = useAuth();
  const { data: user } = useGetUserQuery(slug);
  const { timeConverter } = useTimeConverter();
  const courseImageUrl = useStaticFile(course?.image);
  const theacherImageUrl = useStaticFile(
    course?.teacher?.profile?.profilePicture
  );
  const navigate = useNavigate();

  const calculateLessonsCompletionPercentage = (
    userLessonsCompleted,
    courseLessons
  ) => {
    const completedLessonsCount = userLessonsCompleted.filter((lessonId) =>
      courseLessons.some((lesson) => lesson._id === lessonId)
    ).length;
    const totalLessons = courseLessons.length;
    const completionPercentage = Math.round(
      (completedLessonsCount / totalLessons) * 100
    );
    return completionPercentage;
  };

  const calculateCourseCompletionPercentage = (
    userCoursesCompleted,
    courseId
  ) => {
    const completedCoursesCount = userCoursesCompleted.filter(
      (course) => course === courseId
    ).length;
    if (completedCoursesCount > 0) {
      return 100;
    } else {
      return 0;
    }
  };

  const completionLessonsPercentage = calculateLessonsCompletionPercentage(
    user?.lessonsCompleted,
    course?.lessons
  );

  const completionCoursePercentage = calculateCourseCompletionPercentage(
    user?.coursesCompleted,
    course?._id
  );

  return (
    <article className="rounded-lg bg-card text-card-foreground shadow-sm p-4 border">
      {showHeader && (
        <div className="flex flex-row items-center gap-4 justify-between max-md:mb-4">
          <div className="max-md:order-1 w-14 h-14">
            <img
              src={
                courseImageUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
              }
              alt="course-logo"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold max-md:mb-4 truncate">
              {course?.title}
            </h1>
            <ul className="flex flex-col md:flex-row md:gap-4">
              <li className="text-sm flex items-start font-semibold md:flex-col md:text-center md:items-center lg:flex-row">
                <Clock className="inline mr-2 " size={20} />
                {timeConverter(course?.theoryDuration)} di Teoria
              </li>
              {course?.project && (
                <li className="text-sm flex items-center font-semibold md:flex-col md:text-center md:items-center lg:flex-row">
                  <Clock className="inline mr-2" size={20} />
                  {timeConverter(course?.projectDuration)} di Prarica
                </li>
              )}

              <li className="text-sm flex items-center font-semibold md:flex-col md:text-center md:items-center lg:flex-row">
                <Award className="inline mr-2" size={20} />
                {course?.maxPoints || 0} pt Max
              </li>
            </ul>
          </div>
          <Button
            variant="default"
            className="hidden text-[12px] px-3 h-8 ml-auto md:block"
            onClick={() => navigate(`/dash/corso/${course.slug}`)}
          >
            VAI AL CORSO
          </Button>
        </div>
      )}
      {showContent && (
        <div className="my-4">
          <p className="text-sm md:w-4/5 text-gray-800 dark:text-muted-foreground line-clamp-3">
            {course?.description}
          </p>
        </div>
      )}

      {showfooter && (
        <div>
          <Separator />
          <p className="text-xs text-muted-foreground mt-4 mb-2 w-24 md:hidden">
            Correggeranno i tuoi Progetti:
          </p>
          <div className="flex flex-row items-center gap-4 md:flex-row justify-between md:mt-4">
            <div className="flex flex-row items-center gap-4 max-md:order-1">
              <Link className="w-12" to={`/dash/corso/${course.slug}`}>
                <CircularProgressbarWithChildren
                  value={completionLessonsPercentage || 0}
                  styles={buildStyles({
                    pathColor: "#16a34a",
                    trailColor: "#16a34a26",
                  })}
                  minValue={0}
                  maxValue={100}
                  strokeWidth={12}
                >
                  <BookText size={22} />
                </CircularProgressbarWithChildren>
              </Link>
              {course?.project && (
                <Link className="w-12" to={`/dash/corso/${course.slug}`}>
                  <CircularProgressbarWithChildren
                    value={completionCoursePercentage}
                    styles={buildStyles({
                      pathColor: "#16a34a",
                      trailColor: "#16a34a26",
                    })}
                    minValue={0}
                    maxValue={100}
                    strokeWidth={12}
                  >
                    <FileCode size={22} />
                  </CircularProgressbarWithChildren>
                </Link>
              )}
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="hidden text-xs text-muted-foreground md:block">
                Correggeranno i tuoi Progetti:
              </p>
              <ToolTip
                content={`${course?.teacher?.firstName} ${course?.teacher?.lastName}`}
                trigger={
                  <div>
                    <AvatarDisplay
                      src={theacherImageUrl}
                      alt="avatar"
                      fallbackText={
                        course?.teacher?.firstName?.slice(0, 2) || "CO"
                      }
                      className="w-10 h-10"
                    />
                  </div>
                }
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between w-full ">
        <Button
          variant="default"
          className="text-[12px] px-5 h-8 md:hidden mt-4"
          onClick={() => navigate(`/dash/corso/${course.slug}`)}
        >
          VAI AL CORSO
        </Button>
        <div className="hidden md:block"></div>
        {isAdmin && showActionButtons && (
          <div className="flex flex-row gap-4 items-center justify-end mt-4">
            <ToolTip
              content="Modifica corso"
              trigger={
                <div>
                  <DialogComponent
                    content={<UpdateCourse course={course} />}
                    title={`Modifica corso | ${course.slug}`}
                  >
                    <Pen className="w-5 h-5 cursor-pointer hover:scale-110" />
                  </DialogComponent>
                </div>
              }
            />
            <ToolTip
              content="Elimina corso"
              trigger={
                <div>
                  <DialogComponent
                    content={<DeleteCourse courseId={course._id} />}
                    title={`Elimina corso | ${course.slug}`}
                    description={"Sei sicuro di voler eliminare questa corso?"}
                  >
                    <Trash2 className="w-5 h-5 cursor-pointer hover:scale-110" />
                  </DialogComponent>
                </div>
              }
            />
          </div>
        )}
      </div>
    </article>
  );
}

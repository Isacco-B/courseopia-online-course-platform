import { Button } from "@/components/ui/button";
import CourseCard from "@/features/course/components/CourseCard";
import useTimeConverter from "@/hooks/useTimeConverter";

/* eslint-disable react/prop-types */
export default function MasterDetail({
  master,
  handleSetCurrentMaster,
  isLoading,
  courseProjects,
  totalProjectDuration,
  totalTheoryDuration,
}) {
  const { courses } = master;
  const { timeConverter } = useTimeConverter();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Programma del {master.title}</h1>
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-8">
        <div className="flex gap-3">
          <div className="border-[2px] border-black dark:border-gray-500 rounded-sm py-1 px-2 font-semibold text-sm w-36">
            <span className="font-bold text-lg">{master.courses?.length}</span>{" "}
            course Teoriche
          </div>
          {courseProjects > 0 && (
            <div className="border-[2px] border-black dark:border-gray-500 rounded-sm py-1 px-2 font-semibold text-sm w-36">
              <span className="font-bold text-lg">{courseProjects}</span>{" "}
              Progetti Pratici
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <div className="border-[2px] border-black dark:border-gray-500 rounded-sm py-1 px-2 font-semibold text-sm w-36">
            <span className="font-bold text-lg">
              {timeConverter(totalTheoryDuration)}
            </span>{" "}
            Teoria
          </div>
          {courseProjects > 0 && (
            <div className="border-[2px] border-black dark:border-gray-500 rounded-sm py-1 px-2 font-semibold text-sm w-36">
              <span className="font-bold text-lg">
                {timeConverter(totalProjectDuration)}
              </span>{" "}
              Pratica
            </div>
          )}
        </div>
      </div>

      <h3 className="text-1xl font-bold mb-4">Corsi</h3>
      <div className="h-[200px] overflow-y-auto pr-2 md:pr-4">
        {courses.map((course) => (
          <div key={course._id} className="mb-4">
            <CourseCard
              course={course}
              showfooter={false}
              showActionButtons={false}
            />
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Button
          variant="default"
          className="font-semibold mr-3"
          onClick={handleSetCurrentMaster}
          disabled={isLoading}
        >
          Inizia Master
        </Button>
      </div>
    </div>
  );
}

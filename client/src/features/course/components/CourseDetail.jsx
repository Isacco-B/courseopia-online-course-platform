import { FileUploader } from "react-drag-drop-files";
import { Accordion } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SquarePen, FileCode, UploadCloud } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetCourseQuery } from "../api/courseApiSlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useGetUserQuery } from "@/features/users/api/usersApiSlice";
import LessonAccordion from "@/features/lessons/components/LessonAccordion";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ProjectForm from "@/features/project/components/ProjectForm";
import { useGetProjectsQuery } from "@/features/project/api/projectApiSlice";
import ProjectCard from "@/features/project/components/ProjectCard";

const fileTypes = ["PDF"];

export default function CourseDetail() {
  const [file, setFile] = useState(null);
  const { slug } = useParams();
  const { toast } = useToast();
  const { slug: userSlug, id } = useAuth();
  const { data: course, isLoading, isError } = useGetCourseQuery(slug);
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useGetUserQuery(userSlug);


  const { projects, isLoadingProjects, isErrorProjects } = useGetProjectsQuery(
    "projectsList",
    {
      selectFromResult: ({ data, isLoading, isError }) => ({
        projects: data?.filter(
          (project) =>
            project?.createdBy._id === id && project.course._id === course?._id
        ),
        isLoadingProjects: isLoading,
        isErrorProjects: isError,
      }),
    }
  );

  if (isLoading || isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || isErrorUser) {
    return <div>Impossibile caricare il corso.</div>;
  }

  const { lessons } = course;

  const completedLessonIds = user?.lessonsCompleted ?? [];
  const allLessonIds = lessons.map((lesson) => lesson._id);
  const isAllLessonsCompleted = allLessonIds.every((lessonId) =>
    completedLessonIds.includes(lessonId)
  );

  const handleChange = (file) => {
    setFile(file);
  };

  return (
    <>
      <Tabs defaultValue="lessons">
        <TabsList className="flex flex-row justify-between overflow-x-auto ">
          <TabsTrigger
            value="lessons"
            className="data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:shadow-md rounded-t-md border bg-card text-card-foreground shadow-sm p-4 flex-1 min-w-32 flex-shrink-0 h-24"
          >
            <div className="flex flex-col items-center gap-2">
              <SquarePen size={28} />
              <p className="text-sm">Teoria</p>
            </div>
          </TabsTrigger>
          {course?.project && (
            <TabsTrigger
              value="project"
              className="data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:shadow-md rounded-t-md border bg-card text-card-foreground shadow-sm p-4 flex-1 min-w-32 flex-shrink-0 h-24"
              disabled={!isAllLessonsCompleted}
            >
              <div className="flex flex-col items-center gap-2">
                <FileCode size={28} />
                <p className="text-sm">Progetto</p>
              </div>
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="lessons">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="my-2">
              <h1 className="text-xl font-bold">{course?.title}</h1>
            </div>
            <Accordion type="single" collapsible>
              {lessons.map((lesson) => (
                <LessonAccordion lesson={lesson} user={user} key={lesson._id} />
              ))}
            </Accordion>
          </div>
        </TabsContent>
        <TabsContent value="project">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <h3 className="text-xl font-bold">Consegna il Progetto</h3>
            <p className="text-sm">
              Carica un progetto per completare il corso.
            </p>
            <div className="mt-8">
              <FileUploader
                handleChange={handleChange}
                name="file"
                types={fileTypes}
                multiple={false}
                required={true}
                maxSize={5}
                onTypeError={() => {
                  toast({
                    title: "File non supportato",
                    description:
                      "Questo tipo di file non è supportato. Per favore, carica un file PDF.",
                    variant: "destructive",
                  });
                }}
                onSizeError={() => {
                  toast({
                    title: "File troppo grande",
                    description:
                      "Il file caricato è troppo grande. Per favore, carica un file PDF.",
                    variant: "destructive",
                  });
                }}
              >
                <div className="w-full h-64 border-dotted border-green-500 rounded-lg border-2 ">
                  {file ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <UploadCloud size={64} opacity={0.5} />
                      <p className="text-sm font-semibold">{file.name}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <UploadCloud size={64} opacity={0.5} />
                      <p className="text-sm font-semibold">
                        Drag & Drop to Upload File (PDF)
                      </p>
                      <p>OR</p>
                      <p className="text-sm font-semibold p-3 bg-primary text-white rounded-lg cursor-pointer hover:scale-105">
                        Click to Select File
                      </p>
                    </div>
                  )}
                </div>
              </FileUploader>
              <div className="text-center mt-6">
                <ProjectForm
                  file={file}
                  setFile={setFile}
                  userId={id}
                  courseId={course._id}
                />
              </div>
            </div>
            <div className="mt-8">
              <p className="text-lg font-bold">File Caricati</p>
              {projects?.length === 0 && <p>Nessun file caricato</p>}
              <div className="mt-4">
                {isLoadingProjects && <p>Caricamento progetti...</p>}
                {isErrorProjects && <p>Errore caricamento progetti</p>}
              </div>
              <div className="flex flex-col gap-2 mt-4">
                {projects &&
                  projects?.map((project) => (
                    <ProjectCard
                      project={project}
                      key={project._id}
                      course={course}
                      showActions={false}
                    />
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

/* eslint-disable react/prop-types */
import DialogComponent from "@/components/DialogComponent";
import { Button } from "@/components/ui/button";
import { useStaticFile } from "@/hooks/useStaticFile";
import { format } from "date-fns";
import { CalendarDays, CircleDot, Pen } from "lucide-react";
import UpdateProjectForm from "./UpdateProjectForm";
import { cn } from "@/lib/utils";

export default function ProjectCard({
  project,
  course,
  showActions = true,
  shoButtons = true,
}) {
  const formattedDate = format(new Date(project.createdAt), "M/d/yyyy HH:mm");
  const projectUrl = useStaticFile(project?.file);

  return (
    <article className="rounded-lg bg-card text-card-foreground  py-2 px-4 border flex flex-col gap-2 justify-between lg:flex-row">
      <div className="flex flex-row items-center gap-4">
        <p className="w-32 truncate">
          {project.createdBy?.firstName + " " + project.createdBy?.lastName}
        </p>
        <div>
          {project.isCorrect ? (
            <div className="flex gap-1 items-center">
              <CircleDot
                size={18}
                className={`${
                  project.isPassed ? "text-green-600" : "text-red-600"
                }`}
              />
              <p
                className={cn(
                  "text-sm font-semibold inline-flex gap-1",
                  project.isPassed ? "text-green-500" : "text-red-500"
                )}
              >
                Corretto
              </p>
            </div>
          ) : (
            <div className="flex gap-1 items-center">
              <CircleDot size={18} className="text-orange-600" />
              <p className="text-orange-500 text-sm font-semibold inline-flex gap-1">
                In corso
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="inline-flex items-center gap-1 text-sm">
        <span>
          <CalendarDays size={18} />
        </span>
        {formattedDate}
      </p>
      <div className="flex gap-2 items-center w-60 justify-start lg:justify-end">
        {shoButtons && (
          <>
            {project.isCorrect && (
              <DialogComponent
                title={"Feedback Progetto"}
                description={`Progetto corretto da ${project.correctedBy?.firstName} ${project.correctedBy?.lastName}`}
                content={project?.description}
              >
                <Button variant="outline" className="h-8">
                  FeedBack
                </Button>
              </DialogComponent>
            )}
          </>
        )}

        <Button className="h-8">
          <a href={projectUrl} download={"project.pdf"}>
            Download
          </a>
        </Button>
        {showActions && !project.isCorrect && (
          <DialogComponent
            title={"Correggi progetto"}
            description={`Valuta il progetto di ${project.createdBy?.firstName} ${project.createdBy?.lastName}`}
            content={
              <div className="mt-4">
                <UpdateProjectForm course={course} projectId={project._id} />
              </div>
            }
          >
            <Pen size={18} className="cursor-pointer" />
          </DialogComponent>
        )}
      </div>
    </article>
  );
}

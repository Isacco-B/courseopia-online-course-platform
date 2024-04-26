import { Trash2, Pen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ToolTip from "@/components/ToolTip";
import DialogComponent from "@/components/DialogComponent";
import UpdateLesson from "./UpdateLesson";
import DeleteLesson from "./DeleteLesson";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
export default function LessonCard({ lesson, showActionButtons = true }) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <article className="bg-card shadow-sm border rounded-lg p-2 w-full">
      <div className="flex flex-row justify-between items-center gap-2 mb-4">
        <h3
          className="text-xl font-bold pl-4 truncate hover:underline hover:cursor-pointer"
          onClick={() => navigate(`/dash/lezione/${lesson.slug}`)}
        >
          {lesson?.title}
        </h3>
        <Badge className={"p-2 h-6"}>
          {lesson?.category?.title || "Uncategorized"}
        </Badge>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: lesson && lesson.content,
        }}
        className="ql-editor quill-content truncate line-clamp-3 max-h-44"
      ></div>
      {isAdmin && showActionButtons && (
        <div className="flex flex-row gap-4 items-center p-3">
          <ToolTip
            content="Modifica lezione"
            trigger={
              <div>
                <DialogComponent
                  content={<UpdateLesson lesson={lesson} />}
                  title={`Modifica lezione | ${lesson.slug}`}
                >
                  <Pen className="w-5 h-5 cursor-pointer hover:scale-110" />
                </DialogComponent>
              </div>
            }
          />
          <ToolTip
            content="Elimina lezione"
            trigger={
              <div>
                <DialogComponent
                  content={<DeleteLesson lessonId={lesson._id} />}
                  title={`Elimina lezione | ${lesson.slug}`}
                  description={"Sei sicuro di voler eliminare questa lezione?"}
                >
                  <Trash2 className="w-5 h-5 cursor-pointer hover:scale-110" />
                </DialogComponent>
              </div>
            }
          />
        </div>
      )}
    </article>
  );
}

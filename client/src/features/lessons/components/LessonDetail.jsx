import { useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetLessonQuery } from "../api/lessonApiSlice";
import { Badge } from "@/components/ui/badge";

export default function LessonDetail() {
  const { slug } = useParams();

  const { data: lesson, isLoading, isError } = useGetLessonQuery(slug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <div>Impossibile caricare lezione.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row justify-between items-center bg-card shadow-sm border rounded-lg p-4">
        <h3 className="text-xl font-bold pl-4 truncate">{lesson?.title}</h3>
        <div className="inline-flex gap-2 items-center">
          <Badge>{lesson?.category?.title || "Uncategorized"}</Badge>
          <p>{new Date(lesson?.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: lesson && lesson.content,
        }}
        className="ql-editor quill-content bg-card shadow-sm border rounded-lg p-8"
      ></div>
    </div>
  );
}


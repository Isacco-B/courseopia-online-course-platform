/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { useDeleteLessonMutation } from "../api/lessonApiSlice";
import { toast } from "@/components/ui/use-toast";

export default function DeleteLesson({ lessonId }) {
  const [deleteLesson, { isLoading }] = useDeleteLessonMutation();

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await deleteLesson(lessonId).unwrap();
      toast({
        variant: "default",
        title: "Lesson deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error?.data?.message ||
          "There was a problem with your request. Please try again.",
      });
    }
  };

  return (
    <div className="max-sm:text-center">
      <Button variant="destructive" onClick={handleSubmit}>
        {isLoading ? "Loading..." : "Elimina"}
      </Button>
    </div>
  );
}

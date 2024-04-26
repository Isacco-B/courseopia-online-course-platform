/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDeleteCourseMutation } from "../api/courseApiSlice";

export default function DeleteCourse({ courseId }) {
  const [deleteCourse, { isLoading }] = useDeleteCourseMutation();

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await deleteCourse(courseId).unwrap();
      toast({
        variant: "default",
        title: "Course deleted successfully",
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

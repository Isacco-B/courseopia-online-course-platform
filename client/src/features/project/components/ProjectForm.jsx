/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { useCreateProjectMutation } from "../api/projectApiSlice";
import { useToast } from "@/components/ui/use-toast";

export default function ProjectForm({ file, setFile, userId, courseId }) {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { toast } = useToast();

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("projects", file);
      formData.append("createdBy", userId);
      formData.append("course", courseId);

      await createProject({userId, formData}).unwrap();
      setFile(null);
      toast({
        title: "Success!",
        description: "You have successfully created a project.",
      });
    } catch (error) {
      setFile(null);
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
    <Button
      className="w-1/2"
      type="submit"
      disabled={!file || isLoading}
      onClick={handleSave}
    >
      Upload
    </Button>
  );
}

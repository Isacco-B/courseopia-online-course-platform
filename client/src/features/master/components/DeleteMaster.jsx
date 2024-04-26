/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDeleteMasterMutation } from "../api/masterApiSlice";

export default function DeleteMaster({ masterId }) {
  const [deleteMaster, { isLoading }] = useDeleteMasterMutation();

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await deleteMaster(masterId).unwrap();
      toast({
        variant: "default",
        title: "Master deleted successfully",
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

/* eslint-disable react/prop-types */
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useUpdateProjectMutation } from "../api/projectApiSlice";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function UpdateProjectForm({ course, projectId }) {
  const [updateProject, { isLoading }] = useUpdateProjectMutation();
  const [formData, setFormData] = useState({
    isPassed: true,
    description: "",
    projectPoints: 0,
  });

  const { id } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProject({
        formData: {
          ...formData,
          isCorrect: true,
          correctedBy: id,
        },
        projectId: projectId,
      });
      toast({
        variant: "default",
        title: "Project corrected successfully.",
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

  const projectOptions = [
    {
      value: "true",
      label: "Si",
    },
    {
      value: "false",
      label: "No",
    },
  ];

  const canSave = formData.isPassed
    ? formData.description && formData.projectPoints
    : formData.description;


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <FormSelect
            id="isPassed"
            value={formData.isPassed === true ? "true" : "false"}
            label="Progetto Valido*"
            onChange={(value) =>
              setFormData({
                ...formData,
                isPassed: value === "true" ? true : false,
                projectPoints: 0,
              })
            }
            required={true}
            className="w-full"
            placeholder={"Seleziona una opzione"}
            options={projectOptions}
          />
          {formData.isPassed && (
            <FormInput
              label={`Punti Progetto (Max ${course?.maxPoints} Punti)`}
              id="projectPoints"
              placeholder="Punti Progetto"
              value={formData.projectPoints}
              onChange={handleChange}
              type="number"
              className="w-full"
              required={true}
            />
          )}

          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Descrizione*</Label>
            <Textarea
              placeholder="Descrizione"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-1/2 mx-auto"
            disabled={!canSave || isLoading}
          >
            Invia
          </Button>
        </div>
      </form>
    </div>
  );
}

/* eslint-disable react/prop-types */
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useCreateLessonMutation,
  useUpdateLessonMutation,
} from "../api/lessonApiSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import DialogComponent from "@/components/DialogComponent";
import { CategoryForm } from "@/features/category/components/CategoryForm";
import { toolbarOptions } from "@/constants";
import { cn } from "@/lib/utils";

export default function LessonForm({ categories, initialValues, type }) {
  const [formData, setFormData] = useState({
    title: initialValues?.title || "",
    duration: initialValues?.duration || "",
    category: initialValues?.category?._id || "",
    content: initialValues?.content || "",
  });
  const [createLesson, { isLoading }] = useCreateLessonMutation();
  const [updateLesson, { isLoading: isLoadingUpdate }] =
    useUpdateLessonMutation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      if (type === "update") {
        await updateLesson({ id: initialValues?._id, formData }).unwrap();
      } else {
        await createLesson(formData).unwrap();
      }
      toast({
        variant: "default",
        title: "Lesson created successfully",
      });
      setTimeout(() => {
        navigate("/dash/lezioni");
      }, 1000);
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

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.title,
  }));

  const canSave =
    formData.title &&
    formData.duration &&
    formData.category &&
    formData.content;

  return (
    <div
      className={cn(
        "w-full bg-card rounded-lg p-2",
        type !== "update" && "p-4 py-12 border-card border shadow-sm"
      )}
    >
      <form
        className="flex flex-col gap-6 max-w-4xl mx-auto"
        onSubmit={handleSubmit}
      >
        <FormInput
          label="Titolo*"
          id="title"
          placeholder="Titolo"
          value={formData.title}
          onChange={handleChange}
          type="text"
          className={"w-full"}
          required={true}
        />
        <div className="flex flex-col items-center justify-between lg:flex-row gap-4">
          <FormInput
            label="Durata lezione*"
            id="duration"
            placeholder="Durata lezione in minuti"
            value={formData.duration}
            onChange={handleChange}
            className="w-full lg:max-w-sm"
            type="number"
            required={true}
          />
          <div className="w-full lg:max-w-sm">
            <FormSelect
              id="category"
              value={formData.category}
              label="Categoria*"
              className={"flex flex-row gap-1 items-center"}
              onChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              required={true}
              placeholder={"Seleziona una opzione"}
              options={categoryOptions}
            >
              <DialogComponent
                title="Aggiungi una categoria"
                content={<CategoryForm type="lesson" />}
              >
                <Plus className="h-8 w-8 text-primary hover:cursor-pointer" />
              </DialogComponent>
            </FormSelect>
          </div>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="content">Content</Label>
          <ReactQuill
            theme="snow"
            modules={{ toolbar: toolbarOptions }}
            placeholder="Write something..."
            id="content"
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            required
          />
        </div>
        <Button
          variant="default"
          type="submit"
          className="w-1/3 mx-auto"
          disabled={!canSave || isLoading}
        >
          {isLoading || isLoadingUpdate ? "Loading..." : "Save"}
        </Button>
      </form>
    </div>
  );
}

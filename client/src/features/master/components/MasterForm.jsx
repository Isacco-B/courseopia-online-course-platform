/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import FormInput from "@/components/FormInput";
import { cn } from "@/lib/utils";
import {
  useCreateMasterMutation,
  useUpdateMasterMutation,
} from "../api/masterApiSlice";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/MultiSelect";
import { Reorder } from "framer-motion";
import CourseCard from "@/features/course/components/CourseCard";
import FormSelect from "@/components/FormSelect";
import DialogComponent from "@/components/DialogComponent";
import { CategoryForm } from "@/features/category/components/CategoryForm";
import { Plus } from "lucide-react";

export default function MasterForm({
  courses,
  categories,
  initialValues,
  type,
}) {
  const [selected, setSelected] = useState(
    initialValues?.courses?.map(({ _id }) => _id) || []
  );
  const [formData, setFormData] = useState({
    title: initialValues?.title || "",
    description: initialValues?.description || "",
    category: initialValues?.category?._id || "",
  });
  const [createMaster, { isLoading }] = useCreateMasterMutation();
  const [updateMaster, { isLoading: isLoadingUpdate }] =
    useUpdateMasterMutation();
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
        await updateMaster({
          id: initialValues?._id,
          formData: { ...formData, courses: selected },
        }).unwrap();
      } else {
        await createMaster({ ...formData, courses: selected }).unwrap();
      }
      toast({
        variant: "default",
        title: `Master ${
          type === "update" ? "updated" : "created"
        } successfully`,
      });
      setTimeout(() => {
        navigate("/dash/master");
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

  const coursesOptions = courses.map((course) => ({
    value: course._id,
    label: course.title,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.title,
  }));

  const canSave = formData.title && formData.description && selected.length > 0;

  return (
    <div
      className={cn(
        "w-full bg-card rounded-lg p-2",
        type !== "update" && "p-4 py-12 border-card border shadow-sm "
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
        <div className="grid w-full gap-1.5">
          <Label htmlFor="description">Descrizione*</Label>
          <Textarea
            placeholder="Descrizione del master"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <FormSelect
            id="category"
            value={formData.category}
            label="Categoria*"
            className={"flex flex-row gap-1 items-center"}
            onChange={(value) => setFormData({ ...formData, category: value })}
            required={true}
            placeholder={"Seleziona una opzione"}
            options={categoryOptions}
          >
            <DialogComponent
              title="Aggiungi una categoria"
              content={<CategoryForm type="master" />}
            >
              <Plus className="h-8 w-8 text-primary hover:cursor-pointer" />
            </DialogComponent>
          </FormSelect>
        </div>
        <div>
          <Label htmlFor="lessons">Corsi*</Label>
          <MultiSelect
            id="courses"
            options={coursesOptions}
            selected={selected}
            onChange={setSelected}
            className="w-[250px] md:w-[560px] lg:w-[720px]"
            placeholder={"Seleziona un corso"}
            required
          />
        </div>
        <div>
          <Reorder.Group
            axis="y"
            values={selected}
            onReorder={setSelected}
            className="flex flex-col gap-4"
          >
            {selected.map((course) => (
              <Reorder.Item key={course} value={course}>
                <div className="cursor-move">
                  <CourseCard
                    course={courses.filter((c) => c._id === course)[0]}
                    showActionButtons={false}
                    showfooter={false}
                  />
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
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

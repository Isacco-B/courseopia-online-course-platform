import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../api/courseApiSlice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Reorder } from "framer-motion";
import { MultiSelect } from "@/components/MultiSelect";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import LessonCard from "@/features/lessons/components/LessonCard";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import DialogComponent from "@/components/DialogComponent";
import { CategoryForm } from "@/features/category/components/CategoryForm";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* eslint-disable react/prop-types */
export default function CourseForm({
  categories,
  lessons,
  users,
  initialValues,
  type,
}) {
  const [selected, setSelected] = useState(
    initialValues?.lessons?.map(({ _id }) => _id) || []
  );
  const [courseFormData, setCourseFormData] = useState({
    title: initialValues?.title || "",
    description: initialValues?.description || "",
    teacher: initialValues?.teacher?._id || "",
    project: initialValues?.project || true,
    projectDuration: initialValues?.projectDuration || "",
    maxPoints: initialValues?.maxPoints || "",
    category: initialValues?.category?._id || "",
    lessons: initialValues?.lessons || [],
  });
  const [file, setFile] = useState(null);
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isLoadingUpdate }] =
    useUpdateCourseMutation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (selected.length > 0) {
      setCourseFormData((prevState) => ({
        ...prevState,
        lessons: selected,
      }));
    }
  }, [selected]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("courses", file);
      formData.append("title", courseFormData.title);
      formData.append("description", courseFormData.description);
      formData.append("teacher", courseFormData.teacher);
      formData.append("project", courseFormData.project);
      formData.append("maxPoints", courseFormData.maxPoints);
      formData.append("lessons", JSON.stringify(selected));
      formData.append("category", courseFormData.category);

      if (courseFormData?.project) {
        formData.append("projectDuration", courseFormData.projectDuration);
      }

      if (type === "update") {
        await updateCourse({ id: initialValues?._id, formData }).unwrap();
      } else {
        await createCourse(formData).unwrap();
      }
      toast({
        variant: "default",
        title: `Course ${
          type === "update" ? "updated" : "created"
        } successfully`,
      });
      setTimeout(() => {
        navigate("/dash/corsi");
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

  const lessonsOptions = lessons.map((lesson) => ({
    value: lesson._id,
    label: lesson.title,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.title,
  }));

  const teacherOptions = users
    .filter((user) => user.role === "teacher")
    .map((user) => ({
      value: user._id,
      label: `${user.firstName} ${user.lastName}`,
    }));

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

  const canSave =
    courseFormData.title &&
    courseFormData.description &&
    courseFormData.teacher &&
    courseFormData.lessons &&
    courseFormData.category &&
    courseFormData.maxPoints;

  return (
    <div
      className={cn(
        "w-full bg-card rounded-lg p-2",
        type !== "update" && "p-4 py-12 border-card border shadow-sm"
      )}
    >
      <form
        className="flex flex-col gap-6 max-w-4xl mx-auto"
        onSubmit={handleSave}
      >
        <FormInput
          label="Titolo*"
          id="title"
          placeholder="Titolo"
          value={courseFormData.title}
          onChange={handleChange}
          type="text"
          className="w-full"
          required={true}
        />
        <div>
          <Label htmlFor="file">Immagine</Label>
          <Input
            id="file"
            filename={file}
            onChange={(e) => setFile(e.target?.files[0])}
            className="w-full"
            type="file"
            accept="image/*"
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="description">Descrizione*</Label>
          <Textarea
            placeholder="Descrizione"
            id="description"
            name="description"
            value={courseFormData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col items-center justify-between lg:flex-row gap-4">
          <FormSelect
            id="teacher"
            value={courseFormData.teacher}
            label="Insegnate*"
            onChange={(value) =>
              setCourseFormData({ ...courseFormData, teacher: value })
            }
            required={true}
            className="w-full lg:max-w-sm"
            placeholder={"Seleziona una opzione"}
            options={teacherOptions}
          />
          <div className="w-full lg:max-w-sm">
            <FormSelect
              id="category"
              value={courseFormData.category}
              label="Categoria*"
              className={"flex flex-row gap-1 items-center"}
              onChange={(value) =>
                setCourseFormData({ ...courseFormData, category: value })
              }
              required={true}
              placeholder={"Seleziona una opzione"}
              options={categoryOptions}
            >
              <DialogComponent
                title="Aggiungi una categoria"
                content={<CategoryForm type="course" />}
              >
                <Plus className="h-8 w-8 text-primary hover:cursor-pointer" />
              </DialogComponent>
            </FormSelect>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between lg:flex-row gap-4">
          <FormSelect
            id="project"
            value={courseFormData.project === true ? "true" : "false"}
            label="Progetto pratico*"
            onChange={(value) =>
              setCourseFormData({
                ...courseFormData,
                project: value === "true" ? true : false,
              })
            }
            required={true}
            className="w-full lg:max-w-sm"
            placeholder={"Seleziona una opzione"}
            options={projectOptions}
          />
          {courseFormData.project && (
            <FormInput
              label="Durata progetto pratico*"
              id="projectDuration"
              placeholder="Durata progetto in minuti"
              value={courseFormData.projectDuration}
              onChange={handleChange}
              className="w-full lg:max-w-sm"
              type="number"
              required={true}
            />
          )}
        </div>
        <div className="flex flex-col items-center justify-between lg:flex-row gap-4">
          <FormInput
            label="Punti massimi progetto*"
            id="maxPoints"
            placeholder="Punti massimi per progetto"
            value={courseFormData.maxPoints}
            onChange={handleChange}
            className="w-full lg:max-w-sm"
            type="number"
            required={true}
          />
          <div className="grid w-full lg:max-w-sm items-center gap-1.5"></div>
        </div>

        <div>
          <Label htmlFor="lessons">Lezioni*</Label>
          <MultiSelect
            id="lessons"
            options={lessonsOptions}
            selected={selected}
            onChange={setSelected}
            className="w-[250px] md:w-[560px] lg:w-[720px]"
            placeholder={"Seleziona una lezione"}
            required
          />
        </div>
        <div
          className={`${
            type === "update" ? "w-[330px] md:w-[600px] mx-auto" : "w-full"
          }`}
        >
          <Reorder.Group
            axis="y"
            values={selected}
            onReorder={setSelected}
            className="flex flex-col gap-4"
          >
            {selected.map((lesson) => (
              <Reorder.Item key={lesson} value={lesson}>
                <div className="cursor-move">
                  <LessonCard
                    lesson={lessons.filter((l) => l._id === lesson)[0]}
                    showActionButtons={false}
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
          disabled={!canSave || isLoading || isLoadingUpdate}
        >
          {isLoading || isLoadingUpdate ? "Loading..." : "Save"}
        </Button>
      </form>
    </div>
  );
}

/* eslint-disable react/prop-types */
import { useCreateCategoryMutation } from "../api/categoryApiSlice";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";


export function CategoryForm({ type }) {
  const [formData, setFormData] = useState({
    title: "",
  });
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await createCategory({ formData, type }).unwrap();
      setFormData({ title: "" });
      toast({
        variant: "default",
        title: "Category created successfully",
      });
    } catch (error) {
      setFormData({ title: "" });
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error?.data?.errors[0]?.msg,
      });
    }
  };
  return (
    <div className="grid gap-4 py-4">
      <FormInput
        label="Nome*"
        id="category"
        placeholder="Nome"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        type="text"
        className={"w-full"}
        required={true}
      />
      <Button onClick={handleSave} disabled={isLoading}>
        Salva
      </Button>
    </div>
  );
}

/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useUpdateProfileMutation } from "../api/profileApiSlice";
import { useEffect, useState } from "react";

export default function DescriptionForm({ profile }) {
  const { toast } = useToast();
  const [profileFormData, setProfileFormData] = useState({
    description: profile?.description || "",
  });
  const [originalProfileFormData, setOriginalProfileFormData] = useState({});
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    setOriginalProfileFormData(profileFormData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profileChanged =
    JSON.stringify(profileFormData) !== JSON.stringify(originalProfileFormData);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const userId = profile?.user?._id.toString();
      if (profileChanged) {
        await updateProfile({ userId, ...profileFormData }).unwrap();
        setOriginalProfileFormData(profileFormData);
      }
      toast({
        variant: "default",
        title: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error?.data?.errors[0]?.msg ||
          "There was a problem with your request. Please try again.",
      });
    }
  }

  const canSave =
    profileChanged && !isLoading && profileFormData?.description?.length <= 500;

  return (
    <form
      className="max-w-4xl mx-auto flex flex-col gap-6 items-center"
      onSubmit={handleSubmit}
    >
      <p className="text-sm text-start w-full mb-[-1rem]">
        Massimo 500 caratteri
      </p>
      <ReactQuill
        theme="snow"
        placeholder="Write something..."
        id="content"
        className="bg-background dark:text-white w-full"
        value={profileFormData?.description}
        onChange={(value) =>
          setProfileFormData({ ...profileFormData, description: value })
        }
      />

      <Button
        variant="default"
        type="submit"
        disabled={!canSave}
        className="sm:w-1/3 w-full text-center"
      >
        {isLoading ? "Loading..." : "Salva Modifiche"}
      </Button>
    </form>
  );
}

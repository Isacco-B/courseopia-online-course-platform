/* eslint-disable react/prop-types */
import { useState } from "react";
import AvatarDisplay from "./AvatarDisplay";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Save } from "lucide-react";
import { Label } from "./ui/label";
import { useUpdateProfileImageMutation } from "@/features/profile/api/profileApiSlice";
import { useToast } from "./ui/use-toast";
import { useStaticFile } from "@/hooks/useStaticFile";

export default function PhotoUploaderForm({ profile }) {
  const { toast } = useToast();
  const [file, setFile] = useState("");
  const imageUrl = useStaticFile(profile?.profilePicture);
  const [updateProfileImage, { isLoading }] = useUpdateProfileImageMutation();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const userId = profile.user?._id;
      const userSlug = profile.user?.slug;
      const formData = new FormData();
      formData.append("avatars", file);
      await updateProfileImage({ userId, userSlug, formData }).unwrap();
      setFile("");
      toast({
        variant: "default",
        title: "Profile updated successfully",
      });
    } catch (error) {
      setFile("");
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error?.data?.message||
          "There was a problem with your request. Please try again.",
      });
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-center gap-4"
      onSubmit={submit}
    >
      <AvatarDisplay
        src={file ? URL.createObjectURL(file) : imageUrl}
        alt="avatar"
        fallbackText={"CO"}
        size={24}
      />
      <div className="grid w-full items-center gap-1.5 max-w-sm">
        <Label htmlFor="file">Immagine profilo</Label>
        <div className="flex flex-row gap-2">
          <div className="w-full">
            <Input
              id="file"
              filename={file}
              onChange={(e) => setFile(e.target?.files[0])}
              type="file"
              accept="image/*"
            />
          </div>
          <Button type="submit" disabled={isLoading || !file}>
            <Save size={20} />
          </Button>
        </div>
      </div>
    </form>
  );
}

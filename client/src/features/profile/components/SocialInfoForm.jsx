/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useUpdateProfileMutation } from "../api/profileApiSlice";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import FormInput from "@/components/FormInput";

export default function SocialInfoForm({ profile }) {
  const { toast } = useToast();

  const [profileFormData, setProfileFormData] = useState({
    instagram: profile?.instagram || "",
    facebook: profile?.facebook || "",
    linkedin: profile?.linkedin || "",
    twitter: profile?.twitter || "",
    github: profile?.github || "",
    website: profile?.website || "",
  });
  const [originalProfileFormData, setOriginalProfileFormData] = useState({});
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    setOriginalProfileFormData(profileFormData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setProfileFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

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

  const canSave = profileChanged && !isLoading;

  return (
    <form
      className="flex flex-col gap-6 max-w-4xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center justify-between lg:flex-row gap-4">
        <FormInput
          label="Instagram"
          id="instagram"
          placeholder="Inserisci link profilo Instagram"
          value={profileFormData.instagram}
          onChange={handleChange}
          type="text"
          className={"max-w-sm"}
        />
        <FormInput
          label="Facebook"
          id="facebook"
          placeholder="Inserisci link profilo Facebook"
          value={profileFormData.facebook}
          onChange={handleChange}
          type="text"
          className={"max-w-sm"}
        />
      </div>
      <div className="flex flex-col items-center justify-between lg:flex-row gap-4">
        <FormInput
          label="Linkedin"
          id="linkedin"
          placeholder="Inserisci link profilo Linkedin"
          value={profileFormData.linkedin}
          onChange={handleChange}
          type="text"
          className={"max-w-sm"}
        />
        <FormInput
          label="Twitter"
          id="twitter"
          placeholder="Inserisci link profilo Twitter"
          value={profileFormData.twitter}
          onChange={handleChange}
          type="text"
          className={"max-w-sm"}
        />
      </div>
      <div className="flex flex-col items-center justify-between lg:flex-row gap-4">
        <FormInput
          label="Github"
          id="github"
          placeholder="Inserisci link profilo Github"
          value={profileFormData.github}
          onChange={handleChange}
          type="text"
          className={"max-w-sm"}
        />
        <FormInput
          label="Website"
          id="website"
          placeholder="Inserisci link del tuo Website"
          value={profileFormData.website}
          onChange={handleChange}
          type="text"
          className={"max-w-sm"}
        />
      </div>
      <Button
        variant="default"
        type="submit"
        className="sm:w-1/3 mx-auto w-full"
        disabled={!canSave}
      >
        {isLoading ? "Loading..." : "Salva Modifiche"}
      </Button>
    </form>
  );
}

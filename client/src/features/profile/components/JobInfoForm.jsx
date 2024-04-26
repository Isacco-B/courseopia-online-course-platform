/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useUpdateProfileMutation } from "../api/profileApiSlice";
import { useToast } from "@/components/ui/use-toast";
import FormSelect from "@/components/FormSelect";
import { Checkbox } from "@/components/ui/checkbox";

export default function JobInfoForm({ profile }) {
  const { toast } = useToast();

  const [profileFormData, setProfileFormData] = useState({
    availability: profile?.availability || "",
    remoteWork: profile?.remoteWork || false,
    isWorking: profile?.isWorking || false,
    lookingForJob: profile?.lookingForJob || false,
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
  const availabilityOptions = [
    {
      value: "full time",
      label: "Full time",
    },
    {
      value: "part time",
      label: "Part time",
    },
  ];

  const canSave = profileChanged && !isLoading;

  return (
    <form
      className="flex flex-col gap-8 max-w-4xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isWorking"
            checked={profileFormData?.isWorking}
            onCheckedChange={(value) =>
              setProfileFormData({
                ...profileFormData,
                isWorking: value,
              })
            }
          />
          <label
            htmlFor="showSoftSkills"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Attualmente hai un lavoro?
          </label>
        </div>
        {!profileFormData.isWorking && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lookingForJob"
              checked={profileFormData?.lookingForJob}
              onCheckedChange={(value) =>
                setProfileFormData({
                  ...profileFormData,
                  lookingForJob: value,
                })
              }
            />
            <label
              htmlFor="showSoftSkills"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Stai cercando lavoro?
            </label>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between lg:flex-row gap-4 lg:items-center">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="remoteWork"
            checked={profileFormData?.remoteWork}
            onCheckedChange={(value) =>
              setProfileFormData({
                ...profileFormData,
                remoteWork: value,
              })
            }
          />
          <label
            htmlFor="showSoftSkills"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Disponibile a lavorare da remoto
          </label>
        </div>
        <FormSelect
          id="availability"
          value={profileFormData.availability}
          label="Disponibilità di tempo"
          onChange={(value) =>
            setProfileFormData({ ...profileFormData, availability: value })
          }
          className="max-w-sm"
          placeholder={"Seleziona una opzione"}
          options={availabilityOptions}
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

/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useUpdateProfileMutation } from "../api/profileApiSlice";
import { useToast } from "@/components/ui/use-toast";
import FormSelect from "@/components/FormSelect";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function EducationForm({ profile }) {
  const { toast } = useToast();
  const [date, setDate] = useState(
    ""
  );
  const [profileFormData, setProfileFormData] = useState({
    graduationDate: profile?.graduationDate || "",
    education: profile?.education || "",
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
  const educationOptions = [
    {
      value: "Licenza media",
      label: "Licenza media",
    },
    {
      value: "Diploma di scuola superiore",
      label: "Diploma di scuola superiore",
    },
    {
      value: "Laurea",
      label: "Laurea",
    },
    {
      value: "Laurea magistrale",
      label: "Laurea magistrale",
    },
    {
      value: "Master universitario",
      label: "Master universitario",
    },
    {
      value: "Dottorato di ricerca",
      label: "Dottorato di ricerca",
    },
  ];

  const canSave = profileChanged && !isLoading;

  return (
    <form
      className="flex flex-col gap-8 max-w-4xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-between lg:flex-row gap-4 items-center">
        <FormSelect
          id="availability"
          value={profileFormData.education}
          label="Titolo di Studio"
          onChange={(value) =>
            setProfileFormData({ ...profileFormData, education: value })
          }
          className="max-w-sm"
          placeholder={"Seleziona una opzione"}
          options={educationOptions}
        />
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="data">Data di Conseguimento</Label>
          <Popover id="date">
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date
                  ? format(date, "PPP")
                  : profileFormData?.graduationDate
                  ? format(profileFormData?.graduationDate, "PPP")
                  : "Seleziona una data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setProfileFormData({
                    ...profileFormData,
                    graduationDate: date,
                  });
                  setDate(date);
                }}
                captionLayout="dropdown"
                fromYear={1960}
                toYear={2030}
                initialFocus
                required
              />
            </PopoverContent>
          </Popover>
        </div>
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

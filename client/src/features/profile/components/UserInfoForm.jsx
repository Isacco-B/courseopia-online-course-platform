/* eslint-disable react/prop-types */
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useEffect, useState } from "react";
import { useUpdateUserMutation } from "@/features/users/api/usersApiSlice";
import { useUpdateProfileMutation } from "../api/profileApiSlice";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function UserInfoForm({ user, profile }) {
  const { toast } = useToast();

  const [date, setDate] = useState("");
  const [originalUserFormData, setOriginalUserFormData] = useState({});
  const [originalProfileFormData, setOriginalProfileFormData] = useState({});
  const [userFormData, setUserFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [profileFormData, setProfileFormData] = useState({
    phoneNumber: profile?.phoneNumber || "",
    dateOfBirth: profile?.dateOfBirth || "",
    gender: profile?.gender || "",
    city: profile?.city || "",
  });

  const [updateUser, { isLoading: isUserLoading }] = useUpdateUserMutation();
  const [updateProfile, { isLoading: isProfileLoading }] =
    useUpdateProfileMutation();

  useEffect(() => {
    setOriginalUserFormData(userFormData);
    setOriginalProfileFormData(profileFormData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUserFormChange(e) {
    const { name, value } = e.target;
    setUserFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleProfileFormChange(e) {
    const { name, value } = e.target;
    setProfileFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const userChanged =
    JSON.stringify(userFormData) !== JSON.stringify(originalUserFormData);
  const profileChanged =
    JSON.stringify(profileFormData) !== JSON.stringify(originalProfileFormData);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const userId = user?._id?.toString();
      const userSlug = user?.slug;
      if (userChanged) {
        await updateUser({ userId, ...userFormData }).unwrap();
        setOriginalUserFormData(userFormData);
      }
      if (profileChanged) {
        await updateProfile({ userId, userSlug, ...profileFormData }).unwrap();
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
    userFormData.firstName &&
    userFormData.lastName &&
    userFormData.email &&
    profileFormData.phoneNumber &&
    profileFormData.dateOfBirth &&
    profileFormData.gender &&
    profileFormData.city &&
    (userChanged || profileChanged);

  const genderOptions = [
    { value: "female", label: "Femmina" },
    { value: "male", label: "Maschio" },
    { value: "other", label: "Altro" },
  ];

  return (
    <form
      className="flex flex-col gap-6 max-w-4xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center justify-between lg:flex-row gap-4">
        <FormInput
          label="Nome*"
          id="firstName"
          placeholder="Nome"
          value={userFormData.firstName}
          onChange={handleUserFormChange}
          type="text"
          className={"max-w-sm"}
          required={true}
        />
        <FormInput
          label="Cognome*"
          id="lastName"
          placeholder="Cognome"
          value={userFormData.lastName}
          onChange={handleUserFormChange}
          type="text"
          className={"max-w-sm"}
          required={true}
        />
      </div>
      <div className="flex flex-col items-center justify-between lg:flex-row gap-4">
        <FormInput
          label="Email*"
          id="email"
          placeholder="Email"
          value={userFormData.email}
          onChange={handleUserFormChange}
          type="email"
          className={"max-w-sm"}
          required={true}
        />
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="telefono">Telefono*</Label>
          <PhoneInput
            id="telefono"
            value={profileFormData.phoneNumber}
            placeholder="Numero di Telefono"
            className="flex h-10 rounded-md border border-input bg-background pl-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(value) =>
              setProfileFormData({ ...profileFormData, phoneNumber: value })
            }
            required
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-between lg:flex-row gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="data">Data di Nascita*</Label>
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
                  : profileFormData?.dateOfBirth
                  ? format(profileFormData?.dateOfBirth, "PPP")
                  : "Seleziona una data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setProfileFormData({ ...profileFormData, dateOfBirth: date });
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <FormSelect
            id="gender"
            value={profileFormData.gender}
            label="Sesso*"
            onChange={(value) =>
              setProfileFormData({ ...profileFormData, gender: value })
            }
            required={true}
            className="max-w-sm"
            placeholder={"Seleziona una opzione"}
            options={genderOptions}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-between lg:flex-row gap-4">
        <FormInput
          label="Citta*"
          id="city"
          placeholder="Citta"
          value={profileFormData.city}
          onChange={handleProfileFormChange}
          type="text"
          className={"max-w-sm"}
          required={true}
        />
        <div className="grid w-full max-w-sm items-center gap-1.5"></div>
      </div>
      <Button
        variant="default"
        type="submit"
        className="sm:w-1/3 w-full mx-auto"
        disabled={!canSave || isUserLoading || isProfileLoading}
      >
        {isUserLoading || isProfileLoading ? "Loading..." : "Salva Modifiche"}
      </Button>
    </form>
  );
}

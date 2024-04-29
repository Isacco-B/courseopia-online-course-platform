import {
  BadgeInfo,
  FileText,
  Briefcase,
  Book,
  MessageCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetUserQuery } from "@/features/users/api/usersApiSlice";
import { useGetProfileQuery } from "../api/profileApiSlice";
import DescriptionForm from "./DescriptionForm";
import UserInfoForm from "./UserInfoForm";
import JobInfoForm from "./JobInfoForm";
import EducationForm from "./EducationForm";
import SocialInfoForm from "./SocialInfoForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import CustomTabs from "@/components/CustomTabs";
import PhotoUploaderForm from "@/components/PhotoUploaderForm";
import { Separator } from "@/components/ui/separator";
import { useTitle } from "@/hooks/useTitle";

export default function ProfilleUpdate() {
  const { slug } = useParams();
  const { data: user, isLoading, isError } = useGetUserQuery(slug);
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetProfileQuery(user?._id);

  useTitle(`Modifica Profilo | ${user?.firstName} ${user?.lastName}`);

  const tabs = [
    {
      value: "account",
      label: "Info Personali",
      icon: <BadgeInfo size={28} />,
      component: (
        <>
          <PhotoUploaderForm profile={profile} />
          <Separator className="my-8" />
          <UserInfoForm user={user} profile={profile} />
        </>
      ),
    },
    {
      value: "password",
      label: "Descrizione",
      icon: <FileText size={28} />,
      component: <DescriptionForm profile={profile} />,
    },
    {
      value: "email",
      label: "Info Lavorative",
      icon: <Briefcase size={28} />,
      component: <JobInfoForm profile={profile} />,
    },
    {
      value: "banana",
      label: "Formazione",
      icon: <Book size={28} />,
      component: <EducationForm profile={profile} />,
    },
    {
      value: "social",
      label: "Sito e Social",
      icon: <MessageCircle size={28} />,
      component: <SocialInfoForm profile={profile} />,
    },
  ];

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || isProfileError) {
    return <div>Impossibile caricare il profilo.</div>;
  }

  return (
    <>
      <CustomTabs tabs={tabs} />
    </>
  );
}

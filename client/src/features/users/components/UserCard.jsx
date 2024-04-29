/* eslint-disable react/prop-types */
import AvatarDisplay from "@/components/AvatarDisplay";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useStaticFile } from "@/hooks/useStaticFile";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { DropdownComponent } from "@/components/DropDownComponent";
import {
  Book,
  Shield,
  UserRoundCog,
  User,
  Lock,
  LucideUnlock,
  KeyRound,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useChangeRoleMutation,
  useChangeStatusMutation,
} from "../api/usersApiSlice";
import { useToast } from "@/components/ui/use-toast";

export default function UserCard({
  user,
  index,
  showAdvancedSettings = false,
}) {
  const [changeRole] = useChangeRoleMutation();
  const [changeStatus] = useChangeStatusMutation();
  const imageUrl = useStaticFile(user?.profile?.profilePicture);
  const navigate = useNavigate();
  const { isAdmin, id } = useAuth();
  const { toast } = useToast();

  const handleChangeRole = async (role) => {
    try {
      await changeRole({ userId: id, role, user: user._id }).unwrap();
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

  const handleChangeStatus = async (active) => {
    try {
      await changeStatus({ userId: id, active, user: user._id }).unwrap();
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

  const options = [
    {
      type: "label",
      label: "Impostazioni utente",
    },
    {
      type: "separator",
    },
    {
      type: "group",
      items: [
        {
          label: "Profile",
          onClick: () => navigate(`/dash/profilo/${user.slug}`),
          icon: User,
        },
      ],
    },
    {
      type: "subMenu",
      label: "Stato",
      icon: KeyRound,
      items: [
        {
          label: "Attivo",
          onClick: () => handleChangeStatus(true),
          icon: LucideUnlock,
          disabled: user.active === true,
        },
        {
          label: "Disattivo",
          onClick: () => handleChangeStatus(false),
          icon: Lock,
          disabled: user.active === false,
        },
      ],
    },
    {
      type: "subMenu",
      label: "Ruolo",
      icon: UserRoundCog,
      items: [
        {
          label: "Admin",
          onClick: () => handleChangeRole("admin"),
          icon: Shield,
          disabled: user.role === "admin",
        },
        {
          label: "Teacher",
          onClick: () => handleChangeRole("teacher"),
          icon: GraduationCap,
          disabled: user.role === "teacher",
        },
        {
          label: "Student",
          onClick: () => handleChangeRole("student"),
          icon: Book,
          disabled: user.role === "student",
        },
      ],
    },
  ];

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 mb-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
        <div className="flex flex-row items-center justify-between flex-1 lg:justify-start gap-4">
          <div className="flex flex-row items-center gap-6">
            <AvatarDisplay
              src={imageUrl}
              alt="avatar"
              fallbackText={user?.firstName?.slice(0, 2) || "CO"}
              className="w-20 h-20 md:w-24 md:h-24"
            />
            <p
              className="text-lg hover:underline hover:cursor-pointer font-semibold"
              onClick={() => navigate(`/dash/profilo/${user?.slug}`)}
            >
              {user?.firstName + " " + user?.lastName}
            </p>
          </div>
          {index && <p className="lg:order-first">{index}.</p>}
        </div>
        <Separator className="md:hidden" />
        <div className="flex flex-row items-center justify-between flex-1">
          <p className="border border-blue-800 rounded-sm px-1 text-blue-800 dark:text-blue-500 font-semibold text-sm">
            {user?.currentMaster?.title || "Nessun Master Selezionato"}
          </p>
          <p>{user?.totalPoints} pt</p>
        </div>
      </div>
      {isAdmin && showAdvancedSettings && (
        <div className="flex flex-row items-center justify-between mt-4">
          <div className="inline-flex gap-2">
            <div className="inline-flex gap-1 items-center">
              <p className="text-sm font-semibold">Ruolo:</p>
              <Badge>{user?.role}</Badge>
            </div>
            <div className="inline-flex gap-1 items-center">
              <p className="text-sm font-semibold">Stato:</p>
              {user?.active ? (
                <Badge variant={"default"}>Attivo</Badge>
              ) : (
                <Badge variant="destructive">Disabilitato</Badge>
              )}
            </div>
          </div>
          <div>
            <DropdownComponent options={options}>
              <Settings size={20} className="cursor-pointer" />
            </DropdownComponent>
          </div>
        </div>
      )}
    </div>
  );
}

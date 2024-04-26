import CustomTabs from "@/components/CustomTabs";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
import SignOut from "@/features/auth/components/SignOut";
import { useAuth } from "@/hooks/useAuth";
import { useTitle } from "@/hooks/useTitle";
import { KeyRound, Power } from "lucide-react";

export default function AccountDetail() {
  const { slug } = useAuth();
  useTitle(`Account ${slug} | Courseopia `);

  const tabs = [
    {
      value: "password",
      label: "Modifica Password",
      icon: <KeyRound size={28} />,
      component: (
        <div className="lg:w-1/2 mx-auto">
          <ResetPasswordForm type="change-password" />
        </div>
      ),
    },
    {
      value: "logout",
      label: "Logout",
      icon: <Power size={28} />,
      component: (
        <div className="flex flex-row items-center gap-2">
          <p className="">Sei sicuro di voler uscire</p>
          <SignOut />
        </div>
      ),
    },
  ];

  return (
    <>
      <CustomTabs tabs={tabs} />
    </>
  );
}

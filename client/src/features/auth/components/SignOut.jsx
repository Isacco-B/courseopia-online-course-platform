import { Button } from "@/components/ui/button";
import { useSendLogoutMutation } from "../api/authApiSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function SignOut() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sendLogout, { isLoading }] = useSendLogoutMutation();

  const handleSignOut = async () => {
    try {
      await sendLogout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again.",
      });
    }
  };

  return (
    <Button onClick={handleSignOut} disabled={isLoading} className="h-8 rounded-sm">
      Logout
    </Button>
  );
}

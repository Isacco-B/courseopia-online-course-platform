import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../api/authApiSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Courseopia from "../../../assets/img/courseopia.png";
import Wave from "../../../assets/img/wave.svg";
import ModeToggle from "@/components/ThemeToggle";
import { useToast } from "@/components/ui/use-toast";
import { ThreeDots } from "react-loader-spinner";
import { useTitle } from "@/hooks/useTitle";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function SignIn() {
  useTitle("Register | Courseopia");
  const [register, { isLoading, isSuccess, isError, error }] =
    useRegisterMutation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [validPwd, setValidPwd] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(formData.password));
    if (formData.password !== formData.confirmPassword) {
      setErrMsg("Passwords do not match!");
    } else {
      setErrMsg("");
    }
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
    if (isError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error?.data?.message ||
          "There was a problem with your request. Please try again.",
      });
    }
  }, [isSuccess, navigate, isError, error, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const canSave = [!errMsg, validPwd].every(Boolean) && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      await register(formData);
    }
  };
  return (
    <>
      <div className="container p-4 text-right">
        <ModeToggle />
      </div>
      <div
        style={{ "--image-url": `url(${Wave})` }}
        className="px-4 py-14 md:py-8 min-h-screen bg-[image:var(--image-url)] bg-no-repeat bg-bottom"
      >
        <form
          className="flex flex-col mx-auto w-full md:max-w-[500px] gap-4"
          onSubmit={handleSubmit}
        >
          <img
            src={Courseopia}
            alt="logo"
            className="md:w-80 w-60 mb-3 mx-auto"
          />
          <h1 className="text-xl font-bold leading-8 md:text-center">
            Registrati a Courseopia
          </h1>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="nome">Nome*</Label>
            <Input
              name="firstName"
              type="text"
              id="nome"
              placeholder="Inserisci Nome"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="cognome">Cognome*</Label>
            <Input
              name="lastName"
              type="text"
              id="cognome"
              placeholder="Inserisci Cognome"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email*</Label>
            <Input
              name="email"
              type="email"
              id="email"
              placeholder="Inserisci Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5 relative">
            <Label htmlFor="password">Password*</Label>
            <div className="flex items-center gap-1.5">
              <Input
                name="password"
                type={showPwd ? "text" : "password"}
                id="password"
                placeholder="Inserisci Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="absolute right-3 cursor-pointer">
                <Eye
                  size={22}
                  onClick={() => setShowPwd(!showPwd)}
                  className={`${showPwd && "text-primary"} hover:scale-[1.2]`}
                />
              </span>
            </div>
            {!validPwd && formData.password.length > 0 && (
              <p className="text-destructive py-1 text-sm">
                Your password must be between 8 and 24 characters long, and
                contain at least one lowercase letter, one uppercase letter, one
                number, and one special character (!@#$%).
              </p>
            )}
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="confirm-password">Confirm Password*</Label>
            <Input
              name="confirmPassword"
              type={showPwd ? "text" : "password"}
              id="confirm-password"
              placeholder="Conferma Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errMsg && formData.confirmPassword.length > 0 && (
              <p className="text-destructive py-1 text-sm">{errMsg}</p>
            )}
          </div>
          <Button
            className="uppercase font-semibold w-1/3 mx-auto"
            type="submit"
            disabled={!canSave}
          >
            Continua
          </Button>
          <div className="mx-auto">
            <ThreeDots
              visible={isLoading}
              height="40"
              width="40"
              color="#22c55e"
              ariaLabel="three-dots-loading"
            />
          </div>
        </form>
      </div>
    </>
  );
}

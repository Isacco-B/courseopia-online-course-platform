/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../api/authApiSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import FormInput from "@/components/FormInput";
import { Eye } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";
import { useTitle } from "@/hooks/useTitle";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function SignIn({ signInText}) {
  useTitle("Register | Courseopia");
  const [register, { isLoading, isSuccess, isError, error }] =
    useRegisterMutation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errMsg, setErrMsg] = useState("");
  const [validPwd, setValidPwd] = useState(false);
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
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FormInput
        label="Nome*"
        id="firstName"
        placeholder="Inserisci Nome"
        value={formData.firstName}
        onChange={handleChange}
        type="text"
        autoComplete={false}
        required={true}
      />
      <FormInput
        label="Cognome*"
        id="lastName"
        placeholder="Inserisci Cognome"
        value={formData.lastName}
        onChange={handleChange}
        type="text"
        autoComplete={false}
        required={true}
      />
      <FormInput
        label="Email*"
        id="email"
        placeholder="Inserisci Email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        autoComplete={false}
        required={true}
      />
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
            Your password must be between 8 and 24 characters long, and contain
            at least one lowercase letter, one uppercase letter, one number, and
            one special character (!@#$%).
          </p>
        )}
      </div>
      <FormInput
        label="Conferma Password*"
        id="confirmPassword"
        placeholder="Conferma Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        type="password"
        autoComplete={false}
        required={true}
      >
        {errMsg && formData.confirmPassword.length > 0 && (
          <p className="text-destructive py-1 text-sm">{errMsg}</p>
        )}
      </FormInput>
      <Button
        className="uppercase font-semibold w-1/3 mx-auto"
        type="submit"
        disabled={!canSave}
      >
        Continua
      </Button>
      {signInText && (
        <Link
          to="/login"
          className="text-primary opacity-80 hover:opacity-100 text-center"
        >
          {signInText}
        </Link>
      )}

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
  );
}

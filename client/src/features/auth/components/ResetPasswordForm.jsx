/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import {
  useChangePasswordMutation,
  useConfirmPasswordResetMutation,
  useResetPasswordMutation,
} from "../api/authApiSlice";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import FormInput from "@/components/FormInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThreeDots } from "react-loader-spinner";
import { useAuth } from "@/hooks/useAuth";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function ResetPasswordForm({ type, signInText }) {

  const {id} = useAuth()
  const { token } = useParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [confirmPasswordReset, { isLoading: isLoadingConfirm }] =
    useConfirmPasswordResetMutation();
  const [changePassword, { isLoading: isLoadingChange }] =
    useChangePasswordMutation();
  const [errMsg, setErrMsg] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    token: token ? token : "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(formData.password));
    if (formData.password !== formData.confirmPassword) {
      setErrMsg("Passwords do not match!");
    } else {
      setErrMsg("");
    }
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get("error");

    if (error === "invalid_token") {
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Invalid token. Please try again.",
        });
      }, 1000);
    } else if (error === "generic_error") {
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request. Please try again.",
        });
      }, 1000);
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "reset-password") {
        await confirmPasswordReset(formData).unwrap();
        setFormData({ email: "", password: "", confirmPassword: "" });
        toast({
          title: "Success!",
          description: "You have successfully reset your password.",
        });
        navigate("/login");
      } else if (type === "change-password") {
        await changePassword({ userId: id, data: formData }).unwrap();
        setFormData({ password: "", confirmPassword: "" });
        toast({
          title: "Success!",
          description: "You have successfully changed your password.",
        });
      } else {
        await resetPassword(formData).unwrap();
        setFormData({ email: "", password: "", confirmPassword: "" });
        toast({
          title: "Success!",
          description: "Check your email for further instructions.",
        });
      }
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

  const canSave =
    type === "reset-password" || type === "change-password"
      ? formData.password && formData.confirmPassword
      : formData.email;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {type === "reset-password" || type === "change-password" ? (
        <>
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
        </>
      ) : (
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
      )}

      <Button
        className="uppercase font-semibold w-1/3 mx-auto"
        type="submit"
        disabled={!canSave || isLoading || isLoadingConfirm || isLoadingChange}
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
          visible={isLoading || isLoadingConfirm || isLoadingChange}
          height="40"
          width="40"
          color="#22c55e"
          ariaLabel="three-dots-loading"
        />
      </div>
    </form>
  );
}

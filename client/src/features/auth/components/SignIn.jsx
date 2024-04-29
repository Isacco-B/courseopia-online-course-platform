/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../api/authApiSlice";
import { setCredentials } from "../authSlice";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import FormInput from "@/components/FormInput";
import { Eye } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";
import { useTitle } from "@/hooks/useTitle";

export default function SignIn({forgotPasswordText, signUpText}) {
  useTitle("Login | Courseopia");

  const [login, { isLoading }] = useLoginMutation();
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

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
      const { accessToken } = await login(formData).unwrap();
      dispatch(setCredentials({ accessToken }));
      setFormData({ email: "", password: "" });
      navigate("/dash");
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

  const canSave = formData.email && formData.password;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
      </div>
      {forgotPasswordText && (
        <Link
          to="/password-dimenticata"
          className="text-primary opacity-80 hover:opacity-100"
        >
          {forgotPasswordText}
        </Link>
      )}

      <Button
        className="uppercase font-semibold w-1/3 mx-auto"
        type="submit"
        disabled={!canSave || isLoading}
      >
        Continua
      </Button>
      {signUpText && (
        <Link
          to="/register"
          className="text-primary opacity-80 hover:opacity-100 text-center"
        >
          Non hai un account? REGISTRATI ORA
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

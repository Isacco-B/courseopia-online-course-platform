import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../api/authApiSlice";
import { setCredentials } from "../authSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import Courseopia from "../../../assets/img/courseopia.png";
import Wave from "../../../assets/img/wave.svg";
import ModeToggle from "@/components/ThemeToggle";
import { useTitle } from "@/hooks/useTitle";


export default function SignIn() {
  useTitle("Login | Courseopia");
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
    <>
      <div className="container p-4 text-right">
        <ModeToggle />
      </div>
      <div
        style={{ "--image-url": `url(${Wave})` }}
        className="px-4 py-14 md:py-24 min-h-screen bg-[image:var(--image-url)] bg-no-repeat bg-bottom"
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
          </div>
          <Link
            to="/dash"
            className="text-primary opacity-80 hover:opacity-100"
          >
            Hai dimenticato la password?
          </Link>
          <Button
            className="uppercase font-semibold w-1/3 mx-auto"
            type="submit"
            disabled={!canSave || isLoading}
          >
            Continua
          </Button>

          <Link
            to="/register"
            className="text-primary opacity-80 hover:opacity-100 text-center"
          >
            Non hai un account? REGISTRATI ORA
          </Link>
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

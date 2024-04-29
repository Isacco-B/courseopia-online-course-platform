/* eslint-disable react/prop-types */
import ModeToggle from "@/components/ThemeToggle";
import Courseopia from "../../../assets/img/courseopia.png";
import Wave from "../../../assets/img/wave.svg";
import { Toaster } from "@/components/ui/toaster";


export default function AuthLayout({ children, title }) {
  return (
    <>
      <div className="container p-4 text-right">
        <ModeToggle />
      </div>
      <main
        style={{ "--image-url": `url(${Wave})` }}
        className="px-4 py-14 md:py-24 min-h-screen bg-[image:var(--image-url)] bg-no-repeat bg-bottom"
      >
        <div className="mx-auto w-full md:max-w-[500px]">
          <img
            src={Courseopia}
            alt="logo"
            className="md:w-80 w-60 mb-3 mx-auto"
          />
          <h1 className="text-xl font-bold leading-8 md:text-center">
            {title}
          </h1>
          {children}
        </div>
      </main>
      <Toaster />
    </>
  );
}


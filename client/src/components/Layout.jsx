import { Outlet } from "react-router-dom";
import { Toaster } from "./ui/toaster";


export default function Layouts() {
  return (
    <>
      <main className="min h-screen">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}

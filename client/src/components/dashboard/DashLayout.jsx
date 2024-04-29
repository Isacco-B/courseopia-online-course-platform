import { Outlet } from "react-router-dom";
import { Toaster } from "../ui/toaster";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";
import DashSidebar from "./DashSidebar";
import MobileDashSidebar from "./MobileDashSidebar";
import { useState } from "react";
import { useGetUserQuery } from "@/features/users/api/usersApiSlice";
import { useAuth } from "@/hooks/useAuth";

export default function DashLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { slug } = useAuth();
  const { data: user } = useGetUserQuery(slug);

  return (
    <>
      <div className="flex min-h-screen border-collapse overflow-hidden bg-gray-50 dark:bg-background">
        <MobileDashSidebar
          setMobileMenuOpen={setMobileMenuOpen}
          mobileMenuOpen={mobileMenuOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          user={user}
        />
        <DashSidebar
          user={user}
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-4 md:container mx-auto xl:px-32">
            <DashHeader
              setMobileMenuOpen={setMobileMenuOpen}
              mobileMenuOpen={mobileMenuOpen}
              user={user}
            />
            <main className="min-h-screen">
              <Outlet />
            </main>
            <DashFooter />
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
}

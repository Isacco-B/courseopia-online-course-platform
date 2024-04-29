/* eslint-disable react/prop-types */
import { Sheet, SheetContent } from "@/components/ui/sheet";
import DashSidebar from "./DashSidebar";
import { cn } from "@/lib/utils";

export default function MobileDashSidebar({
  setMobileMenuOpen,
  mobileMenuOpen,
  setIsSidebarOpen,
  isSidebarOpen,
  user,
}) {
  return (
    <Sheet
      open={mobileMenuOpen}
      onOpenChange={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      <SheetContent
        side="left"
        className={cn("bg-card",isSidebarOpen ? "w-64" : "w-28")}
      >
        <DashSidebar
          isMobile={true}
          user={user}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </SheetContent>
    </Sheet>
  );
}

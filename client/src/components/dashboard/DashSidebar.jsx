/* eslint-disable react/prop-types */
import { menuItems, adminMenuItems, teacherMenuItems } from "@/constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Award, ChevronRight, ChevronDown } from "lucide-react";
import CourseopiaSmall from "../../assets/img/courseopia-small.png";
import CourseopiaSmallBlack from "../../assets/img/courseopia-small-black.png";
import CourseopiaIcon from "../../assets/img/courseopia-icon.png";
import { useTheme } from "@/context/ThemeProvider";
import { Badge } from "../ui/badge";
import AvatarDisplay from "../AvatarDisplay";
import { useStaticFile } from "@/hooks/useStaticFile";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function DashSidebar({
  user,
  isMobile = false,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const navigate = useNavigate();
  const imageUrl = useStaticFile(user?.profile?.profilePicture);
  const { isTeacher, isAdmin, slug } = useAuth();
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const [submenuOpen, setSubmenuOpen] = useState(false);

  return (
    <aside
      className={cn(
        "w-full bg-card relative",
        !isMobile && "hidden md:block shadow-sm border",
        isSidebarOpen ? "w-64" : "w-28"
      )}
    >
      {isSidebarOpen ? (
        <ChevronRight
          className={cn(
            "absolute right-2 top-2 cursor-pointer rotate-180",
            isMobile && "right-2 top-[-40px]"
          )}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      ) : (
        <ChevronRight
          className={cn(
            "absolute right-2 top-2 cursor-pointer",
            isMobile && "right-2 top-[-40px]"
          )}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      )}
      <div className="flex flex-col justify-center items-center gap-8 mt-20">
        <div className="cursor-pointer" onClick={() => navigate("/dash")}>
          {isSidebarOpen ? (
            <img
              src={theme === "dark" ? CourseopiaSmall : CourseopiaSmallBlack}
              alt="logo"
              className="w-48"
            />
          ) : (
            <img src={CourseopiaIcon} alt="logo" className="w-16" />
          )}
        </div>
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/dash/profilo/${slug}`)}
        >
          <AvatarDisplay
            src={imageUrl}
            alt="avatar"
            fallbackText={user?.firstName?.slice(0, 2) || "CO"}
            className={isSidebarOpen ? "w-24 h-24" : "w-16 h-16"}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          {isSidebarOpen && (
            <p className="text-md font-medium truncate w-40 text-center">
              {user?.firstName + " " + user?.lastName}
            </p>
          )}

          <div className="flex flex-row items-center gap-2">
            {isSidebarOpen && <Award size={20} className="text-primary" />}
            <p className="text-sm font-medium">{user?.totalPoints} Ppt</p>
          </div>

          <Badge className="mt-2">{user?.role}</Badge>
        </div>
      </div>
      <menu className="mt-12 w-full flex flex-col items-start gap-4 p-1 py-4 overflow-y-auto h-64 sm:h-full">
        {menuItems.map((menu, index) => (
          <ul key={index} className="w-full">
            <Link
              className={cn(
                "flex flex-row items-center gap-4 border-l-4 group p-2 rounded-md hover:bg-secondary",
                pathname === menu.path
                  ? "border-primary bg-secondary"
                  : "border-transparent",
                isSidebarOpen ? "pl-6" : "justify-center"
              )}
              to={menu.path}
            >
              <span
                className={cn(
                  "group-hover:text-primary",
                  pathname === menu.path && "text-primary"
                )}
              >
                {menu.icon}
              </span>
              <span className={cn("capitalize", !isSidebarOpen && "hidden")}>
                {menu.title}
              </span>
              {menu.submenu && isSidebarOpen && (
                <ChevronDown
                  onClick={() => setSubmenuOpen(!submenuOpen)}
                  className={`${submenuOpen ? "rotate-180" : "rotate-0"}`}
                />
              )}
            </Link>
            {menu.submenu && submenuOpen && isSidebarOpen && (
              <menu className="w-[90%] flex flex-col items-start gap-2 p-1 mt-2 mx-auto">
                {menu.submenuItems.map((submenu, index) => (
                  <li key={index} className="w-full">
                    <Link
                      to={submenu.path}
                      className={cn(
                        "flex flex-row items-center gap-4 border-l-4 group p-2 rounded-md hover:bg-secondary",
                        pathname === submenu.path
                          ? "border-primary bg-secondary"
                          : "border-transparent",
                        isSidebarOpen ? "pl-6" : "justify-center"
                      )}
                    >
                      <span
                        className={cn(
                          "group-hover:text-primary",
                          pathname === submenu.path && "text-primary"
                        )}
                      >
                        {submenu.icon}
                      </span>
                      <span
                        className={cn("capitalize", !isSidebarOpen && "hidden")}
                      >
                        {submenu.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </menu>
            )}
          </ul>
        ))}

        {isAdmin &&
          adminMenuItems.map((menu, index) => (
            <ul key={index} className="w-full">
              <Link
                className={cn(
                  "flex flex-row items-center gap-4 border-l-4 group p-2 rounded-md w-full hover:bg-secondary",
                  pathname === menu.path
                    ? "border-primary bg-secondary"
                    : "border-transparent",
                  isSidebarOpen ? "pl-6" : "justify-center"
                )}
                to={menu.path}
              >
                <span
                  className={cn(
                    "group-hover:text-primary",
                    pathname === menu.path && "text-primary"
                  )}
                >
                  {menu.icon}
                </span>
                <span className={cn("capitalize", !isSidebarOpen && "hidden")}>
                  {menu.title}
                </span>
                {menu.submenu && isSidebarOpen && (
                  <ChevronDown
                    onClick={() => setSubmenuOpen(!submenuOpen)}
                    className={`${submenuOpen ? "rotate-180" : "rotate-0"}`}
                  />
                )}
              </Link>
              {menu.submenu && submenuOpen && isSidebarOpen && (
                <menu className="w-[90%] flex flex-col items-start gap-2 p-1 mt-2 mx-auto">
                  {menu.submenuItems.map((submenu, index) => (
                    <li key={index} className="w-full">
                      <Link
                        to={submenu.path}
                        className={cn(
                          "flex flex-row items-center gap-4 border-l-4 group p-2 rounded-md hover:bg-secondary",
                          pathname === submenu.path
                            ? "border-primary bg-secondary"
                            : "border-transparent",
                          isSidebarOpen ? "pl-6" : "justify-center"
                        )}
                      >
                        <span
                          className={cn(
                            "group-hover:text-primary",
                            pathname === submenu.path && "text-primary"
                          )}
                        >
                          {submenu.icon}
                        </span>
                        <span
                          className={cn(
                            "capitalize",
                            !isSidebarOpen && "hidden"
                          )}
                        >
                          {submenu.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </menu>
              )}
            </ul>
          ))}
        {isTeacher &&
          teacherMenuItems.map((menu, index) => (
            <ul key={index} className="w-full">
              <Link
                className={cn(
                  "flex flex-row items-center gap-4 border-l-4 group p-2 rounded-md w-full hover:bg-secondary",
                  pathname === menu.path
                    ? "border-primary bg-secondary"
                    : "border-transparent",
                  isSidebarOpen ? "pl-6" : "justify-center"
                )}
                to={menu.path}
              >
                <span
                  className={cn(
                    "group-hover:text-primary",
                    pathname === menu.path && "text-primary"
                  )}
                >
                  {menu.icon}
                </span>
                <span className={cn("capitalize", !isSidebarOpen && "hidden")}>
                  {menu.title}
                </span>
                {menu.submenu && isSidebarOpen && (
                  <ChevronDown
                    onClick={() => setSubmenuOpen(!submenuOpen)}
                    className={`${submenuOpen ? "rotate-180" : "rotate-0"}`}
                  />
                )}
              </Link>
              {menu.submenu && submenuOpen && isSidebarOpen && (
                <menu className="w-[90%] flex flex-col items-start gap-2 p-1 mt-2 mx-auto">
                  {menu.submenuItems.map((submenu, index) => (
                    <li key={index} className="w-full">
                      <Link
                        to={submenu.path}
                        className={cn(
                          "flex flex-row items-center gap-4 border-l-4 group p-2 rounded-md hover:bg-secondary",
                          pathname === submenu.path
                            ? "border-primary bg-secondary"
                            : "border-transparent",
                          isSidebarOpen ? "pl-6" : "justify-center"
                        )}
                      >
                        <span
                          className={cn(
                            "group-hover:text-primary",
                            pathname === submenu.path && "text-primary"
                          )}
                        >
                          {submenu.icon}
                        </span>
                        <span
                          className={cn(
                            "capitalize",
                            !isSidebarOpen && "hidden"
                          )}
                        >
                          {submenu.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </menu>
              )}
            </ul>
          ))}
      </menu>
    </aside>
  );
}

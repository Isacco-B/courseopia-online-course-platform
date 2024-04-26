import {
  Home,
  GraduationCap,
  Book,
  Trophy,
  UserRound,
  Globe,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  NotebookText,
  UsersRound,
  Folder,
  Shield,
} from "lucide-react";

export const toolbarOptions = [
  ["bold", "italic", "underline"],
  ["blockquote"],
  ["link", "image", "video"],

  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ indent: "-1" }, { indent: "+1" }],

  [{ header: [1, 2, 3, false] }],

  [{ color: [] }],
];

export const menuItems = [
  {
    title: "Home",
    icon: <Home size={22} />,
    path: "/dash",
  },

  {
    title: "Master",
    icon: <GraduationCap size={22} />,
    path: "/dash/master",
  },

  {
    title: "Corsi",
    icon: <Book size={22} />,
    path: "/dash/corsi",
  },

  {
    title: "Classifica",
    icon: <Trophy size={22} />,
    path: "/dash/classifica",
  },

  {
    title: "Account",
    icon: <UserRound size={22} />,
    path: "/dash/account",
  },
];

export const adminMenuItems = [
  {
    title: "Admin",
    icon: <Shield size={22} />,
    submenu: true,
    submenuItems: [
      {
        title: "Lezioni",
        icon: <NotebookText size={22} />,
        path: "/dash/lezioni",
      },
      {
        title: "Progetti",
        icon: <Folder size={22} />,
        path: "/dash/progetti",
      },
      {
        title: "Utenti",
        icon: <UsersRound size={22} />,
        path: "/dash/utenti",
      },
    ],
  },
];

export const teacherMenuItems = [
  {
    title: "Insegnante",
    icon: <Book size={22} />,
    submenu: true,
    submenuItems: [
      {
        title: "Progetti",
        icon: <Folder size={22} />,
        path: "/dash/progetti",
      },
    ],
  },
];

export const socialLinks = [
  {
    id: 1,
    name: "linkedin",
    href: "https://www.linkedin.com/in/isacco-bertoli-10aa16252/",
    icon: <Linkedin size={14} />,
    style: "bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800",
  },
  {
    id: 2,
    name: "github",
    href: "https://github.com/Isacco-B",
    icon: <Github size={14} />,
    style: "bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800",
  },
  {
    id: 3,
    name: "website",
    href: "https://www.isaccobertoli.com/",
    icon: <Globe size={14} />,
    style: "bg-green-700 text-white p-2 rounded-full hover:bg-green-800",
  },
  {
    id: 4,
    name: "instagram",
    icon: <Instagram size={14} />,
    style: "bg-pink-700 text-white p-2 rounded-full hover:bg-pink-800",
  },
  {
    id: 5,
    name: "facebook",
    icon: <Facebook size={14} />,
    style: "bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800",
  },
  {
    id: 6,
    name: "twitter",
    icon: <Twitter size={14} />,
    style: "bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800",
  },
];

export const ROLES = {
  Admin: "admin",
  Teacher: "teacher",
  Student: "student",
};

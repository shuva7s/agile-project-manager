import { Grid2x2Check, Home, ListPlus, ListTodo, Settings } from "lucide-react";

const navLinks = [
  {
    name: "Your projects",
    href: "/",
    icon: Grid2x2Check ,
  },
  {
    name: "Your tasks",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Join project",
    href: "/join-project",
    icon: ListPlus,
  },
];

export { navLinks };

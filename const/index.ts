import {
  Blocks,
  Grid2x2Check,
  Home,
  ListPlus,
  ListTodo,
  Settings,
} from "lucide-react";

const navLinks = [
  {
    name: "Your projects",
    href: "/",
    icon: Grid2x2Check,
  },
  {
    name: "Joined projects",
    href: "/joined-projects",
    icon: Blocks,
  },
  {
    name: "Your tasks",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    name: "Join project",
    href: "/join-project",
    icon: ListPlus,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export { navLinks };

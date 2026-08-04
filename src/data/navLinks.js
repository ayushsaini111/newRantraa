import {
  House,
  Sparkles,
  Package,
  Users,
  CircleHelp,
  User,
} from "lucide-react";

export const DESKTOP_NAV = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Poojas",
    href: "/poojas",
  },
  {
    title: "consutation",
    href: "/consult",
  },
  {
    title: "Community",
    href: "/community",
  },
  {
    title: "Help",
    href: "/help",
  },
];

export const MOBILE_NAV = [
  {
    title: "Home",
    href: "/",
    icon: House,
  },
  {
    title: "Poojas",
    href: "/poojas",
    icon: Sparkles,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: Package,
    protected: true,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    protected: true,
  },
];
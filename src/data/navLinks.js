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
    title: "Astrology",
    href: "/astrology",
  },
  {
    title: "Products",
    href: "/allproducts",
  }
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

export const RASHI_DATA = [
  { english: "aries", name: "ARIES", hindi: "मेष" },
  { english: "taurus", name: "TAURUS", hindi: "वृषभ" },
  { english: "gemini", name: "GEMINI", hindi: "मिथुन" },
  { english: "cancer", name: "CANCER", hindi: "कर्क" },
  { english: "leo", name: "LEO", hindi: "सिंह" },
  { english: "virgo", name: "VIRGO", hindi: "कन्या" },
  { english: "libra", name: "LIBRA", hindi: "तुला" },
  { english: "scorpio", name: "SCORPIO", hindi: "वृश्चिक" },
  { english: "sagittarius", name: "SAGITTARIUS", hindi: "धनु" },
  { english: "capricorn", name: "CAPRICORN", hindi: "मकर" },
  { english: "aquarius", name: "AQUARIUS", hindi: "कुंभ" },
  { english: "pisces", name: "PISCES", hindi: "मीन" },
];
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MOBILE_NAV } from "@/data/navLinks";

export default function MobileBottomBar() {
  const pathname = usePathname();
const router = useRouter();

const { data: session } = useSession();

const isLoggedIn = !!session;

  // Hide Bottom Bar on these routes
  const hideRoutes = useMemo(
    () => ["/login", "/verify-otp", "/admin"],
    []
  );

  if (hideRoutes.includes(pathname)) return null;

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        border-gray-200
        bg-background/95
        backdrop-blur-xl
        lg:hidden
        pb-[env(safe-area-inset-bottom)]
      "
    >
      <div className="grid h-16 grid-cols-5">

        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
           <Link
  key={item.title}
  href={item.href}
  onClick={(e) => {
    if (item.protected && !isLoggedIn) {
      e.preventDefault();
      router.push("/login");
    }
  }}
              className="
                relative
                flex
                flex-col
                items-center
                justify-center
                gap-1
              "
            >
              {/* Active Indicator */}

              {active && (
                <span className="absolute top-0 h-1 w-10 rounded-full bg-primary-main" />
              )}

              <Icon
                size={22}
                className={
                  active
                    ? "text-primary-main"
                    : "text-secondary"
                }
              />

              <span
                className={`caption ${
                  active
                    ? "font-semibold text-primary-main"
                    : "text-secondary"
                }`}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
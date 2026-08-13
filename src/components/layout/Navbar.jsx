"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import {
  User,
  Package,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

import Button from "@/components/ui/Button";
import { DESKTOP_NAV ,RASHI_DATA} from "@/data/navLinks";

import useAuth from "@/hooks/useAuth";
import useAuthStore from "@/store/authStore";

const RASHIS =RASHI_DATA

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isLoggedIn } = useAuth();
  const logoutStore = useAuthStore((state) => state.logout);

  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);
const [isVisible, setIsVisible] = useState(true);

useEffect(() => {
  let lastScrollY = window.scrollY;
  let ticking = false;

  const handleScroll = () => {
    if (ticking) return;

    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    });

    ticking = true;
  };

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
  /* ---------------- Outside Click ---------------- */

  useEffect(() => {
    if (!openMenu) return;

    const handleOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [openMenu]);

  /* ---------------- Logout ---------------- */

  const handleLogout = useCallback(async () => {
    logoutStore();

    await signOut({
      redirect: false,
    });

    setOpenMenu(false);
    setMobileMenuOpen(false);

    router.replace("/");
    router.refresh();
  }, [logoutStore, router]);

  /* ---------------- Login ---------------- */

  const handleLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  /* ---------------- User Initials ---------------- */

  const userInitials = useMemo(() => {
    return (
      user?.name
        ?.split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  }, [user?.name]);

  return (
    <>
<header
  className={`
    fixed top-0 left-0 right-0 z-50
    transition-transform duration-300 ease-out
    ${
      isVisible
        ? "translate-y-0"
        : "-translate-y-full"
    }
    bg-[#F8E6DA] backdrop-blur-sm
  `}
>
        {/* ================= MAIN NAVBAR ================= */}

        <div className="mx-auto max-w-7xl">
          <div className="flex h-17 items-center justify-between px-s16 lg:px-s32">

            {/* Logo */}

            <Link
              href="/"
              className="flex items-center gap-s16 shrink-0 group"
            >
              <div className="relative w-12 h-12 rounded-full bg-primary-main p-[2px] transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                  <Image
                    src="/rr.png"
                    alt="Rantraa"
                    width={102}
                    height={72}
                    priority
                  />
                </div>
              </div>

           
            </Link>

            {/* Desktop Navigation */}

            <nav className="hidden lg:flex items-center gap-s8">
              {DESKTOP_NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative px-s16 py-s8 rounded-r16
                      body-default font-medium
                      transition-all duration-300
                      ${
                        active
                          ? "text-primary-main bg-white/50"
                          : "text-main hover:text-primary-main hover:bg-primary-main/5"
                      }
                    `}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}

            <div className="flex items-center gap-s16">

              {!isLoggedIn ? (
                <Button
                  onClick={handleLogin}
                  className="hidden lg:flex"
                >
                  Login / Sign Up
                </Button>
              ) : (
                <div
                  ref={profileRef}
                  className="hidden lg:block relative"
                >
                  <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className={`
                      flex items-center gap-s16
                      rounded-r24
                      border transition-all duration-300
                      ${
                        openMenu
                          ? "bg-primary-main border-primary-main shadow-lg text-white"
                          : "bg-background border-secondary-dark hover:border-primary-main hover:shadow-md"
                      }
                      p-1
                    `}
                  >
                    {user?.image ? (
                      <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-background">
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          width={44}
                          height={44}
                        />
                      </div>
                    ) : (
                      <div
                        className={`
                          flex h-11 w-11 items-center justify-center
                          rounded-full
                          ${
                            openMenu
                              ? "bg-white/20"
                              : "bg-primary-main"
                          }
                          text-white body-small font-semibold
                        `}
                      >
                        {userInitials}
                      </div>
                    )}
                  </button>

                  {/* Dropdown */}

                  {openMenu && (
                    <div className="absolute right-0 mt-s16 w-80 overflow-hidden rounded-r24 border border-secondary-dark bg-background shadow-xl">

                      <div className="bg-primary-main p-s24 text-white">
                        <div className="flex items-start gap-s16">

                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/20">
                            {user?.image ? (
                              <Image
                                src={user.image}
                                alt={user.name || "User"}
                                width={64}
                                height={64}
                                className="rounded-full"
                              />
                            ) : (
                              <span className="heading-h4">
                                {userInitials}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="heading-h6 truncate mb-s4">
                              {user?.name || "Guest"}
                            </h4>

                            <p className="caption opacity-90">
                              +91 {user?.phone}
                            </p>
                          </div>

                        </div>
                      </div>

                      <div className="p-s8">

                        <Link
                          href="/profile"
                          onClick={() => setOpenMenu(false)}
                          className="flex items-center gap-s16 px-s16 py-s16 rounded-r16 transition-colors hover:bg-secondary-main group"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-r12 bg-primary-main/10 group-hover:bg-primary-main/20">
                            <User
                              size={18}
                              className="text-primary-main"
                            />
                          </div>

                          <div>
                            <p className="body-small font-medium text-main">
                              Profile
                            </p>

                            <p className="caption text-secondary">
                              Manage your account
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/plans"
                          onClick={() => setOpenMenu(false)}
                          className="flex items-center gap-s16 px-s16 py-s16 rounded-r16 transition-colors hover:bg-secondary-main group"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-r12 bg-primary-main/10">
                            <Sparkles
                              size={18}
                              className="text-primary-main"
                            />
                          </div>

                          <div>
                            <p className="body-small font-medium text-main">
                              Plans
                            </p>

                            <p className="caption text-secondary">
                              View subscriptions
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/orders"
                          onClick={() => setOpenMenu(false)}
                          className="flex items-center gap-s16 px-s16 py-s16 rounded-r16 transition-colors hover:bg-secondary-main group"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-r12 bg-primary-main/10">
                            <Package
                              size={18}
                              className="text-primary-main"
                            />
                          </div>

                          <div>
                            <p className="body-small font-medium text-main">
                              Orders
                            </p>

                            <p className="caption text-secondary">
                              Track purchases
                            </p>
                          </div>
                        </Link>

                      </div>

                      <div className="border-t border-secondary-main p-s8">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-s16 px-s16 py-s16 rounded-r16 text-red-main transition-colors hover:bg-red-main/5"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-r12 bg-red-main/10">
                            <LogOut size={18} />
                          </div>

                          <p className="body-small font-medium">
                            Logout
                          </p>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}

              <button
                onClick={() =>
                  setMobileMenuOpen(!mobileMenuOpen)
                }
                className="lg:hidden flex h-11 w-11 items-center justify-center rounded-r16 bg-primary-main/10 text-primary-main hover:bg-primary-main/20 transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X size={22} />
                ) : (
                  <Menu size={22} />
                )}
              </button>

            </div>
          </div>
        </div>

        {/* ==================================================
            RASHI NAVIGATION
            ONLY NEW SECTION
        ================================================== */}

        <div className="border-t border-primary-main/10 bg-background/70 backdrop-blur-md">
          <nav
            aria-label="Rashi navigation"
            className="
              mx-auto
              max-w-7xl
              flex
              overflow-x-auto
              hide-scrollbar
              overscroll-x-contain
            "
          >
            {RASHIS.map((rashi) => (
              <Link
                key={rashi.english}
                href={`/astrology/horoscope?rashi=${rashi.english}`}
                className="
                  group
                  flex
                  min-w-[88px]
                  flex-1
                  items-center
                  justify-center
                  whitespace-nowrap
                  border-r
                  border-primary-main/15
                  px-s8
                  py-s8
                  text-center
                  caption
                  font-medium
                  text-main
                  transition-colors
                  duration-200
                  hover:bg-primary-main
                  hover:text-white
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary-main
                  focus-visible:ring-inset
                  lg:min-w-0
                  lg:py-[7px]
                "
                title={`${rashi.name} (${rashi.hindi}) Horoscope`}
              >
                {rashi.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">

          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-main/60 backdrop-blur-sm"
          />

          <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-background shadow-2xl animate-slideRight">

            <div className="flex h-full flex-col">

              <div className="bg-primary-main p-s24 text-white">

                <div className="flex items-center justify-between mb-s24">
                  <h3 className="heading-h5">
                    Menu
                  </h3>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>

                {isLoggedIn && (
                  <div className="flex items-center gap-s16">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/20">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          width={56}
                          height={56}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="heading-h5">
                          {userInitials}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="body-default font-semibold">
                        {user?.name || "Guest"}
                      </p>

                      <p className="caption opacity-90">
                        +91 {user?.phone}
                      </p>
                    </div>

                  </div>
                )}

              </div>

              <div className="flex-1 overflow-y-auto p-s16">

                <div className="space-y-s8">

                  {DESKTOP_NAV.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" &&
                        pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() =>
                          setMobileMenuOpen(false)
                        }
                        className={`
                          flex items-center gap-s16
                          px-s16 py-s16 rounded-r16
                          body-default font-medium
                          transition-colors
                          ${
                            active
                              ? "bg-primary-main text-white"
                              : "text-main hover:bg-secondary-main"
                          }
                        `}
                      >
                        {item.title}
                      </Link>
                    );
                  })}

                </div>

                {/* Rashi inside mobile menu */}

                <div className="my-s16 border-t border-secondary-main" />

                <div>
                  <p className="caption mb-s8 px-s8 text-secondary">
                    HOROSCOPES
                  </p>

                  <div className="grid grid-cols-3 gap-s8">
                    {RASHIS.map((rashi) => (
                      <Link
                        key={rashi.english}
                        href={`/astrology/horoscope?rashi=${rashi.english}`}
                        onClick={() =>
                          setMobileMenuOpen(false)
                        }
                        className="
                          flex
                          min-h-10
                          items-center
                          justify-center
                          rounded-r8
                          border
                          border-secondary-dark
                          body-small
                          font-medium
                          text-main
                          transition-colors
                          hover:border-primary-main
                          hover:bg-primary-main
                          hover:text-white
                        "
                      >
                        {rashi.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {isLoggedIn && (
                  <>
                    <div className="my-s16 border-t border-secondary-main" />

                    <div className="space-y-s8">

                      <Link
                        href="/profile"
                        onClick={() =>
                          setMobileMenuOpen(false)
                        }
                        className="flex items-center gap-s16 px-s16 py-s16 rounded-r16 hover:bg-secondary-main"
                      >
                        <User
                          size={20}
                          className="text-primary-main"
                        />
                        <span className="body-default">
                          Profile
                        </span>
                      </Link>

                      <Link
                        href="/plans"
                        onClick={() =>
                          setMobileMenuOpen(false)
                        }
                        className="flex items-center gap-s16 px-s16 py-s16 rounded-r16 hover:bg-secondary-main"
                      >
                        <Sparkles
                          size={20}
                          className="text-primary-main"
                        />
                        <span className="body-default">
                          Plans
                        </span>
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() =>
                          setMobileMenuOpen(false)
                        }
                        className="flex items-center gap-s16 px-s16 py-s16 rounded-r16 hover:bg-secondary-main"
                      >
                        <Package
                          size={20}
                          className="text-primary-main"
                        />
                        <span className="body-default">
                          Orders
                        </span>
                      </Link>

                    </div>
                  </>
                )}

              </div>

              <div className="border-t border-secondary-main p-s16">

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-s8 py-s16 rounded-r16 bg-red-main/10 text-red-main font-medium hover:bg-red-main/20"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                ) : (
                  <Button
                    onClick={handleLogin}
                    className="w-full"
                  >
                    Login / Sign Up
                  </Button>
                )}

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
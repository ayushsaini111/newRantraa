"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import {
  User,
  UserCircle,
  Package,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

import Button from "@/components/ui/Button";
import { DESKTOP_NAV } from "@/data/navLinks";

import useAuth from "@/hooks/useAuth";
import useAuthStore from "@/store/authStore";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoggedIn } = useAuth();
  const logoutStore = useAuthStore((state) => state.logout);

  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);

  // Scroll Effect
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Outside Click
  useEffect(() => {
    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    if (openMenu) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [openMenu]);

  // Logout
  const handleLogout = useCallback(async () => {
    logoutStore();
    await signOut({ redirect: false });
    setOpenMenu(false);
    setMobileMenuOpen(false);
    router.replace("/");
    router.refresh();
  }, [logoutStore, router]);

  // Login
  const handleLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  // User initials
  const userInitials = useMemo(() => {
    return user?.name?.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase() || "U";
  }, [user?.name]);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 
          transition-all duration-300
          ${
            isScrolled
              ? "bg-primary-light/30 rounded-b-[100px] backdrop-blur-xl shadow-md "
              : "bg-primary-light/40 backdrop-blur-sm"
          }
        `}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex h-20 items-center justify-between px-s16 lg:px-s32">
            
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-s16 shrink-0 group"
            >
              <div className="relative w-11 h-11 rounded-full bg-primary-main p-[2px] transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Rantraa"
                    width={32}
                    height={32}
                    priority
                  />
                </div>
              </div>

              <span className="heading-h5 text-primary-main">
                Rantraa
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-s8">
              {DESKTOP_NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

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
                <div ref={profileRef} className="hidden lg:block relative">
                  {/* Profile Button */}
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
                          alt={user.name}
                          width={44}
                          height={44}
                        />
                      </div>
                    ) : (
                      <div className={`
                        flex h-11 w-11 items-center justify-center rounded-full 
                        ${openMenu ? "bg-white/20" : "bg-primary-main"}
                        text-white body-small font-semibold
                      `}>
                        {userInitials}
                      </div>
                    )}

                   
                  </button>

                  {/* Dropdown */}
                  {openMenu && (
                    <div className="absolute right-0 mt-s16 w-80 overflow-hidden rounded-r24 border border-secondary-dark bg-background shadow-xl ">
                      
                      {/* Header */}
                      <div className="bg-primary-main p-s24 text-white">
                        <div className="flex items-start gap-s16">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/20">
                            {user?.image ? (
                              <Image
                                src={user.image}
                                alt={user.name}
                                width={64}
                                height={64}
                                className="rounded-full"
                              />
                            ) : (
                              <span className="heading-h4">{userInitials}</span>
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

                      {/* Menu Items */}
                      <div className="p-s8">
                        <Link
                          href="/profile"
                          onClick={() => setOpenMenu(false)}
                          className="flex items-center gap-s16 px-s16 py-s16 rounded-r16 transition-colors hover:bg-secondary-main group"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-r12 bg-primary-main/10 group-hover:bg-primary-main/20 transition-colors">
                            <User size={18} className="text-primary-main" />
                          </div>
                          <div>
                            <p className="body-small font-medium text-main">Profile</p>
                            <p className="caption text-secondary">Manage your account</p>
                          </div>
                        </Link>

                        <Link
                          href="/plans"
                          onClick={() => setOpenMenu(false)}
                          className="flex items-center gap-s16 px-s16 py-s16 rounded-r16 transition-colors hover:bg-secondary-main group"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-r12 bg-primary-main/10 group-hover:bg-primary-main/20 transition-colors">
                            <Sparkles size={18} className="text-primary-main" />
                          </div>
                          <div>
                            <p className="body-small font-medium text-main">Plans</p>
                            <p className="caption text-secondary">View subscriptions</p>
                          </div>
                        </Link>

                        <Link
                          href="/orders"
                          onClick={() => setOpenMenu(false)}
                          className="flex items-center gap-s16 px-s16 py-s16 rounded-r16 transition-colors hover:bg-secondary-main group"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-r12 bg-primary-main/10 group-hover:bg-primary-main/20 transition-colors">
                            <Package size={18} className="text-primary-main" />
                          </div>
                          <div>
                            <p className="body-small font-medium text-main">Orders</p>
                            <p className="caption text-secondary">Track purchases</p>
                          </div>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-secondary-main p-s8">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-s16 px-s16 py-s16 rounded-r16 text-red-main transition-colors hover:bg-red-main/5 group"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-r12 bg-red-main/10 group-hover:bg-red-main/20 transition-colors">
                            <LogOut size={18} />
                          </div>
                          <p className="body-small font-medium">Logout</p>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex h-11 w-11 items-center justify-center rounded-r16 bg-primary-main/10 text-primary-main hover:bg-primary-main/20 transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-main/60 backdrop-blur-sm"
          />

          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-background shadow-2xl animate-slideRight">
            <div className="flex h-full flex-col">
              
              {/* Header */}
              <div className="bg-primary-main p-s24 text-white">
                <div className="flex items-center justify-between mb-s24">
                  <h3 className="heading-h5">Menu</h3>
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
                          alt={user.name}
                          width={56}
                          height={56}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="heading-h5">{userInitials}</span>
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

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto p-s16">
                <div className="space-y-s8">
                  {DESKTOP_NAV.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-s16 px-s16 py-s16 rounded-r16
                          body-default font-medium transition-colors
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

                {isLoggedIn && (
                  <>
                    <div className="my-s16 border-t border-secondary-main" />
                    
                    <div className="space-y-s8">
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-s16 px-s16 py-s16 rounded-r16 hover:bg-secondary-main transition-colors"
                      >
                        <User size={20} className="text-primary-main" />
                        <span className="body-default">Profile</span>
                      </Link>

                      <Link
                        href="/plans"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-s16 px-s16 py-s16 rounded-r16 hover:bg-secondary-main transition-colors"
                      >
                        <Sparkles size={20} className="text-primary-main" />
                        <span className="body-default">Plans</span>
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-s16 px-s16 py-s16 rounded-r16 hover:bg-secondary-main transition-colors"
                      >
                        <Package size={20} className="text-primary-main" />
                        <span className="body-default">Orders</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-secondary-main p-s16">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-s8 py-s16 rounded-r16 bg-red-main/10 text-red-main font-medium hover:bg-red-main/20 transition-colors"
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
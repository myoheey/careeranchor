"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  role: string;
}

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user: userProp }: NavbarProps) {
  const [user, setUser] = useState<User | null>(userProp ?? null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userProp !== undefined) {
      setUser(userProp);
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        // user not logged in
      }
    };
    fetchUser();
  }, [userProp]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch {
      setLoggingOut(false);
    }
  }, [router]);

  const isProfessor = user?.role === "PROFESSOR";

  const navLinks = (
    <>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50"
        onClick={() => setMobileMenuOpen(false)}
      >
        Dashboard
      </Link>
      {isProfessor && (
        <Link
          href="/projects"
          className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          My Projects
        </Link>
      )}
    </>
  );

  const roleBadge = user && (
    <span
      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
        user.role === "PROFESSOR"
          ? "bg-indigo-100 text-indigo-700"
          : "bg-orange-100 text-orange-700"
      }`}
    >
      {user.role}
    </span>
  );

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
              EntrePreneur LMS
            </span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks}
            </div>
          )}

          {/* Desktop user section */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {user.name}
                </span>
                {roleBadge}
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                {loggingOut ? "..." : "Logout"}
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {user && mobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-md animate-fade-in"
        >
          <div className="px-4 py-3 space-y-1">
            <div className="flex items-center gap-2 pb-3 mb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700">
                {user.name}
              </span>
              {roleBadge}
            </div>
            <div className="flex flex-col gap-1">
              {navLinks}
            </div>
            <div className="pt-2 mt-2 border-t border-slate-100">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

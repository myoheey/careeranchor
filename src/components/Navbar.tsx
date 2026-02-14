"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  role?: string;
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

  if (userProp !== undefined && userProp !== user) {
    setUser(userProp);
  }

  useEffect(() => {
    if (userProp !== undefined) return;
    let cancelled = false;
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok && !cancelled) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch { /* not logged in */ }
    };
    fetchUser();
    return () => { cancelled = true; };
  }, [userProp]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) document.addEventListener("mousedown", handleClickOutside);
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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/dashboard" className="text-base font-bold text-primary tracking-tight">
            Career<span className="text-primary-lighter">Anchor</span>
          </Link>
          {user && (
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm text-text-muted hover:text-primary transition-colors">대시보드</Link>
              {user.role === "admin" && (
                <Link href="/admin" className="text-sm text-text-muted hover:text-primary transition-colors">관리자</Link>
              )}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">{user.name.charAt(0)}</div>
                  <span className="text-sm text-text-secondary font-medium">{user.name}</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <button onClick={handleLogout} disabled={loggingOut} className="text-xs text-text-muted hover:text-red-600 transition-colors disabled:opacity-50">로그아웃</button>
              </div>
            </div>
          )}
          {user && (
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 rounded text-text-muted hover:text-primary transition-colors" aria-label="Toggle menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>
      {user && mobileMenuOpen && (
        <div ref={menuRef} className="md:hidden border-t border-border bg-white animate-fade-in">
          <div className="px-6 py-4 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-border-light">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">{user.name.charAt(0)}</div>
              <span className="text-sm text-text-secondary font-medium">{user.name}</span>
            </div>
            <Link href="/dashboard" className="block text-sm text-text-secondary hover:text-primary py-1" onClick={() => setMobileMenuOpen(false)}>대시보드</Link>
            {user.role === "admin" && (
              <Link href="/admin" className="block text-sm text-text-secondary hover:text-primary py-1" onClick={() => setMobileMenuOpen(false)}>관리자</Link>
            )}
            <button onClick={handleLogout} disabled={loggingOut} className="text-sm text-red-500 hover:text-red-600 disabled:opacity-50">
              {loggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

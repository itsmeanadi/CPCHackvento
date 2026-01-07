"use client";

import { signOut } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";

export function Navbar({ user }: { user: any }) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-md shadow-brand-500/20 ring-1 ring-black/5">
              <span className="text-white font-bold text-sm tracking-tight">CPC</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 tracking-tight leading-none text-base">Placement Cell</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-600 mt-0.5">IET DAVV</span>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200/60">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</p>
                <p className="text-xs text-slate-500 font-medium capitalize">{user.role}</p>
              </div>

              <div className="relative group">
                <div className="h-9 w-9 rounded-full bg-slate-100 ring-2 ring-white shadow-sm overflow-hidden transition-transform group-hover:scale-105">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-brand-50 text-brand-600">
                      <UserIcon size={16} />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="group flex items-center justify-center h-9 w-9 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                title="Sign Out"
              >
                <LogOut size={18} className="transition-transform group-hover:-translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
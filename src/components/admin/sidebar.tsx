"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  Lock,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },

  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },

  {
    name: "Staff",
    href: "/admin/staff",
    icon: UserCog,
  },

  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },

  {
    name: "Change Password",
    href: "/admin/password-reset",
    icon: Lock,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full h-screen p-4 overflow-y-auto">
      <ul className="space-y-2">
        {menu.map((item) => {
          const isActive =
            pathname === item.href;

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-muted font-medium"
                    : "hover:bg-muted"
                }`}
              >
                <item.icon size={18} />

                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
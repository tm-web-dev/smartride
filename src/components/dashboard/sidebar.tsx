"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User, Lock } from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="px-4 w-full py-6 h-screen overflow-y-auto">

      <ul className="space-y-2">
        {menu.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-2 py-2 leading-none rounded-lg transition
                ${isActive 
                  ? "bg-muted font-medium" 
                  : "hover:bg-muted"}
                `}
              >
                <item.icon size={16} />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
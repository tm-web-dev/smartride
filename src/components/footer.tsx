"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on receipt pages
  if (pathname.startsWith("/receipt")) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SmartBus. All rights reserved.
      </div>
    </footer>
  );
}
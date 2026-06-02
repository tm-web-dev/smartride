import StaffSidebar from "@/components/staff/sidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:block w-72 border-r">
        <StaffSidebar />
      </aside>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
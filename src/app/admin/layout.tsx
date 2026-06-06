import AdminSidebar from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">

      <aside className="w-64 border-r min-h-screen">
        <AdminSidebar />
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
}
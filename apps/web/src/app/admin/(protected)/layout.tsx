import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-admin-bg lg:flex">
      <Sidebar />
      <main className="min-w-0 p-4 lg:flex-1 lg:p-7">{children}</main>
    </div>
  );
}

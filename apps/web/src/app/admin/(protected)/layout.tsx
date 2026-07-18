import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-admin-bg">
      <Sidebar />
      <main className="min-w-0 flex-1 p-7">{children}</main>
    </div>
  );
}

import Sidebar from "@/components/shared/Sidebar";

export default function ContainsSidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}

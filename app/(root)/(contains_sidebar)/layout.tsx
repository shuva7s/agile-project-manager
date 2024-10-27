import Sidebar from "@/components/shared/Sidebar";
import { SignedIn } from "@clerk/nextjs";

export default function ContainsSidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SignedIn>
        <Sidebar />
      </SignedIn>
      {children}
    </>
  );
}

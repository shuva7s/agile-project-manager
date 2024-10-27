import MobileNabvar from "@/components/shared/MobileNabvar";
import { SignedIn } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row items-start">
      {children}
      <SignedIn>
        <MobileNabvar />
      </SignedIn>
    </div>
  );
}

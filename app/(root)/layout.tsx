import MobileNabvar from "@/components/shared/MobileNabvar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-row items-start">
    {children}
    <MobileNabvar/>
  </div>;
}


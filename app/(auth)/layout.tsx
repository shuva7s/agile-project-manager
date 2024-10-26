export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="w-full min-h-screen bg-background flex justify-center items-center">{children}</main>;
}

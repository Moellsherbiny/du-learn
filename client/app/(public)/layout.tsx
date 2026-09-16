
import PublicFooter from "@/components/layout/public-footer";
import { PublicNavbar } from "@/components/layout/public-navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      dir="rtl"
      className="min-h-svh bg-background"
    >
      <PublicNavbar />

      <main>{children}</main>

      <PublicFooter/>
    </div>
  );
}

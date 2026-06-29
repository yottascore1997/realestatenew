import { Navbar } from "@/components/website/navbar";
import { Footer } from "@/components/website/footer";

export const dynamic = "force-dynamic";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

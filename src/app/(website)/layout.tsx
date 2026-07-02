import { WebsiteShell } from "@/components/website/website-shell";
import { getHeroSearchData } from "@/lib/website/get-hero-data";

export const dynamic = "force-dynamic";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const heroData = await getHeroSearchData();

  return (
    <div className="website-theme flex min-h-screen flex-col">
      <WebsiteShell stats={heroData.stats}>{children}</WebsiteShell>
    </div>
  );
}

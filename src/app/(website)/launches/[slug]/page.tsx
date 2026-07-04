import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LaunchLandingPage } from "@/components/website/launch-landing-page";
import { getLaunchBySlug, getAllLaunchSlugs } from "@/lib/website/get-launch-by-slug";
import { getHeroSearchData } from "@/lib/website/get-hero-data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { slug: string };
};

function formatPriceMeta(from?: number | null) {
  if (!from) return "";
  if (from >= 10000000) return ` from ₹${(from / 10000000).toFixed(1)} Cr`;
  return ` from ₹${(from / 100000).toFixed(0)} Lakh`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const launch = await getLaunchBySlug(params.slug);
  if (!launch) return { title: "Launch Not Found | Triyards Realty" };

  const title = `${launch.name} — New Launch in ${launch.city} | Triyards Realty`;
  const description = `${launch.name} by ${launch.builder ?? "premium builder"} in ${launch.location}, ${launch.city}.${formatPriceMeta(launch.priceFrom)}. ${launch.offer ?? "Pre-launch offer."} Register for floor plan & site visit. Zero brokerage.`;
  const url = `/launches/${launch.slug}`;

  return {
    title,
    description,
    keywords: [launch.name, `${launch.name} ${launch.city}`, `new launch ${launch.city}`, launch.builder ?? "", "RERA", "Triyards Realty"].filter(Boolean),
    openGraph: { title, description, type: "website", url, images: launch.image ? [{ url: launch.image, alt: launch.name }] : [] },
    twitter: { card: "summary_large_image", title, description, images: launch.image ? [launch.image] : [] },
    alternates: { canonical: url },
  };
}

export default async function LaunchLandingRoute({ params }: PageProps) {
  const [launch, heroData] = await Promise.all([
    getLaunchBySlug(params.slug),
    getHeroSearchData(),
  ]);
  if (!launch) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: launch.name,
    description: launch.description,
    image: launch.image,
    address: { "@type": "PostalAddress", addressLocality: launch.city, streetAddress: launch.location, addressCountry: "IN" },
    ...(launch.priceFrom && { offers: { "@type": "Offer", price: launch.priceFrom, priceCurrency: "INR" } }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LaunchLandingPage launch={launch} stats={heroData.stats} />
    </>
  );
}

export async function generateStaticParams() {
  const slugs = await getAllLaunchSlugs();
  return slugs.map((slug) => ({ slug }));
}

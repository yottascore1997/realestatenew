import { prisma } from "@/lib/prisma";
import { PLACEHOLDER_LAUNCHES } from "@/lib/website/constants";
import type { LaunchLandingData } from "@/lib/website/launch-types";

function mapDbLaunch(
  l: Awaited<ReturnType<typeof prisma.launch.findFirst>> & object
): LaunchLandingData {
  const project = "project" in l ? (l.project as { id: string; name: string } | null) : null;
  const imagesRaw = "images" in l && l.images;
  const images = Array.isArray(imagesRaw) ? (imagesRaw as string[]) : [];

  return {
    id: l.id,
    slug: l.slug,
    name: l.name,
    description: l.description,
    location: l.location,
    city: l.city,
    status: l.status,
    launchDate: l.launchDate?.toISOString() ?? null,
    image: l.image,
    images: images.length > 0 ? images : l.image ? [l.image] : [],
    priceFrom: l.priceFrom ? Number(l.priceFrom) : null,
    priceTo: l.priceTo ? Number(l.priceTo) : null,
    builder: l.builder ?? project?.name ?? null,
    bhk: l.bhk,
    possession: l.possession,
    offer: l.offer,
    projectId: l.projectId,
    projectName: project?.name ?? null,
  };
}

const PLACEHOLDER_BY_SLUG: Record<string, LaunchLandingData> = Object.fromEntries(
  PLACEHOLDER_LAUNCHES.map((p, i) => {
    const slug = p.slug;
    return [
      slug,
      {
        id: `placeholder-${i + 1}`,
        slug,
        name: p.name,
        description: `${p.name} by ${p.builder} — premium new launch in ${p.location}, ${p.city}. ${p.offer ?? "Exclusive pre-launch benefits for early buyers."}`,
        location: p.location,
        city: p.city,
        status: "LIVE",
        launchDate: null,
        image: p.image,
        images: [p.image],
        priceFrom: p.priceFrom,
        priceTo: p.priceTo,
        builder: p.builder,
        bhk: p.bhk,
        possession: p.possession,
        offer: p.offer,
        projectId: null,
        projectName: p.name,
      } satisfies LaunchLandingData,
    ];
  })
);

export async function getLaunchBySlug(slug: string): Promise<LaunchLandingData | null> {
  try {
    const launch = await prisma.launch.findUnique({
      where: { slug },
      include: { project: { include: { builder: true } } },
    });
    if (launch) {
      const mapped = mapDbLaunch(launch);
      mapped.builder = launch.builder ?? launch.project?.builder?.name ?? mapped.builder;
      mapped.projectName = launch.project?.name ?? null;
      return mapped;
    }
  } catch {
    // fall through to placeholders
  }

  return PLACEHOLDER_BY_SLUG[slug] ?? null;
}

export async function getAllLaunchSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.launch.findMany({ select: { slug: true } });
    const dbSlugs = rows.map((r) => r.slug);
    const placeholderSlugs = Object.keys(PLACEHOLDER_BY_SLUG);
    return [...new Set([...dbSlugs, ...placeholderSlugs])];
  } catch {
    return Object.keys(PLACEHOLDER_BY_SLUG);
  }
}

export async function getSimilarLaunches(city: string, currentSlug: string, limit = 3): Promise<LaunchLandingData[]> {
  try {
    const dbLaunches = await prisma.launch.findMany({
      where: {
        city: { contains: city },
        slug: { not: currentSlug }
      },
      take: limit,
      include: { project: { include: { builder: true } } },
    });
    if (dbLaunches.length > 0) {
      return dbLaunches.map((l) => {
        const mapped = mapDbLaunch(l);
        mapped.builder = l.builder ?? l.project?.builder?.name ?? mapped.builder;
        mapped.projectName = l.project?.name ?? null;
        return mapped;
      });
    }
  } catch {
    // fall through to placeholders
  }

  const placeholders = Object.values(PLACEHOLDER_BY_SLUG).filter(
    (p) => p.city.toLowerCase().includes(city.toLowerCase()) && p.slug !== currentSlug
  );
  if (placeholders.length > 0) {
    return placeholders.slice(0, limit);
  }
  return Object.values(PLACEHOLDER_BY_SLUG)
    .filter((p) => p.slug !== currentSlug)
    .slice(0, limit);
}


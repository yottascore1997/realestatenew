import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { HomePageContent } from "@/components/website/home-page-content";
import { getHeroSearchData } from "@/lib/website/get-hero-data";

const launchInclude = { project: { include: { builder: true } } } as const;
type LaunchRow = Prisma.LaunchGetPayload<{ include: typeof launchInclude }>;

export default async function HomePage() {
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let properties: Awaited<ReturnType<typeof prisma.property.findMany>> = [];
  let launches: LaunchRow[] = [];
  let featuredLaunches: LaunchRow[] = [];
  let testimonials: Awaited<ReturnType<typeof prisma.testimonial.findMany>> = [];
  const heroData = await getHeroSearchData();

  try {
    [projects, properties, launches, featuredLaunches, testimonials] = await Promise.all([
      prisma.project.findMany({ take: 8, orderBy: [{ featured: "desc" }, { createdAt: "desc" }], include: { builder: true } }),
      prisma.property.findMany({ take: 8, orderBy: [{ featured: "desc" }, { createdAt: "desc" }], include: { project: true } }),
      prisma.launch.findMany({ take: 4, orderBy: [{ launchDate: "desc" }], include: launchInclude }),
      prisma.launch.findMany({
        where: { featured: true },
        take: 4,
        orderBy: [{ launchDate: "asc" }],
        include: launchInclude,
      }),
      prisma.testimonial.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      }),
    ]);
  } catch {
    // DB not connected — page still renders with empty lists
  }

  const avgRating =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      : 4.8;

  const mapLaunch = (l: LaunchRow) => ({
    id: l.id,
    slug: l.slug,
    name: l.name,
    location: l.location,
    city: l.city,
    image: l.image,
    priceFrom: l.priceFrom ? Number(l.priceFrom) : null,
    priceTo: l.priceTo ? Number(l.priceTo) : null,
    builder: l.builder ?? l.project?.builder?.name ?? undefined,
    bhk: l.bhk ?? undefined,
    possession: l.possession ?? undefined,
    offer: l.offer ?? undefined,
    status: l.status,
  });

  return (
    <HomePageContent
      heroData={heroData}
      projects={projects.map((p) => ({
        id: p.id, name: p.name, location: p.location, city: p.city,
        image: p.image, priceFrom: p.priceFrom ? Number(p.priceFrom) : null, status: p.status,
      }))}
      properties={properties.map((p) => ({
        id: p.id, title: p.title, address: p.address, city: p.city,
        image: p.image, price: Number(p.price), bedrooms: p.bedrooms,
        bathrooms: p.bathrooms, sqft: p.sqft ? Number(p.sqft) : null, status: p.status,
      }))}
      launches={launches.map(mapLaunch)}
      featuredLaunches={featuredLaunches.map(mapLaunch)}
      testimonials={testimonials.map((t) => ({
        id: t.id,
        name: t.name,
        role: t.role,
        city: t.city,
        text: t.text,
        rating: t.rating,
        image: t.image,
        avatar: t.avatar,
        featured: t.featured,
      }))}
      reviewCount={testimonials.length > 0 ? testimonials.length * 625 : undefined}
      avgRating={avgRating}
    />
  );
}

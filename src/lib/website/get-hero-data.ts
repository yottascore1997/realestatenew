import { prisma } from "@/lib/prisma";

export type HeroSearchData = {
  cities: string[];
  propertyTypes: { value: string; label: string; count: number }[];
  stats: {
    propertyCount: number;
    projectCount: number;
    launchCount: number;
    cityCount: number;
  };
};

const FALLBACK_CITIES = ["Mumbai", "Pune", "Bangalore", "Delhi", "Hyderabad", "Gurgaon", "Noida", "Chennai"];

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  HOUSE: "Independent House",
  COMMERCIAL: "Commercial",
  LAND: "Plot / Land",
  PENTHOUSE: "Penthouse",
};

export async function getHeroSearchData(): Promise<HeroSearchData> {
  try {
    const [propertyCities, projectCities, propertyCount, projectCount, launchCount, typeGroups] =
      await Promise.all([
        prisma.property.findMany({ select: { city: true }, distinct: ["city"], where: { city: { not: "" } } }),
        prisma.project.findMany({ select: { city: true }, distinct: ["city"], where: { city: { not: "" } } }),
        prisma.property.count(),
        prisma.project.count(),
        prisma.launch.count(),
        prisma.property.groupBy({ by: ["type"], _count: { type: true } }),
      ]);

    const citySet = new Set<string>();
    [...propertyCities, ...projectCities].forEach(({ city }) => {
      if (city?.trim()) citySet.add(city.trim());
    });

    const cities = Array.from(citySet).sort((a, b) => a.localeCompare(b));
    const finalCities = cities.length > 0 ? cities : FALLBACK_CITIES;

    const propertyTypes: HeroSearchData["propertyTypes"] = typeGroups
      .map(({ type, _count }) => ({
        value: type,
        label: TYPE_LABELS[type] ?? type,
        count: _count.type,
      }))
      .sort((a, b) => b.count - a.count);

    if (propertyTypes.length === 0) {
      Object.entries(TYPE_LABELS).slice(0, 4).forEach(([value, label]) => {
        propertyTypes.push({ value, label, count: 0 });
      });
    }

    return {
      cities: finalCities,
      propertyTypes,
      stats: {
        propertyCount,
        projectCount,
        launchCount,
        cityCount: finalCities.length,
      },
    };
  } catch {
    return {
      cities: FALLBACK_CITIES,
      propertyTypes: [
        { value: "APARTMENT", label: "Apartment", count: 0 },
        { value: "VILLA", label: "Villa", count: 0 },
        { value: "LAND", label: "Plot / Land", count: 0 },
        { value: "COMMERCIAL", label: "Commercial", count: 0 },
      ],
      stats: {
        propertyCount: 0,
        projectCount: 0,
        launchCount: 0,
        cityCount: FALLBACK_CITIES.length,
      },
    };
  }
}

export const HERO_BUDGET_OPTIONS = [
  { value: "", label: "Any Budget", minPrice: null as number | null, maxPrice: null as number | null },
  { value: "under-50", label: "Under ₹50 Lakh", minPrice: null, maxPrice: 5000000 },
  { value: "50-100", label: "₹50L – ₹1 Cr", minPrice: 5000000, maxPrice: 10000000 },
  { value: "100-200", label: "₹1 Cr – ₹2 Cr", minPrice: 10000000, maxPrice: 20000000 },
  { value: "200-plus", label: "Above ₹2 Cr", minPrice: 20000000, maxPrice: null },
] as const;

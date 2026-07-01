export type PropertyAgent = {
  name: string;
  designation: string;
  phone: string;
  email: string;
  avatar: string | null;
  rating: number;
};

export type PropertyDetail = {
  id: string;
  slug: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  parking: number;
  floor: string;
  totalFloors: number;
  image: string | null;
  images: string[];
  amenities: string[];
  featured: boolean;
  projectName: string | null;
  propertyId: string;
  reraId: string;
  possession: string;
  furnishing: string;
  facing: string;
  propertyAge: string;
  agent: PropertyAgent;
  nearby: { name: string; distance: string }[];
};

const DEFAULT_AGENT: PropertyAgent = {
  name: "Rahul Mehta",
  designation: "Senior Property Consultant",
  phone: "+91 98765 43210",
  email: "rahul@triyards.com",
  avatar: null,
  rating: 4.8,
};

const DEFAULT_AMENITIES = [
  "Swimming Pool",
  "Gymnasium",
  "Club House",
  "Landscaped Garden",
  "Children's Play Area",
  "24/7 Security",
  "Power Backup",
  "Covered Parking",
  "Indoor Games",
  "Jogging Track",
];

const DEFAULT_NEARBY = [
  { name: "Worli Sea Face", distance: "1.2 km" },
  { name: "BKC Business District", distance: "3.5 km" },
  { name: "Phoenix Mall", distance: "2.8 km" },
  { name: "International Airport", distance: "12 km" },
  { name: "Metro Station", distance: "0.8 km" },
  { name: "International School", distance: "2.1 km" },
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=700&fit=crop&q=85",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=520&fit=crop&q=85",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=520&fit=crop&q=85",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=520&fit=crop&q=85",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=520&fit=crop&q=85",
];

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function buildGallery(main: string | null) {
  const set = new Set<string>();
  if (main) set.add(main);
  GALLERY_IMAGES.forEach((img) => set.add(img));
  return Array.from(set).slice(0, 8);
}

export function buildPropertyDetail(input: {
  id: string;
  slug: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state?: string | null;
  zipCode?: string | null;
  price: number;
  type: string;
  status?: string;
  bedrooms: number;
  bathrooms: number;
  sqft?: number | null;
  image?: string | null;
  images?: string[];
  amenities?: string[];
  featured?: boolean;
  projectName?: string | null;
  agent?: Partial<PropertyAgent> | null;
}): PropertyDetail {
  const amenities =
    input.amenities && input.amenities.length > 0 ? input.amenities : DEFAULT_AMENITIES;

  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    description:
      input.description ||
      "Experience luxury living with premium finishes, smart home features, and world-class amenities. This property offers spacious layouts, excellent natural light, and seamless connectivity to major business hubs, schools, and entertainment zones.",
    address: input.address,
    city: input.city,
    state: input.state || "Maharashtra",
    zipCode: input.zipCode || "400018",
    price: input.price,
    type: input.type,
    status: input.status || "FOR_SALE",
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    sqft: input.sqft ?? 1580,
    parking: 2,
    floor: "12th",
    totalFloors: 45,
    image: input.image ?? GALLERY_IMAGES[0],
    images: buildGallery(input.image ?? null),
    amenities,
    featured: input.featured ?? false,
    projectName: input.projectName ?? null,
    propertyId: `TY-${input.id.slice(0, 6).toUpperCase()}`,
    reraId: "P51800001234",
    possession: "Dec 2026",
    furnishing: "Semi-Furnished",
    facing: "East",
    propertyAge: "New Construction",
    agent: { ...DEFAULT_AGENT, ...input.agent },
    nearby: DEFAULT_NEARBY,
  };
}

export const FALLBACK_PROPERTY_DETAILS: PropertyDetail[] = [
  buildPropertyDetail({
    id: "demo-1",
    slug: "the-riverside-residences",
    title: "The Riverside Residences",
    description:
      "The Riverside Residences offers an unparalleled luxury living experience in the heart of Worli. Featuring panoramic sea views, Italian marble flooring, modular kitchens, and floor-to-ceiling windows. Residents enjoy access to a rooftop infinity pool, spa, and concierge services.",
    address: "Worli, Mumbai",
    city: "Mumbai",
    price: 48500000,
    type: "APARTMENT",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1580,
    image: GALLERY_IMAGES[0],
    featured: true,
    amenities: DEFAULT_AMENITIES,
  }),
  buildPropertyDetail({
    id: "demo-2",
    slug: "skyline-heights",
    title: "Skyline Heights",
    description:
      "A premium penthouse collection with private terraces and 360° city views. Smart automation, jacuzzi, and premium fixtures throughout.",
    address: "Bandra West, Mumbai",
    city: "Mumbai",
    price: 62000000,
    type: "PENTHOUSE",
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3200,
    image: GALLERY_IMAGES[1],
    featured: false,
  }),
  buildPropertyDetail({
    id: "demo-3",
    slug: "green-valley-villas",
    title: "Green Valley Villas",
    description:
      "Independent villa with landscaped garden, home theatre, and smart automation in Whitefield's most sought-after neighbourhood.",
    address: "Whitefield, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    price: 18500000,
    type: "VILLA",
    bedrooms: 4,
    bathrooms: 4,
    sqft: 2800,
    image: GALLERY_IMAGES[2],
    featured: true,
  }),
  buildPropertyDetail({
    id: "demo-4",
    slug: "marina-bay-towers",
    title: "Marina Bay Towers",
    description:
      "Rare corner unit with wrap-around balconies and premium Italian marble flooring overlooking Marine Drive.",
    address: "Marine Drive, Mumbai",
    city: "Mumbai",
    price: 38000000,
    type: "APARTMENT",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1850,
    image: GALLERY_IMAGES[3],
    featured: false,
  }),
  buildPropertyDetail({
    id: "demo-5",
    slug: "prestige-lakeside",
    title: "Prestige Lakeside",
    description:
      "Ready-to-move 2 BHK with clubhouse, gym, and swimming pool access near Hinjewadi IT Park.",
    address: "Hinjewadi Phase 1, Pune",
    city: "Pune",
    price: 7200000,
    type: "APARTMENT",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    image: GALLERY_IMAGES[4],
    featured: true,
  }),
  buildPropertyDetail({
    id: "demo-6",
    slug: "emerald-heights",
    title: "Emerald Heights",
    description:
      "5 BHK villa overlooking golf course with private pool, servant quarter, and premium security.",
    address: "Sector 42, Gurgaon",
    city: "Gurgaon",
    state: "Haryana",
    price: 45000000,
    type: "VILLA",
    bedrooms: 5,
    bathrooms: 5,
    sqft: 4500,
    image: GALLERY_IMAGES[0],
    featured: false,
  }),
];

export function getFallbackProperty(slug: string) {
  return FALLBACK_PROPERTY_DETAILS.find((p) => p.slug === slug) ?? null;
}

export function titleToSlug(title: string) {
  return slugify(title);
}

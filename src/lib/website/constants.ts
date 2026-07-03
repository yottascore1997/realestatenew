export const BRAND_NAME = "Triyards";
export const BRAND_LOGO = "/images/logo.png";

export const WEBSITE_NAV = [
  { label: "Buy", href: "/properties" },
  { label: "Rent", href: "/properties" },
  { label: "New Projects", href: "/projects" },
  { label: "Builders", href: "/projects" },
  { label: "Commercial", href: "/properties" },
  { label: "Services", href: "/contact" },
  { label: "About Us", href: "/contact" },
] as const;

export const HERO_TRUST_ITEMS = [
  { label: "RERA Verified", icon: "ShieldCheck" },
  { label: "2000+ Projects", icon: "Building2" },
  { label: "Trusted Builders", icon: "Award" },
  { label: "Best Price Guarantee", icon: "BadgeCheck" },
  { label: "Easy Home Loans", icon: "Landmark" },
] as const;

export const BUILDER_LOGOS = [
  { name: "Lodha", logo: "/builders/lodha.svg" },
  { name: "Godrej Properties", logo: "/builders/godrej.svg" },
  { name: "DLF", logo: "/builders/dlf.svg" },
  { name: "Piramal Realty", logo: "/builders/piramal.svg" },
  { name: "Prestige Group", logo: "/builders/prestige.svg" },
  { name: "Tata Housing", logo: "/builders/tata.svg" },
  { name: "Shapoorji Pallonji", logo: "/builders/shapoorji.svg" },
  { name: "Raheja Developers", logo: "/builders/raheja.svg" },
  { name: "Brigade", logo: "/builders/brigade.svg" },
  { name: "Mahindra Lifespaces", logo: "/builders/mahindra.svg" },
] as const;

/** @deprecated use BUILDER_LOGOS */
export const TOP_BUILDERS = BUILDER_LOGOS.map((b) => b.name);

export const BUILDER_PARTNER_STATS = [
  { label: "Top Builders", value: "100+" },
  { label: "Projects", value: "500+" },
  { label: "Cities", value: "50+" },
] as const;

export const WHY_CHOOSE = [
  { title: "100% RERA Verified", desc: "Every project is verified for RERA compliance before listing.", icon: "ShieldCheck" },
  { title: "Trusted Builders", desc: "Partner with India's most reputed developers only.", icon: "Building2" },
  { title: "Free Site Visits", desc: "Schedule unlimited site visits with our expert team.", icon: "MapPin" },
  { title: "Home Loan Support", desc: "Get the best rates from 20+ partner banks.", icon: "Landmark" },
  { title: "Lowest Price Guarantee", desc: "We match or beat any genuine competitor offer.", icon: "BadgeCheck" },
  { title: "Legal Assistance", desc: "End-to-end documentation and registration support.", icon: "Scale" },
] as const;

export const EXPLORE_CITIES = [
  { name: "Mumbai", count: "1200+", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&h=1100&fit=crop&q=85" },
  { name: "Bengaluru", count: "950+", image: "https://images.unsplash.com/photo-1459787827056-fca21e4b5b17?w=900&h=600&fit=crop&q=85" },
  { name: "Pune", count: "680+", image: "https://images.unsplash.com/photo-1652144570437-37207890d993?w=900&h=600&fit=crop&q=85" },
  { name: "Gurgaon", count: "540+", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=600&fit=crop&q=85" },
  { name: "Hyderabad", count: "720+", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&h=600&fit=crop&q=85" },
  { name: "Delhi", count: "1100+", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&h=600&fit=crop&q=85" },
  { name: "Noida", count: "480+", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=600&fit=crop&q=85" },
] as const;

export const PLATFORM_STATS = [
  { value: "50,000+", label: "Properties Listed", icon: "Building2" },
  { value: "1,500+", label: "Top Builders", icon: "HardHat" },
  { value: "500+", label: "Cities", icon: "MapPin" },
  { value: "10,000+", label: "Happy Clients", icon: "Users" },
] as const;

export const PLACEHOLDER_LAUNCHES = [
  {
    id: "1",
    name: "Lodha Bellevue",
    builder: "Lodha Group",
    location: "Malabar Hill",
    city: "Mumbai",
    priceFrom: 27500000,
    priceTo: 85000000,
    bhk: "3 & 4 BHK Apartment",
    possession: "Dec 2027",
    offer: "Zero Brokerage + Easy EMI Plans",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=700&fit=crop&q=85",
  },
  {
    id: "2",
    name: "Godrej Infinity",
    builder: "Godrej Properties",
    location: "Koregaon Park",
    city: "Pune",
    priceFrom: 7790000,
    priceTo: 15000000,
    bhk: "2, 3 BHK Apartment, Duplexes",
    possession: "Mar 2028",
    offer: "3.9% Fixed Interest Rate on Home Loan",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=700&fit=crop&q=85",
  },
  {
    id: "3",
    name: "Prestige Lakeside",
    builder: "Prestige Group",
    location: "Whitefield",
    city: "Bangalore",
    priceFrom: 22000000,
    priceTo: 48000000,
    bhk: "3 BHK Apartment",
    possession: "Jun 2027",
    offer: "Assured Rental Returns for 2 Years",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=700&fit=crop&q=85",
  },
  {
    id: "4",
    name: "DLF The Crest",
    builder: "DLF Limited",
    location: "Sector 54",
    city: "Gurgaon",
    priceFrom: 45000000,
    priceTo: 95000000,
    bhk: "4 & 5 BHK Apartment",
    possession: "Sep 2028",
    offer: "Club Membership Worth ₹5 L Included",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=700&fit=crop&q=85",
  },
] as const;

export const HOT_SELLING_CITIES = [
  "Mumbai", "Bengaluru", "Pune", "Hyderabad", "Gurgaon", "Noida", "Delhi",
  "Thane", "Chennai", "Jaipur", "Kochi", "Lucknow",
] as const;

export type HotSellingCity = (typeof HOT_SELLING_CITIES)[number];

export const HOT_SELLING_PROJECTS: Record<
  HotSellingCity,
  readonly { id: string; name: string; location: string; priceFrom: number; priceTo: number; image: string }[]
> = {
  Hyderabad: [
    { id: "h1", name: "Prestige Golden Grove", location: "Tellapur", priceFrom: 9300000, priceTo: 24800000, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=520&fit=crop&q=85" },
    { id: "h2", name: "Godrej Madison Avenue", location: "Kokapet", priceFrom: 38000000, priceTo: 70000000, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=520&fit=crop&q=85" },
    { id: "h3", name: "Rajapushpa Imperia", location: "Kokapet", priceFrom: 38000000, priceTo: 61300000, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=520&fit=crop&q=85" },
    { id: "h4", name: "Cybercity Oriana", location: "Kokapet", priceFrom: 39400000, priceTo: 72000000, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=520&fit=crop&q=85" },
    { id: "h5", name: "Aparna Zenon", location: "Gachibowli", priceFrom: 12500000, priceTo: 28500000, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=520&fit=crop&q=85" },
  ],
  Mumbai: [
    { id: "m1", name: "Lodha Bellevue", location: "Malabar Hill", priceFrom: 27500000, priceTo: 85000000, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=520&fit=crop&q=85" },
    { id: "m2", name: "Oberoi Sky City", location: "Borivali", priceFrom: 18500000, priceTo: 42000000, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=520&fit=crop&q=85" },
    { id: "m3", name: "Raheja Imperia", location: "Worli", priceFrom: 45000000, priceTo: 120000000, image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=520&fit=crop&q=85" },
    { id: "m4", name: "Kalpataru Elitus", location: "Mulund", priceFrom: 22000000, priceTo: 55000000, image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=520&fit=crop&q=85" },
  ],
  Bengaluru: [
    { id: "b1", name: "Prestige Lakeside", location: "Whitefield", priceFrom: 22000000, priceTo: 48000000, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=520&fit=crop&q=85" },
    { id: "b2", name: "Brigade Cornerstone", location: "Varthur", priceFrom: 9800000, priceTo: 22000000, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=520&fit=crop&q=85" },
    { id: "b3", name: "Sobha Neopolis", location: "Panathur", priceFrom: 16500000, priceTo: 35000000, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=520&fit=crop&q=85" },
    { id: "b4", name: "Godrej Reserve", location: "Devanahalli", priceFrom: 12000000, priceTo: 28000000, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=520&fit=crop&q=85" },
  ],
  Pune: [
    { id: "p1", name: "Godrej Infinity", location: "Koregaon Park", priceFrom: 18500000, priceTo: 38000000, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=520&fit=crop&q=85" },
    { id: "p2", name: "Kolte Patil Life", location: "Hinjewadi", priceFrom: 7500000, priceTo: 16500000, image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=520&fit=crop&q=85" },
    { id: "p3", name: "VTP Blue Waters", location: "Mahalunge", priceFrom: 6200000, priceTo: 14000000, image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=520&fit=crop&q=85" },
    { id: "p4", name: "Paranjape Azure", location: "Tathawade", priceFrom: 8900000, priceTo: 19500000, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=520&fit=crop&q=85" },
  ],
  Gurgaon: [
    { id: "g1", name: "DLF The Crest", location: "Sector 54", priceFrom: 45000000, priceTo: 95000000, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=520&fit=crop&q=85" },
    { id: "g2", name: "Emaar Digi Homes", location: "Sector 62", priceFrom: 28000000, priceTo: 65000000, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=520&fit=crop&q=85" },
    { id: "g3", name: "M3M Golf Estate", location: "Sector 65", priceFrom: 35000000, priceTo: 78000000, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=520&fit=crop&q=85" },
    { id: "g4", name: "Sobha City", location: "Sector 108", priceFrom: 22000000, priceTo: 48000000, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=520&fit=crop&q=85" },
  ],
  Noida: [
    { id: "n1", name: "ATS Pious Hideaways", location: "Sector 150", priceFrom: 14000000, priceTo: 32000000, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=520&fit=crop&q=85" },
    { id: "n2", name: "Godrej Nest", location: "Sector 150", priceFrom: 16500000, priceTo: 38000000, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=520&fit=crop&q=85" },
    { id: "n3", name: "Eldeco Live", location: "Sector 150", priceFrom: 9800000, priceTo: 24000000, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=520&fit=crop&q=85" },
    { id: "n4", name: "Mahagun Medalleo", location: "Sector 107", priceFrom: 18500000, priceTo: 42000000, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=520&fit=crop&q=85" },
  ],
  Delhi: [
    { id: "d1", name: "DLF One Midtown", location: "Motia Khan", priceFrom: 55000000, priceTo: 150000000, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=520&fit=crop&q=85" },
    { id: "d2", name: "Tata Primanti", location: "Sector 72 Gurgaon", priceFrom: 32000000, priceTo: 72000000, image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=520&fit=crop&q=85" },
    { id: "d3", name: "M3M Capital", location: "Sector 113", priceFrom: 28000000, priceTo: 58000000, image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=520&fit=crop&q=85" },
    { id: "d4", name: "Signature Global", location: "Sector 37D", priceFrom: 12000000, priceTo: 28000000, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=520&fit=crop&q=85" },
  ],
  Thane: [
    { id: "t1", name: "Runwal Gardens", location: "Dombivli", priceFrom: 6500000, priceTo: 15000000, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=520&fit=crop&q=85" },
    { id: "t2", name: "Hiranandani Estate", location: "Thane West", priceFrom: 18000000, priceTo: 42000000, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=520&fit=crop&q=85" },
    { id: "t3", name: "Lodha Amara", location: "Kolshet", priceFrom: 9500000, priceTo: 22000000, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=520&fit=crop&q=85" },
    { id: "t4", name: "Rustomjee Urbania", location: "Majiwada", priceFrom: 14000000, priceTo: 32000000, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=520&fit=crop&q=85" },
  ],
  Chennai: [
    { id: "c1", name: "TVS Emerald Isle", location: "MRC Nagar", priceFrom: 22000000, priceTo: 55000000, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=520&fit=crop&q=85" },
    { id: "c2", name: "Casagrand Watercolors", location: "Pallavaram", priceFrom: 5800000, priceTo: 13500000, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=520&fit=crop&q=85" },
    { id: "c3", name: "Prestige Bella Vista", location: "Manapakkam", priceFrom: 12500000, priceTo: 28000000, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=520&fit=crop&q=85" },
    { id: "c4", name: "DLF West Park", location: "Porur", priceFrom: 9800000, priceTo: 22000000, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=520&fit=crop&q=85" },
  ],
  Jaipur: [
    { id: "j1", name: "Ashiana Anmol", location: "Mansarovar", priceFrom: 4500000, priceTo: 9800000, image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=520&fit=crop&q=85" },
    { id: "j2", name: "Vatika India Next", location: "Ajmer Road", priceFrom: 3800000, priceTo: 8500000, image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=520&fit=crop&q=85" },
    { id: "j3", name: "Unique Aspiration", location: "Jagatpura", priceFrom: 5200000, priceTo: 11500000, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=520&fit=crop&q=85" },
    { id: "j4", name: "Mahima Panorama", location: "Tonk Road", priceFrom: 4200000, priceTo: 9200000, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=520&fit=crop&q=85" },
  ],
  Kochi: [
    { id: "k1", name: "Prestige Ocean Crest", location: "Maradu", priceFrom: 8500000, priceTo: 22000000, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=520&fit=crop&q=85" },
    { id: "k2", name: "SFS Bluebell", location: "Kakkanad", priceFrom: 6200000, priceTo: 14500000, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=520&fit=crop&q=85" },
    { id: "k3", name: "Confident Pinnacle", location: "Edachira", priceFrom: 4800000, priceTo: 11000000, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=520&fit=crop&q=85" },
    { id: "k4", name: "Asset Cascades", location: "Tripunithura", priceFrom: 7200000, priceTo: 16800000, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=520&fit=crop&q=85" },
  ],
  Lucknow: [
    { id: "l1", name: "Eldeco Live by the Greens", location: "Sultanpur Road", priceFrom: 5500000, priceTo: 12500000, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=520&fit=crop&q=85" },
    { id: "l2", name: "Omaxe Waterscapes", location: "Gomti Nagar", priceFrom: 6800000, priceTo: 15800000, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=520&fit=crop&q=85" },
    { id: "l3", name: "Shalimar One World", location: "Amar Shaheed Path", priceFrom: 8200000, priceTo: 18500000, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=520&fit=crop&q=85" },
    { id: "l4", name: "Rishita Manhattan", location: "Sultanpur Road", priceFrom: 4500000, priceTo: 10200000, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=520&fit=crop&q=85" },
  ],
};

export const WEBSITE_NAV_MORE = [
  { label: "Commercial", href: "/properties" },
  { label: "CRM Login", href: "/crm/login" },
] as const;

export const SERVICE_CATEGORIES = [
  { label: "Buy Property", href: "/properties", icon: "Home", desc: "Verified homes & flats" },
  { label: "Sell Property", href: "/contact", icon: "Tag", desc: "List with zero brokerage" },
  { label: "New Projects", href: "/projects", icon: "Building2", desc: "RERA-approved launches" },
  { label: "Commercial", href: "/properties", icon: "Store", desc: "Office & retail spaces" },
  { label: "Plots & Land", href: "/properties", icon: "Map", desc: "Investment-ready plots" },
  { label: "Home Loans", href: "/contact", icon: "Landmark", desc: "Best rates & fast approval" },
  { label: "Legal Support", href: "/contact", icon: "Scale", desc: "Documentation & registration" },
  { label: "Interiors", href: "/contact", icon: "Sofa", desc: "Design & move-in ready" },
] as const;

export const TRUST_STATS = [
  { value: "0%", label: "Brokerage Fee" },
  { value: "500+", label: "Verified Projects" },
  { value: "10K+", label: "Happy Families" },
  { value: "50+", label: "Cities Covered" },
] as const;

export const HOW_IT_WORKS = [
  { step: "01", title: "Search & Shortlist", desc: "Browse verified listings, new launches and commercial spaces across India." },
  { step: "02", title: "Expert Guidance", desc: "Dedicated relationship manager helps you compare, visit and negotiate." },
  { step: "03", title: "Legal & Finance", desc: "Home loans, documentation, registration — all handled end-to-end." },
  { step: "04", title: "Move In", desc: "From booking to possession — Triyards supports you at every step." },
] as const;

export const POPULAR_CITIES = [
  { name: "Mumbai", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop" },
  { name: "Delhi NCR", image: "https://images.unsplash.com/photo-1587474260587-136574528ed5?w=400&h=300&fit=crop" },
  { name: "Bangalore", image: "https://images.unsplash.com/photo-1596176530734-9fc6d608a8a9?w=400&h=300&fit=crop" },
  { name: "Pune", image: "https://images.unsplash.com/photo-1591608978329-18894d1d0cd7?w=400&h=300&fit=crop" },
  { name: "Hyderabad", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop" },
  { name: "Chennai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop" },
] as const;

export const WHY_TRIYARDS = [
  { title: "Zero Brokerage", desc: "Save lakhs on every transaction. Transparent pricing, no hidden cuts." },
  { title: "Verified Listings", desc: "Every property is checked for authenticity before it goes live." },
  { title: "End-to-End Support", desc: "From search to registration — loans, legal, interiors, all in one place." },
  { title: "Dedicated Expert", desc: "Your personal relationship manager guides you through the entire journey." },
] as const;

export const TESTIMONIALS = [
  {
    name: "Rahul & Priya Sharma",
    role: "Homeowner",
    city: "Pune",
    text: "Triyards made our first home purchase seamless. Zero brokerage and excellent legal support throughout.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=420&fit=crop&q=85",
    avatar: "https://i.pravatar.cc/120?img=12",
  },
  {
    name: "Amit Patel",
    role: "Investor",
    city: "Ahmedabad",
    text: "Sold my apartment in 3 weeks through Triyards. Professional team, verified buyers, no middlemen.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=420&fit=crop&q=85",
    avatar: "https://i.pravatar.cc/120?img=33",
  },
  {
    name: "Neha Reddy",
    role: "Homeowner",
    city: "Hyderabad",
    text: "Home loan + property search + registration — everything handled under one roof. Highly recommend!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=420&fit=crop&q=85",
    avatar: "https://i.pravatar.cc/120?img=47",
  },
  {
    name: "Vikram Singh",
    role: "Homeowner",
    city: "Gurgaon",
    text: "The site visit coordination was flawless. We found our dream 3 BHK within two weeks.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=420&fit=crop&q=85",
    avatar: "https://i.pravatar.cc/120?img=15",
  },
] as const;

export const FAQ_ITEMS = [
  { q: "Does Triyards charge brokerage?", a: "No. Triyards operates on a zero-brokerage model. You save significantly on every buy or sell transaction." },
  { q: "What services does Triyards offer?", a: "Buy, sell, new projects, commercial, plots, home loans, legal documentation, and interior design — complete real estate solutions." },
  { q: "Are all properties verified?", a: "Yes. Every listing goes through our verification process before being published on the platform." },
  { q: "How do I get started?", a: "Search properties on our website, fill the callback form, or call us. An expert will be assigned within 24 hours." },
] as const;

export const POPULAR_SEARCHES = [
  "Flats in Pune",
  "2 BHK in Bangalore",
  "Plots in Hyderabad",
  "Luxury Villas",
  "Commercial Office Space",
] as const;

export const BRAND_PHONE = "+91 98765 43210";
export const BRAND_EMAIL = "hello@triyards.com";

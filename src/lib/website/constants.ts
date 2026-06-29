export const BRAND_NAME = "Triyards";

export const WEBSITE_NAV = [
  { label: "Home", href: "/" },
  { label: "Buy", href: "/properties" },
  { label: "Projects", href: "/projects" },
  { label: "Launches", href: "/launches" },
  { label: "Services", href: "/contact" },
  { label: "Contact", href: "/contact" },
] as const;

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
  { name: "Rahul & Priya Sharma", city: "Pune", text: "Triyards made our first home purchase seamless. Zero brokerage and excellent legal support throughout.", rating: 5 },
  { name: "Amit Patel", city: "Ahmedabad", text: "Sold my apartment in 3 weeks through Triyards. Professional team, verified buyers, no middlemen.", rating: 5 },
  { name: "Neha Reddy", city: "Hyderabad", text: "Home loan + property search + registration — everything handled under one roof. Highly recommend!", rating: 5 },
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

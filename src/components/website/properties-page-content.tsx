"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search, MapPin, Building2, Wallet, Bed, Bath, Maximize,
  Heart, LayoutGrid, List, SlidersHorizontal, X, ArrowRight, Camera,
} from "lucide-react";
import { cn, formatINR } from "@/lib/utils";
import { HERO_BUDGET_OPTIONS } from "@/lib/website/get-hero-data";
import { IconSelect, FilterSelect } from "@/components/ui/select";

export type PropertyListing = {
  id: string;
  slug: string;
  title: string;
  address: string;
  city: string;
  price: number;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  image: string | null;
  featured: boolean;
  isNewLaunch: boolean;
  photoCount: number;
  amenities: string[];
  createdAt: string;
};

const CITIES = [
  "All Cities",
  "Mumbai",
  "Pune",
  "Bangalore",
  "Hyderabad",
  "Gurgaon",
  "Noida",
  "Delhi",
  "Chennai",
];

const PROPERTY_TYPES = [
  { id: "APARTMENT", label: "Apartment" },
  { id: "VILLA", label: "Villa" },
  { id: "PENTHOUSE", label: "Penthouse" },
  { id: "HOUSE", label: "Independent House" },
  { id: "LAND", label: "Plot" },
];

const BHK_OPTIONS = [
  { label: "1 BHK", value: 1 },
  { label: "2 BHK", value: 2 },
  { label: "3 BHK", value: 3 },
  { label: "4+ BHK", value: 4 },
];

const AMENITY_OPTIONS = ["Swimming Pool", "Gym", "Parking", "Garden"];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
];

const PRICE_MIN = 2000000;
const PRICE_MAX = 100000000;

function formatPriceLabel(amount: number) {
  if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(0)} Cr+`;
  return `₹ ${(amount / 100000).toFixed(0)} Lakh`;
}

function PropertyCard({
  property,
  view,
}: {
  property: PropertyListing;
  view: "grid" | "list";
}) {
  const badge = property.featured
    ? { label: "FEATURED", className: "bg-theme-orange text-white" }
    : property.isNewLaunch
      ? { label: "NEW LAUNCH", className: "bg-emerald-600 text-white" }
      : null;

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-violet-100 hover:shadow-lg",
        view === "list" && "flex flex-col sm:flex-row"
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          view === "grid" ? "h-52 sm:h-56" : "h-52 sm:h-auto sm:w-[280px] lg:w-[320px]"
        )}
      >
        <img
          src={property.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=520&fit=crop"}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {badge && (
          <span className={cn("absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold tracking-wide", badge.className)}>
            {badge.label}
          </span>
        )}
        <button
          type="button"
          aria-label="Save property"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-400 shadow-md transition-colors hover:text-rose-500"
        >
          <Heart className="h-4 w-4" />
        </button>
        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          <Camera className="h-3 w-3" />
          {property.photoCount} Photos
        </span>
      </div>

      <div className={cn("flex flex-1 flex-col p-4 sm:p-5", view === "list" && "justify-center")}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-bold text-[#111827] sm:text-lg">{property.title}</h3>
          <p className="shrink-0 text-base font-black text-emerald-600 sm:text-lg">{formatINR(property.price)}</p>
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500 sm:text-sm">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-500" />
          <span className="line-clamp-1">
            {property.address}, {property.city}
          </span>
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2 border-y border-slate-100 py-3 text-center text-xs text-slate-600 sm:text-sm">
          <div>
            <Bed className="mx-auto mb-1 h-4 w-4 text-violet-500" />
            <span className="font-semibold text-[#111827]">{property.bedrooms || "—"}</span>
            <p className="text-[10px] text-slate-400 sm:text-xs">Bedrooms</p>
          </div>
          <div>
            <Bath className="mx-auto mb-1 h-4 w-4 text-violet-500" />
            <span className="font-semibold text-[#111827]">{property.bathrooms || "—"}</span>
            <p className="text-[10px] text-slate-400 sm:text-xs">Bathrooms</p>
          </div>
          <div>
            <Maximize className="mx-auto mb-1 h-4 w-4 text-violet-500" />
            <span className="font-semibold text-[#111827]">
              {property.sqft ? property.sqft.toLocaleString() : "—"}
            </span>
            <p className="text-[10px] text-slate-400 sm:text-xs">Sq.Ft.</p>
          </div>
        </div>

        <Link
          href={`/properties/${property.slug}`}
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
        >
          View Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

function FiltersPanel({
  city,
  setCity,
  types,
  setTypes,
  priceMax,
  setPriceMax,
  bhk,
  setBhk,
  amenities,
  setAmenities,
  onApply,
  onReset,
  className,
  cityOptions = CITIES,
}: {
  city: string;
  setCity: (v: string) => void;
  types: string[];
  setTypes: (v: string[]) => void;
  priceMax: number;
  setPriceMax: (v: number) => void;
  bhk: number | null;
  setBhk: (v: number | null) => void;
  amenities: string[];
  setAmenities: (v: string[]) => void;
  onApply?: () => void;
  onReset: () => void;
  className?: string;
  cityOptions?: string[];
}) {
  const toggleType = (id: string) => {
    setTypes(types.includes(id) ? types.filter((t) => t !== id) : [...types, id]);
  };

  const toggleAmenity = (a: string) => {
    setAmenities(amenities.includes(a) ? amenities.filter((x) => x !== a) : [...amenities, a]);
  };

  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#111827]">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Location</label>
          <FilterSelect
            value={city}
            onChange={(e) => setCity(e.target.value)}
            options={cityOptions.map((c) => ({ value: c, label: c }))}
            className="w-full min-w-0"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Property Type</label>
          <div className="space-y-2">
            {PROPERTY_TYPES.map(({ id, label }) => (
              <label key={id} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={types.includes(id)}
                  onChange={() => toggleType(id)}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Price Range</label>
          <p className="mb-2 text-xs font-semibold text-violet-600">
            Up to {formatPriceLabel(priceMax)}
          </p>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={500000}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-violet-600"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-400">
            <span>₹ 20 Lakh</span>
            <span>₹ 10 Cr+</span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Bedrooms</label>
          <div className="grid grid-cols-2 gap-2">
            {BHK_OPTIONS.map(({ label, value }) => (
              <button
                key={label}
                type="button"
                onClick={() => setBhk(bhk === value ? null : value)}
                className={cn(
                  "rounded-lg border py-2 text-xs font-bold transition-all sm:text-sm",
                  bhk === value
                    ? "border-orange-500 bg-theme-orange text-white shadow-theme-orange"
                    : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-700"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Amenities</label>
          <div className="space-y-2">
            {AMENITY_OPTIONS.map((a) => (
              <label key={a} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={amenities.includes(a)}
                  onChange={() => toggleAmenity(a)}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                {a}
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onApply}
        className="mt-5 w-full rounded-lg bg-theme-purple py-3 text-sm font-bold text-white shadow-theme-purple transition-opacity hover:opacity-95"
      >
        Apply Filters
      </button>
    </div>
  );
}

type PropertiesPageContentProps = {
  properties: PropertyListing[];
  cities?: string[];
  initialFilters?: {
    search?: string;
    type?: string;
    status?: string;
    budget?: string;
  };
};

function budgetToPrices(budget?: string) {
  const opt = HERO_BUDGET_OPTIONS.find((b) => b.value === budget);
  if (!opt) return { minPrice: null as number | null, maxPrice: PRICE_MAX };
  return {
    minPrice: opt.minPrice,
    maxPrice: opt.maxPrice ?? PRICE_MAX,
  };
}

export function PropertiesPageContent({ properties, cities = [], initialFilters = {} }: PropertiesPageContentProps) {
  const cityOptions = ["All Cities", ...(cities.length > 0 ? cities : CITIES.slice(1))];
  const initialCity = initialFilters.search || "All Cities";
  const initialTypes = initialFilters.type ? [initialFilters.type] : [];
  const { minPrice: initMin, maxPrice: initMax } = budgetToPrices(initialFilters.budget);

  const [heroCity, setHeroCity] = useState(initialCity === "All Cities" ? "All Cities" : initialCity);
  const [heroType, setHeroType] = useState(initialFilters.type || "Any Type");
  const [heroPrice, setHeroPrice] = useState(initialFilters.budget ?? "");

  const [city, setCity] = useState(initialCity);
  const [types, setTypes] = useState<string[]>(initialTypes);
  const [priceMax, setPriceMax] = useState(initMax);
  const [priceMin, setPriceMin] = useState(initMin ?? 0);
  const [statusFilter, setStatusFilter] = useState(initialFilters.status || "");
  const [bhk, setBhk] = useState<number | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [applied, setApplied] = useState({
    city: initialCity,
    types: initialTypes,
    priceMin: initMin ?? 0,
    priceMax: initMax,
    status: initialFilters.status || "",
    bhk: null as number | null,
    amenities: [] as string[],
  });

  const resetFilters = () => {
    setCity("All Cities");
    setTypes([]);
    setPriceMax(PRICE_MAX);
    setPriceMin(0);
    setStatusFilter("");
    setBhk(null);
    setAmenities([]);
    setApplied({ city: "All Cities", types: [], priceMin: 0, priceMax: PRICE_MAX, status: "", bhk: null, amenities: [] });
  };

  const applyFilters = () => {
    setApplied({ city, types, priceMin, priceMax, status: statusFilter, bhk, amenities });
    setFiltersOpen(false);
  };

  const runHeroSearch = () => {
    setCity(heroCity);
    const budgetOpt = HERO_BUDGET_OPTIONS.find((b) => b.value === heroPrice);
    const maxP = budgetOpt?.maxPrice ?? PRICE_MAX;
    const minP = budgetOpt?.minPrice ?? 0;
    setPriceMax(maxP);
    setPriceMin(minP);
    setApplied({
      city: heroCity,
      types: heroType === "Any Type" ? [] : [heroType],
      priceMin: minP,
      priceMax: maxP,
      status: statusFilter,
      bhk,
      amenities,
    });
    if (heroType !== "Any Type") setTypes([heroType]);
  };

  const filtered = useMemo(() => {
    let list = [...properties];

    if (applied.city !== "All Cities") {
      list = list.filter((p) => p.city.toLowerCase().includes(applied.city.toLowerCase()));
    }
    if (applied.types.length > 0) {
      list = list.filter((p) => applied.types.includes(p.type));
    }
    if (applied.status) {
      list = list.filter((p) => p.status === applied.status);
    }
    list = list.filter((p) => p.price >= applied.priceMin && p.price <= applied.priceMax);
    if (applied.bhk !== null) {
      list = list.filter((p) => (applied.bhk === 4 ? p.bedrooms >= 4 : p.bedrooms === applied.bhk));
    }
    if (applied.amenities.length > 0) {
      list = list.filter(
        (p) => p.amenities.length === 0 || applied.amenities.every((a) => p.amenities.includes(a))
      );
    }

    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list;
  }, [properties, applied, sort]);

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Hero + search */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=600&fit=crop&q=85)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-orange-300 drop-shadow-md">
            Explore The Best
          </p>
          <h1 className="mt-2 text-center font-heading text-2xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-3xl lg:text-[2rem]">
            Find Your{" "}
            <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-violet-300 bg-clip-text text-transparent">
              Perfect Property
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm font-medium tracking-wide text-white/90 drop-shadow-md sm:text-base">
            Explore {properties.length}+ premium properties across top locations — zero brokerage
          </p>

          <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-white/20 bg-white/95 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <IconSelect
                icon={<MapPin className="h-4 w-4 shrink-0 text-violet-500" strokeWidth={1.75} />}
                value={heroCity}
                onChange={(e) => setHeroCity(e.target.value)}
                shellClassName="sm:col-span-1"
              >
                {cityOptions.map((c) => (
                  <option key={c} value={c}>{c === "All Cities" ? "Select City" : c}</option>
                ))}
              </IconSelect>
              <IconSelect
                icon={<Building2 className="h-4 w-4 shrink-0 text-violet-500" strokeWidth={1.75} />}
                value={heroType}
                onChange={(e) => setHeroType(e.target.value)}
              >
                <option value="Any Type">Any Type</option>
                {PROPERTY_TYPES.map(({ id, label }) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </IconSelect>
              <IconSelect
                icon={<Wallet className="h-4 w-4 shrink-0 text-violet-500" strokeWidth={1.75} />}
                value={heroPrice}
                onChange={(e) => setHeroPrice(e.target.value)}
              >
                {HERO_BUDGET_OPTIONS.map((opt) => (
                  <option key={opt.value || "any"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </IconSelect>
              <button
                type="button"
                onClick={runHeroSearch}
                className="flex items-center justify-center gap-2 rounded-xl bg-theme-orange py-3 text-sm font-bold text-white shadow-theme-orange transition-opacity hover:opacity-95 sm:col-span-2 lg:col-span-1"
              >
                <Search className="h-4 w-4" />
                Search Properties
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-full shrink-0 lg:block lg:w-[280px] xl:w-[300px]">
            <div className="sticky top-20">
              <FiltersPanel
                city={city}
                setCity={setCity}
                types={types}
                setTypes={setTypes}
                priceMax={priceMax}
                setPriceMax={setPriceMax}
                bhk={bhk}
                setBhk={setBhk}
                amenities={amenities}
                setAmenities={setAmenities}
                onApply={applyFilters}
                onReset={resetFilters}
                cityOptions={cityOptions}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 text-violet-600" />
                  Filters
                </button>
                <p className="text-sm font-bold text-[#111827] sm:text-base">
                  <span className="text-violet-600">{filtered.length}+</span> Properties Found
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <FilterSelect
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  options={SORT_OPTIONS.map((o) => ({ value: o.id, label: `Sort by: ${o.label}` }))}
                  className="min-w-[168px] py-2 text-xs sm:text-sm"
                />
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={cn(
                      "rounded-md p-2 transition-colors",
                      view === "grid" ? "bg-violet-100 text-violet-700" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={cn(
                      "rounded-md p-2 transition-colors",
                      view === "list" ? "bg-violet-100 text-violet-700" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid / list */}
            {filtered.length > 0 ? (
              <div
                className={cn(
                  view === "grid"
                    ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-4"
                )}
              >
                {filtered.map((property) => (
                  <PropertyCard key={property.id} property={property} view={view} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
                <p className="text-lg font-bold text-slate-700">No properties match your filters</p>
                <p className="mt-2 text-sm text-slate-500">Try adjusting filters or search a different city</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-lg bg-theme-orange px-5 py-2.5 text-sm font-bold text-white"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#111827]">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FiltersPanel
              city={city}
              setCity={setCity}
              types={types}
              setTypes={setTypes}
              priceMax={priceMax}
              setPriceMax={setPriceMax}
              bhk={bhk}
              setBhk={setBhk}
              amenities={amenities}
              setAmenities={setAmenities}
              onApply={applyFilters}
              onReset={resetFilters}
              cityOptions={cityOptions}
              className="border-0 p-0 shadow-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

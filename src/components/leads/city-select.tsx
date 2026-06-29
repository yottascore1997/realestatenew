"use client";

import { INDIAN_CITIES_BY_STATE } from "@/lib/leads/indian-cities";
import { cn } from "@/lib/utils";

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  id?: string;
}

export function CitySelect({
  value,
  onChange,
  className,
  placeholder = "All Cities",
  id,
}: CitySelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-11 max-w-[220px] cursor-pointer rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 outline-none transition-colors focus:border-violet-400",
        className
      )}
    >
      <option value="">{placeholder}</option>
      {Object.entries(INDIAN_CITIES_BY_STATE).map(([state, cities]) => (
        <optgroup key={state} label={state}>
          {cities.map((city) => (
            <option key={`${state}-${city}`} value={city}>
              {city}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

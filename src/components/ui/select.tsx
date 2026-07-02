import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const selectBase =
  "w-full cursor-pointer appearance-none font-medium text-slate-800 outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

export const selectStyles = {
  default: cn(
    selectBase,
    "h-11 rounded-xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 px-4 pr-10 text-sm shadow-sm",
    "hover:border-violet-300 hover:shadow-[0_4px_14px_rgba(79,70,229,0.08)] hover:from-white hover:to-violet-50/40",
    "focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-200"
  ),
  filter: cn(
    selectBase,
    "h-11 min-w-[148px] rounded-xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 px-3.5 pr-9 text-sm shadow-sm",
    "hover:border-violet-300 hover:shadow-[0_4px_14px_rgba(79,70,229,0.08)]",
    "focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-200"
  ),
  inline: cn(
    selectBase,
    "min-h-[44px] bg-transparent py-2.5 pl-0 pr-6 text-sm text-slate-700"
  ),
  website: cn(
    selectBase,
    "h-full min-h-[44px] rounded-xl border-0 bg-transparent py-2.5 pl-9 pr-8 text-sm text-slate-700"
  ),
} as const;

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  variant?: keyof typeof selectStyles;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  variant = "default",
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(selectStyles[variant], error && "border-red-400 focus:border-red-500 focus:ring-red-500/15", className)}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          strokeWidth={2}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface FilterSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

/** Compact toolbar select — CRM filters, list pages */
export function FilterSelect({ options, placeholder, className, ...props }: FilterSelectProps) {
  return (
    <div className="relative">
      <select className={cn(selectStyles.filter, className)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        strokeWidth={2}
      />
    </div>
  );
}

interface IconSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  shellClassName?: string;
}

/** Icon + select combo — hero search, properties page */
export function IconSelect({ icon, children, shellClassName, className, ...props }: IconSelectProps) {
  return (
    <div
      className={cn(
        "premium-select-shell group",
        shellClassName
      )}
    >
      {icon}
      <select className={cn(selectStyles.inline, "min-w-0 flex-1", className)} {...props}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-violet-500"
        strokeWidth={2}
      />
    </div>
  );
}

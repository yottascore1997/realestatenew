export const EMPLOYEE_DEPARTMENTS = [
  "Sales", "Marketing", "Finance", "Operations", "HR", "Admin", "Legal",
] as const;

export const EMPLOYEE_ROLES = [
  { value: "AGENT", label: "Sales Executive" },
  { value: "MANAGER", label: "Team Manager" },
  { value: "ADMIN", label: "Admin" },
] as const;

export const ROLE_LABELS: Record<string, string> = Object.fromEntries(
  EMPLOYEE_ROLES.map((r) => [r.value, r.label])
);

export function generateEmployeeCode(count: number) {
  return `EMP-${String(count + 1).padStart(3, "0")}`;
}

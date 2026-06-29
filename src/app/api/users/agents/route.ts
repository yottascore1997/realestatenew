import { NextRequest } from "next/server";
import { listEmployees, createEmployee } from "@/lib/users/employees-api";

/** Backward-compatible — delegates to employees handlers */
export async function GET() {
  return listEmployees();
}

export async function POST(request: NextRequest) {
  return createEmployee(request);
}

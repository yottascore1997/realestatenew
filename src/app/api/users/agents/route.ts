import { NextRequest, NextResponse } from "next/server";

/** Backward-compatible — delegates to employees handlers */
import { GET as employeesGet, POST as employeesPost } from "../employees/route";

export async function GET() {
  return employeesGet();
}

export async function POST(request: NextRequest) {
  return employeesPost(request);
}

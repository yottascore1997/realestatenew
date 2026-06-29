import { NextRequest } from "next/server";
import { PATCH as employeePatch, DELETE as employeeDelete } from "../../employees/[id]/route";

export async function PATCH(request: NextRequest, ctx: { params: { id: string } }) {
  return employeePatch(request, ctx);
}

export async function DELETE(request: NextRequest, ctx: { params: { id: string } }) {
  return employeeDelete(request, ctx);
}

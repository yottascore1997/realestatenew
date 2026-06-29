import { NextRequest } from "next/server";
import { updateEmployee, deleteEmployee } from "@/lib/users/employees-api";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return updateEmployee(request, params.id);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  return deleteEmployee(params.id);
}

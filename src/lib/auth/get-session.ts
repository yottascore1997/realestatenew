import { cookies } from "next/headers";
import { verifySessionToken, type SessionUser } from "./session";

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("crm_session")?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

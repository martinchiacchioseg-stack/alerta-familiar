import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
import { verifyJwtToken, SessionPayload } from "./jwt";
import prisma from "./prisma";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_session")?.value;
    if (!token) return null;
    return verifyJwtToken(token);
  } catch (err) {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): SessionPayload | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const session = verifyJwtToken(token);
    if (session) return session;
  }

  const cookieToken = req.cookies.get("auth_session")?.value;
  if (cookieToken) {
    return verifyJwtToken(cookieToken);
  }

  return null;
}

export async function requireAuth(req: NextRequest, allowedRoles?: ("SUPERADMIN" | "ADMIN_ECOSISTEMA" | "MIEMBRO")[]): Promise<{ session: SessionPayload } | { error: string; status: number }> {
  const session = getSessionFromRequest(req);
  if (!session) {
    return { error: "No autenticado. Inicie sesión para continuar.", status: 401 };
  }

  if (allowedRoles && !allowedRoles.includes(session.rol)) {
    return { error: "Acceso no autorizado para su nivel de permisos.", status: 403 };
  }

  return { session };
}

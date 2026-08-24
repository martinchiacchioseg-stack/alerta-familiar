import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "alarmas-chascomus-secret-key-2026";

export interface SessionPayload {
  userId: string;
  nombre: string;
  email?: string | null;
  rol: "SUPERADMIN" | "ADMIN_ECOSISTEMA" | "MIEMBRO";
  ecosistemaId?: string | null;
  ecosistemaNombre?: string | null;
}

export function signJwtToken(payload: SessionPayload, expiresIn: string | number = "7d"): string {
  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwtToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch (error) {
    return null;
  }
}

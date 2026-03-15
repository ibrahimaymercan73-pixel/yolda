import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "yolda_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "yolda-dev-secret-change-in-production"
);

export type SessionPayload = { userId: string };

export async function createSession(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;
    return userId ? { userId } : null;
  } catch {
    return null;
  }
}

export function getSessionCookie(): string {
  return COOKIE_NAME;
}

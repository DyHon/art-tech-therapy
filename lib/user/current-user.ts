import { prisma } from "../prisma";

/**
 * Resolves the current user's id. Until an auth system exists, the app operates as a
 * single-seeker MVP (mirroring the ingest route), so this returns the first user — or
 * `null` if none exists yet. Read paths never create a user.
 */
export async function resolveCurrentUserId(): Promise<string | null> {
  const user = await prisma.user.findFirst({ select: { id: true } });
  return user?.id ?? null;
}

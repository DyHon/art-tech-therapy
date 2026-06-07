import { NextRequest, NextResponse } from "next/server";
import { RelatedParamsSchema, RelatedQuerySchema } from "@/lib/validations/dashboard";
import { findRelatedEntries } from "@/lib/vector/red-thread";

/**
 * GET /api/journal/[id]/related — the "Red Thread": entries most semantically similar to
 * the given entry (same user, excluding itself).
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const params = RelatedParamsSchema.safeParse({ id });
  if (!params.success) {
    return NextResponse.json({ error: params.error.format() }, { status: 400 });
  }

  const query = RelatedQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  if (!query.success) {
    return NextResponse.json({ error: query.error.format() }, { status: 400 });
  }

  try {
    const related = await findRelatedEntries(params.data.id, query.data.k);
    return NextResponse.json({ related });
  } catch (error) {
    console.error("[RELATED_ERROR]", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to load related entries" }, { status: 500 });
  }
}

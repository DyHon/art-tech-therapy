import { NextRequest, NextResponse } from "next/server";
import { DashboardQuerySchema } from "@/lib/validations/dashboard";
import { resolveCurrentUserId } from "@/lib/user/current-user";
import { getSnapshotSeries, getArchetypeSummary } from "@/lib/dashboard/queries";

/**
 * GET /api/dashboard — data for the Constellation dashboard: the psychological snapshot
 * time-series and the archetype summary for the current user.
 */
export async function GET(req: NextRequest) {
  const query = DashboardQuerySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  if (!query.success) {
    return NextResponse.json({ error: query.error.format() }, { status: 400 });
  }

  try {
    const userId = await resolveCurrentUserId();
    if (!userId) {
      return NextResponse.json({ snapshots: [], archetypes: [] });
    }

    const [snapshots, archetypes] = await Promise.all([
      getSnapshotSeries(userId, query.data.limit),
      getArchetypeSummary(userId),
    ]);

    return NextResponse.json({ snapshots, archetypes });
  } catch (error) {
    console.error("[DASHBOARD_ERROR]", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}

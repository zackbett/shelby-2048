import { loadLeaderboard } from "@/lib/leaderboard"
import { NextResponse } from "next/server"

export async function GET() {
  const leaderboard = await loadLeaderboard()

  return NextResponse.json(leaderboard)
}
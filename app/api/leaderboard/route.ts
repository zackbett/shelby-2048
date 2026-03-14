import { getLeaderboard } from "@/lib/leaderboard"
import { NextResponse } from "next/server"

export async function GET() {
  const leaderboard = await getLeaderboard()

  return NextResponse.json(leaderboard)
}
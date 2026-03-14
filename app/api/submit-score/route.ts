import { saveScore } from "@/lib/leaderboard"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  const { username, score, type } = body

  if (!username || !score) {
    return NextResponse.json(
      { error: "invalid payload" },
      { status: 400 }
    )
  }

  const leaderboard = await saveScore(
    username,
    score,
    type || "human"
  )

  return NextResponse.json({
    success: true,
    leaderboard
  })
}
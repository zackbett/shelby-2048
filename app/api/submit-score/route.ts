import { NextResponse } from "next/server"
import { saveScore } from "@/lib/leaderboard"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const username = body.username
    const score = body.score
    const type = body.type || "human"

    if (!username || score === undefined) {
      return NextResponse.json(
        { error: "invalid payload" },
        { status: 400 }
      )
    }

    const leaderboard = await saveScore(
      username,
      score,
      type
    )

    return NextResponse.json({
      success: true,
      leaderboard
    })

  } catch (error) {
    console.error("submit-score error:", error)

    return NextResponse.json(
      { error: "server error" },
      { status: 500 }
    )
  }
}
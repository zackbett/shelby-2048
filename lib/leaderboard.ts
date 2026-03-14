import fs from "fs/promises"
import path from "path"

export type ScoreEntry = {
  username: string
  score: number
  type: "human" | "ai"
  date: number
}

const filePath = path.join(process.cwd(), "data", "leaderboard.json")

export async function loadLeaderboard(): Promise<ScoreEntry[]> {
  try {
    const file = await fs.readFile(filePath, "utf-8")
    const data = JSON.parse(file)

    return data.scores.sort((a: ScoreEntry, b: ScoreEntry) => b.score - a.score)
  } catch {
    return []
  }
}

export async function saveScore(username: string, score: number, type: "human" | "ai" = "human") {
  const file = await fs.readFile(filePath, "utf-8")
  const data = JSON.parse(file)

  const entry: ScoreEntry = {
    username,
    score,
    type,
    date: Date.now()
  }

  data.scores.push(entry)

  const sorted = data.scores
    .sort((a: ScoreEntry, b: ScoreEntry) => b.score - a.score)
    .slice(0, 20)

  await fs.writeFile(
    filePath,
    JSON.stringify({ scores: sorted }, null, 2)
  )

  return sorted
}
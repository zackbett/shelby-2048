export type ScoreEntry = {
  username: string
  score: number
  date: number
}

const STORAGE_KEY = "shelby2048_leaderboard"

export function loadLeaderboard(): ScoreEntry[] {

  if (typeof window === "undefined") return []

  const data = localStorage.getItem(STORAGE_KEY)

  if (!data) return []

  return JSON.parse(data)
}

export function saveScore(username: string, score: number) {

  const leaderboard = loadLeaderboard()

  const entry: ScoreEntry = {
    username,
    score,
    date: Date.now()
  }

  leaderboard.push(entry)

  leaderboard.sort((a, b) => b.score - a.score)

  const top10 = leaderboard.slice(0, 10)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(top10))

  return top10
}
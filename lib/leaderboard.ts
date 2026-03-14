type Entry = {
  username: string
  score: number
  type: string
  date: number
}

let leaderboard: Entry[] = []

export async function saveScore(
  username: string,
  score: number,
  type: string
) {
  leaderboard.push({
    username,
    score,
    type,
    date: Date.now()
  })

  leaderboard.sort((a, b) => b.score - a.score)

  return leaderboard.slice(0, 10)
}

export async function getLeaderboard() {
  return leaderboard
}
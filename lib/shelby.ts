const RPC_URL = "https://rpc.shelbynet.xyz"

export async function saveScore(username: string, score: number) {

  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "storeBlob",
    params: {
      data: JSON.stringify({
        username,
        score,
        time: Date.now()
      })
    }
  }

  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })

  const data = await res.json()

  console.log("Shelbynet response:", data)

  return data
}
export async function getLeaderboard() {

  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "listBlobs",
    params: {}
  }

  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })

  const data = await res.json()

  console.log("leaderboard raw:", data)

  return data
}
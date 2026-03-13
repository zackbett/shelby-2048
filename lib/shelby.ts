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

  await fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
}
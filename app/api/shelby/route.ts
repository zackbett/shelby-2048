export async function POST(req: Request) {

  const body = await req.json()

  const res = await fetch("https://api.shelby.xyz/v1/rpc", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
})
  const data = await res.json()

  return Response.json(data)
}
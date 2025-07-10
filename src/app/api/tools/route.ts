import { NextResponse } from "next/server"

const BASE = process.env.NEXT_PUBLIC_SHEETS_API_BASE!

export async function GET(request: Request) {
  const url = new URL(request.url)
  const action = url.searchParams.get("action")
  const target = action === "list" ? `${BASE}?action=list` : BASE
  const resp = await fetch(target)
  const data = await resp.text()
  try {
    return NextResponse.json(JSON.parse(data), { status: resp.status })
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from upstream" },
      { status: 502 }
    )
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const resp = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await resp.text()
  try {
    return NextResponse.json(JSON.parse(data), { status: resp.status })
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from upstream" },
      { status: 502 }
    )
  }
}

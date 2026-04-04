import { NextResponse } from 'next/server'

export async function GET() {
  const backendBase = process.env.BACKEND_URL
  if (!backendBase) {
    return NextResponse.json({ status: 'no backend configured' })
  }

  try {
    const res = await fetch(`${backendBase}/health`, { method: 'GET' })
    const data = await res.json()
    return NextResponse.json({ status: 'ok', backend: data })
  } catch {
    return NextResponse.json({ status: 'backend unreachable' }, { status: 503 })
  }
}

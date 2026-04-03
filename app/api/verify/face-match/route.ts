import { NextRequest, NextResponse } from 'next/server'

interface FaceMatchRequest {
  idImage: string
  selfieImage: string
}

/**
 * POST /api/verify/face-match
 * Proxies face match to the Python backend (FastAPI) for real inference.
 */
export async function POST(request: NextRequest) {
  try {
    const body: FaceMatchRequest = await request.json()

    if (!body.idImage || !body.selfieImage) {
      return NextResponse.json(
        { error: 'Missing ID image or selfie image' },
        { status: 400 }
      )
    }

    const backendBase = process.env.BACKEND_URL

    if (backendBase) {
      const apiKey = process.env.API_KEY || ''
      const response = await fetch(`${backendBase}/verify/face-match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          idImage: body.idImage,
          selfieImage: body.selfieImage,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Backend face match error:', response.status, errorText)
        return NextResponse.json(
          { error: 'Face match service failed', detail: errorText || undefined },
          { status: 502 }
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    }

    // No backend configured — return mock result for demo
    const confidence = 75 + Math.random() * 20
    return NextResponse.json({
      success: true,
      isMatch: confidence >= 60,
      confidence: parseFloat(confidence.toFixed(1)),
      similarity: parseFloat((confidence / 100).toFixed(4)),
    })
  } catch (error) {
    console.error('Face match error:', error)
    return NextResponse.json(
      { error: 'Failed to match faces', detail: `${error}` },
      { status: 500 }
    )
  }
}

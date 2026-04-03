import { NextRequest, NextResponse } from 'next/server'

interface DocumentExtractionRequest {
  imageBase64: string
  side: 'front' | 'back'
}

/**
 * POST /api/verify/extract-document
 * Proxies document extraction to the Python backend.
 */
export async function POST(request: NextRequest) {
  try {
    const body: DocumentExtractionRequest = await request.json()

    if (!body.imageBase64) {
      return NextResponse.json(
        { error: 'Missing image data' },
        { status: 400 }
      )
    }

    const backendBase = process.env.BACKEND_URL

    if (backendBase) {
      const apiKey = process.env.API_KEY || ''
      const response = await fetch(`${backendBase}/verify/extract-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          image_base64: body.imageBase64,
          side: body.side || 'front',
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Backend extract error:', response.status, errorText)
        return NextResponse.json(
          { error: 'Document extraction failed', detail: errorText || undefined },
          { status: 502 }
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    }

    // No backend configured — return mock data for demo
    return NextResponse.json({
      name: 'Demo User',
      idNumber: 'MN' + Math.floor(10000000 + Math.random() * 90000000),
      dateOfBirth: '1990-01-01',
      expiry: '2030-12-31',
      issuedCountry: 'Mongolia',
      documentType: body.side === 'back' ? 'ID Back' : 'National ID',
      confidence: 94.5 + Math.random() * 5,
    })
  } catch (error) {
    console.error('Document extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract document data', detail: `${error}` },
      { status: 500 }
    )
  }
}

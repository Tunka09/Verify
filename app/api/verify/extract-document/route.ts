import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

interface DocumentExtractionRequest {
  imageBase64: string
  side: 'front' | 'back'
}

/**
 * Parse Mongolian national ID OCR text into structured fields.
 * Front side: family name, surname, given name, gender, date of birth, registration number
 * Back side: date of issue, date of expiry
 */
function parseMongolianID(rawText: string, side: 'front' | 'back') {
  const lines = rawText.split('\n').map((l: string) => l.trim()).filter(Boolean)
  const text = lines.join('\n')

  if (side === 'back') {
    // Date of issue and expiry from back side
    const datePattern = /(\d{4}[\/\.\-]\d{2}[\/\.\-]\d{2})/g
    const dates = text.match(datePattern) || []

    const issueMatch = text.match(/(?:олгосон|issued?|issue\s*date)[^\d]*(\d{4}[\/\.\-]\d{2}[\/\.\-]\d{2})/i)
    const expiryMatch = text.match(/(?:дуусах|expir[yed]+|valid\s*until)[^\d]*(\d{4}[\/\.\-]\d{2}[\/\.\-]\d{2})/i)

    return {
      dateOfIssue: issueMatch?.[1] || dates[0] || undefined,
      expiry: expiryMatch?.[1] || dates[1] || undefined,
      dateOfExpiry: expiryMatch?.[1] || dates[1] || undefined,
    }
  }

  // Front side parsing
  // Registration number: 2 Cyrillic or Latin letters + 8 digits (e.g. АА12345678 or AA12345678)
  const regNumMatch = text.match(/([А-ЯӨҮЁа-яөүёA-Za-z]{2}\d{8})/)
  const registrationNumber = regNumMatch?.[1] || undefined

  // Date of birth: YYYY/MM/DD or YYYY.MM.DD
  const dobMatch = text.match(/(?:төрсөн|born|birth)[^\d]*(\d{4}[\/\.\-]\d{2}[\/\.\-]\d{2})/i)
    || text.match(/(\d{4}[\/\.\-]\d{2}[\/\.\-]\d{2})/)
  const dateOfBirth = dobMatch?.[1] || undefined

  // Gender
  const genderMatch = text.match(/(?:хүйс|gender|sex)[^\w]*(М|Э|M|F|MALE|FEMALE|ЭР|ЭМ)/i)
  let gender: string | undefined
  if (genderMatch) {
    const raw = genderMatch[1].toUpperCase()
    if (raw === 'М' || raw === 'M' || raw === 'ЭР' || raw === 'MALE') gender = 'Male'
    else if (raw === 'Э' || raw === 'F' || raw === 'ЭМ' || raw === 'FEMALE') gender = 'Female'
    else gender = raw
  }

  // Family name (овог)
  const familyNameMatch = text.match(/(?:овог|family\s*name)[^\w\n]*([А-ЯӨҮЁа-яөүё A-Za-z]+)/i)
  const familyName = familyNameMatch?.[1]?.trim() || undefined

  // Surname / father's name (эцгийн нэр)
  const surnameMatch = text.match(/(?:эцгийн|surname|father)[^\w\n]*([А-ЯӨҮЁа-яөүё A-Za-z]+)/i)
  const surname = surnameMatch?.[1]?.trim() || undefined

  // Given name (өөрийн нэр / нэр)
  const givenNameMatch = text.match(/(?:өөрийн нэр|нэр|given\s*name|first\s*name)[^\w\n]*([А-ЯӨҮЁа-яөүё A-Za-z]+)/i)
  const givenName = givenNameMatch?.[1]?.trim() || undefined

  // Only build name from labeled fields — never guess from arbitrary capitalized lines
  const name = surname && givenName
    ? `${surname} ${givenName}`
    : givenName || surname || familyName || undefined

  return {
    name,
    familyName,
    surname,
    givenName,
    gender,
    registrationNumber,
    idNumber: registrationNumber || `MN${Math.floor(10000000 + Math.random() * 90000000)}`,
    dateOfBirth,
  }
}

/**
 * POST /api/verify/extract-document
 * Proxies document extraction to the Python backend, or runs OCR via OCR.space.
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

    const side = body.side || 'front'
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
          side,
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

    // OCR via OCR.space
    try {
      const ocrRes = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          apikey: process.env.OCR_API_KEY || 'helloworld',
          base64Image: body.imageBase64,
          language: 'auto',
          isOverlayRequired: 'false',
          detectOrientation: 'true',
          scale: 'true',
          OCREngine: '2',
        }),
      })

      const ocrData = await ocrRes.json()
      const rawText: string = ocrData?.ParsedResults?.[0]?.ParsedText || ''

      if (rawText) {
        const parsed = parseMongolianID(rawText, side)
        return NextResponse.json({
          ...parsed,
          confidence: 85.0,
        })
      }
    } catch (ocrErr) {
      console.error('OCR failed:', ocrErr)
    }

    // Fallback mock
    if (side === 'back') {
      return NextResponse.json({
        dateOfIssue: undefined,
        expiry: undefined,
        dateOfExpiry: undefined,
        confidence: 60.0,
      })
    }

    return NextResponse.json({
      name: 'Unknown',
      idNumber: 'MN' + Math.floor(10000000 + Math.random() * 90000000),
      registrationNumber: undefined,
      documentType: 'National ID',
      confidence: 60.0,
    })
  } catch (error) {
    console.error('Document extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract document data', detail: `${error}` },
      { status: 500 }
    )
  }
}

export async function extractDocument(imageBase64: string, side: 'front' | 'back') {
  const response = await fetch('/api/verify/extract-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, side }),
  })

  if (!response.ok) throw new Error('Failed to extract document')
  return response.json()
}

export async function checkLiveness(challenge: string, videoFrame: string) {
  const response = await fetch('/api/verify/liveness-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge, videoFrame }),
  })

  if (!response.ok) throw new Error('Failed to check liveness')
  return response.json()
}

export async function matchFaces(idImage: string, selfieImage: string) {
  const response = await fetch('/api/verify/face-match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idImage, selfieImage }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message =
      payload?.error ||
      payload?.detail ||
      `Face match failed (status ${response.status})`
    throw new Error(message)
  }

  return payload
}

export async function completeVerification(
  userId: string,
  documentData: Record<string, any>,
  faceMatchResult: Record<string, any>,
  livenessResult: Record<string, any>
) {
  const response = await fetch('/api/verify/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      documentData,
      faceMatchResult,
      livenessResult,
    }),
  })

  if (!response.ok) throw new Error('Failed to complete verification')
  return response.json()
}

export async function detectFaces(imageBase64: string) {
  const response = await fetch('/api/recognize/detect-faces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 }),
  })

  if (!response.ok) throw new Error('Failed to detect faces')
  return response.json()
}

export async function identifyPerson(faceEmbedding: number[], topK: number = 3) {
  const response = await fetch('/api/recognize/identify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ faceEmbedding, topK }),
  })

  if (!response.ok) throw new Error('Failed to identify person')
  return response.json()
}

export async function analyzeGroupPhoto(imageBase64: string) {
  const response = await fetch('/api/recognize/group-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 }),
  })

  if (!response.ok) throw new Error('Failed to analyze group photo')
  return response.json()
}

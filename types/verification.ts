export interface DocumentData {
  name: string
  dateOfBirth: string
  documentNumber: string
  expiry: string
  issuedCountry: string
  documentType: string
  mrz: string
  authenticity: number
}

export interface LivenessCheckResult {
  isLive: boolean
  confidence: number
  challenges: {
    blink: boolean
    headTurn: boolean
    smile: boolean
  }
}

export interface FaceMatchResult {
  match: boolean
  confidence: number
  spoofScore: number
  ageEstimate: number
  faceQuality: number
}

export interface VerificationResult {
  verificationId: string
  verified: boolean
  timestamp: string
  expiresAt: string
}

export interface RecognizedPerson {
  id: string
  name: string
  role: string
  confidence: number
  bio: string
  links: {
    wikipedia?: string
    imdb?: string
    twitter?: string
    instagram?: string
  }
}

export interface GroupAnalysisResult {
  totalFaces: number
  identifiedCount: number
  unknownCount: number
  processingTime: number
  people: Array<{
    id: string
    name: string
    confidence: number
    position: { x: number; y: number; width: number; height: number }
  }>
}

// Shared verification flow types
export interface ExtractedDocumentData {
  name?: string
  familyName?: string
  surname?: string
  givenName?: string
  gender?: string
  idNumber?: string
  documentNumber?: string
  registrationNumber?: string
  dateOfBirth?: string
  dateOfIssue?: string
  expiry?: string
  issuedCountry?: string
  documentType?: string
  authenticity?: number
  confidence?: number
  backData?: Record<string, unknown>
}

export interface LivenessResult {
  isLive: boolean
  confidence?: number
  challenges?: Record<string, boolean>
  simulated?: boolean
}

export interface FaceMatchVerifyResult {
  success?: boolean
  isMatch?: boolean
  match?: boolean
  confidence?: number
  similarity?: number
  match_percentage?: number
  id_face_quality?: number
  selfie_quality?: number
}

export interface VerificationRecord {
  verified: boolean
  confidence: number
  userName?: string
  documentNumber?: string
  matchSimilarity?: number
  livenessConfidence?: number
  documentConfidence?: number
  elapsedTime?: string
}

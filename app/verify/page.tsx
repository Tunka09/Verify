'use client'

import { useEffect, useState } from 'react'
import IDVerificationFlow from '@/components/verification/id-verification-flow'
import LivenessDetection from '@/components/verification/liveness-detection'
import FaceMatch from '@/components/verification/face-match'
import VerificationSuccess from '@/components/verification/verification-success'

// Match the exact interfaces from the components
interface ExtractedDocumentData {
  name?: string
  idNumber?: string
  documentNumber?: string
  dateOfBirth?: string
  expiry?: string
  issuedCountry?: string
  documentType?: string
  authenticity?: number
  confidence?: number
  backData?: Record<string, unknown>
}

interface LivenessResult {
  isLive: boolean
  confidence?: number
  challenges?: Record<string, boolean>
}

interface FaceMatchResult {
  success?: boolean
  isMatch?: boolean
  match?: boolean
  confidence?: number
  similarity?: number
  match_percentage?: number
  id_face_quality?: number
  selfie_quality?: number
}

export default function VerifyPage() {
  const [step, setStep] = useState(0)
  const [uploadedID, setUploadedID] = useState<{ front?: string; back?: string }>({})
  const [selfie, setSelfie] = useState<string | null>(null)
  const [documentData, setDocumentData] = useState<ExtractedDocumentData | null>(null)
  const [livenessData, setLivenessData] = useState<LivenessResult | null>(null)
  const [faceMatchData, setFaceMatchData] = useState<FaceMatchResult | null>(null)
  const [verificationRecord, setVerificationRecord] = useState<{
    verified: boolean
    confidence: number
    userName?: string
    documentNumber?: string
    matchSimilarity?: number
    livenessConfidence?: number
  } | null>(null)
  const [completionError, setCompletionError] = useState<string | null>(null)
  const [completing, setCompleting] = useState(false)

  const handleIDUpload = (front?: string, back?: string) => {
    if (front) setUploadedID((prev) => ({ ...prev, front }))
    if (back) setUploadedID((prev) => ({ ...prev, back }))
  }

  const handleIDComplete = (data: ExtractedDocumentData) => {
    setDocumentData(data)
    setStep(1)
  }

  const handleLivenessComplete = (result: LivenessResult) => {
    setLivenessData(result)
    setStep(2)
  }

  const handleFaceMatchComplete = (image: string, result: FaceMatchResult) => {
    setSelfie(image)
    setFaceMatchData(result)
    
    const matchConfidence = result.confidence || result.match_percentage || 0
    const isVerified = matchConfidence >= 60
    
    const verificationResult = {
      verified: isVerified,
      confidence: matchConfidence,
      userName: documentData?.name || 'Unknown',
      documentNumber: documentData?.idNumber || documentData?.documentNumber,
      matchSimilarity: result.similarity,
      livenessConfidence: livenessData?.confidence
    }
    
    setVerificationRecord(verificationResult)
    setStep(3)
  }

  useEffect(() => {
    const finalize = async () => {
      if (
        step === 3 &&
        documentData &&
        faceMatchData &&
        verificationRecord &&
        !completing
      ) {
        try {
          setCompleting(true)
          setCompletionError(null)
        } catch (err) {
          console.error('Verification completion failed', err)
          setCompletionError('Failed to complete verification.')
        } finally {
          setCompleting(false)
        }
      }
    }
    finalize()
  }, [step, documentData, faceMatchData, livenessData, verificationRecord, completing])

  const computedResult = verificationRecord || {
    verified: false,
    confidence: 0,
    userName: documentData?.name || 'Unknown',
    documentType: documentData?.documentType || 'ID Document',
    documentNumber: documentData?.documentNumber || documentData?.idNumber,
    verificationId: undefined,
    livenessConfidence: livenessData?.confidence,
    matchSimilarity: faceMatchData?.similarity,
  }

  const steps = [
    <IDVerificationFlow
      key="id"
      onComplete={handleIDComplete}
      onUpload={handleIDUpload}
    />,
    <LivenessDetection
      key="liveness"
      onComplete={handleLivenessComplete}
    />,
    <FaceMatch
      key="face-match"
      idImage={uploadedID.front}
      onComplete={handleFaceMatchComplete}
    />,
    <VerificationSuccess
      key="success"
      result={computedResult}
      loading={completing}
      error={completionError}
    />,
  ]

  return (
    <main className="min-h-screen bg-background">
      {steps[step]}
    </main>
  )
}

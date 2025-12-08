'use client'

import { useEffect, useState } from 'react'
import IDVerificationFlow from '@/components/verification/id-verification-flow'
import LivenessDetection from '@/components/verification/liveness-detection'
import FaceMatch from '@/components/verification/face-match'
import VerificationSuccess from '@/components/verification/verification-success'
import { completeVerification } from '@/lib/verification-service'

export default function VerifyPage() {
  const [step, setStep] = useState(0)
  const [uploadedID, setUploadedID] = useState<{ front?: string; back?: string }>({})
  const [selfie, setSelfie] = useState<string | null>(null)
  const [documentData, setDocumentData] = useState<any>(null)
  const [livenessData, setLivenessData] = useState<any>(null)
  const [faceMatchData, setFaceMatchData] = useState<any>(null)
  const [verificationRecord, setVerificationRecord] = useState<any>(null)
  const [completionError, setCompletionError] = useState<string | null>(null)
  const [completing, setCompleting] = useState(false)

  const handleIDUpload = (front?: string, back?: string) => {
    if (front) setUploadedID((prev) => ({ ...prev, front }))
    if (back) setUploadedID((prev) => ({ ...prev, back }))
  }

  const handleIDComplete = (data: any) => {
    setDocumentData(data)
    setStep(1)
  }

  const handleLivenessComplete = (result: any) => {
    setLivenessData(result)
    setStep(2)
  }

  const handleFaceMatchComplete = (image: string, result: any) => {
    setSelfie(image)
    setFaceMatchData(result)
    
    // 60% дээш бол амжилттай
    const matchConfidence = result.confidence || result.match_percentage || 0
    const isVerified = matchConfidence >= 60
    
    // Verification result бэлтгэх
    const verificationResult = {
      verified: isVerified,
      confidence: matchConfidence,
      userName: documentData?.name || 'Тодорхойгүй',
      documentNumber: documentData?.idNumber || documentData?.documentNumber,
      matchSimilarity: result.similarity,
      livenessConfidence: livenessData?.confidence
    }
    
    setVerificationRecord(verificationResult)
    setStep(3)
  }

  // Call final completion API once all data is present
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
          // Optional: Save to backend
          // await completeVerification(...)
        } catch (err) {
          console.error('Verification completion failed', err)
          setCompletionError('Баталгаажуулалтыг дуусгаж чадсангүй.')
        } finally {
          setCompleting(false)
        }
      }
    }
    finalize()
  }, [step, documentData, faceMatchData, livenessData, verificationRecord, completing])

  // Use verificationRecord if already computed, else fallback
  const computedResult = verificationRecord || {
    verified: false,
    confidence: 0,
    userName: documentData?.name || 'Тодорхойгүй',
    documentType: documentData?.documentType || 'Бичиг баримт',
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
    <div className="min-h-screen bg-background dark">
      {steps[step]}
    </div>
  )
}

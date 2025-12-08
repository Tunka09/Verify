'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { matchFaces } from '@/lib/verification-service'

interface FaceMatchProps {
  idImage?: string
  onComplete: (selfie: string, result: FaceMatchResult) => void
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

export default function FaceMatch({ idImage, onComplete }: FaceMatchProps) {
  const [selfie, setSelfie] = useState<string | null>(null)
  const [matching, setMatching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [matchResult, setMatchResult] = useState<FaceMatchResult | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const context = canvasRef.current.getContext('2d')
    if (!context) return

    context.drawImage(videoRef.current, 0, 0, 300, 300)
    const imageData = canvasRef.current.toDataURL('image/jpeg')
    setSelfie(imageData)
  }

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelfie(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleMatch = async () => {
    if (!selfie) return
    if (!idImage) {
      setError('Эхлээд бичиг баримтаа оруулна уу.')
      return
    }

    setMatching(true)
    setError(null)
    try {
      const response = await matchFaces(idImage, selfie)
      
      // Backend response: { success, isMatch, confidence, similarity }
      const result: FaceMatchResult = {
        success: response.success,
        isMatch: response.isMatch,
        match: response.isMatch, // compatibility
        confidence: response.confidence,
        similarity: response.similarity,
        match_percentage: response.confidence
      }
      
      setMatchResult(result)
      onComplete(selfie, result)
    } catch (err) {
      console.error('Face match failed', err)
      const message = err instanceof Error ? err.message : 'Царай танилт амжилтгүй боллоо. Дахин оролдоно уу.'
      setError(message)
    } finally {
      setMatching(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        className="max-w-3xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-black mb-2 text-center bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Царай танилт
        </h1>
        <p className="text-muted-foreground text-center mb-12">
          Бичиг баримттайгаа тулгахын тулд селфи зураг авна уу
        </p>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* ID Photo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-sm text-muted-foreground mb-3 font-semibold">
              Document Photo
            </p>
            {idImage ? (
              <div className="relative rounded-xl overflow-hidden border-2 border-primary/30">
                <img
                  src={idImage || "/placeholder.svg"}
                  alt="ID"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
              </div>
            ) : (
              <div className="w-full aspect-square bg-primary/10 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center">
                <p className="text-muted-foreground">No ID loaded</p>
              </div>
            )}
          </motion.div>

          {/* Selfie */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-3 font-semibold">
              Your Selfie
            </p>
            <div className="relative rounded-xl overflow-hidden border-2 border-primary/30">
              {selfie ? (
                <div className="relative">
                  <img
                    src={selfie || "/placeholder.svg"}
                    alt="Selfie"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none"></div>
                </div>
              ) : (
                <div className="relative w-full aspect-square bg-accent/10 flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                    className="hidden"
                    id="selfie-upload"
                  />
                  <label htmlFor="selfie-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-accent/20 transition-colors">
                    <Upload className="w-8 h-8 text-accent mb-2" />
                    <p className="text-sm text-accent font-semibold">
                      Upload or capture
                    </p>
                  </label>

                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="hidden"
                  />
                  <video
                    ref={videoRef}
                    width={300}
                    height={300}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {!selfie && (
            <Button
              onClick={handleCapture}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground rounded-lg font-semibold py-6"
            >
              <Camera className="w-5 h-5 mr-2" />
              Capture Selfie
            </Button>
          )}

          {selfie && (
            <Button
              onClick={handleMatch}
              disabled={matching}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground rounded-lg font-semibold py-6"
            >
              {matching ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Matching Faces...
                </>
              ) : (
                'Verify Face Match'
              )}
            </Button>
          )}

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          {matchResult && (
            <div className="glassmorphism-dark p-6 rounded-lg border border-primary/30 text-center space-y-3">
              <p className="text-xl font-bold">
                {matchResult.isMatch || matchResult.match ? (
                  <span className="text-green-500">✓ Нүүрүүд таарч байна!</span>
                ) : (
                  <span className="text-red-500">✗ Нүүрүүд таарахгүй байна</span>
                )}
              </p>
              {matchResult.confidence !== undefined && (
                <div className="space-y-2">
                  <p className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {matchResult.confidence.toFixed(2)}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Таарах хувь (Match Confidence)
                  </p>
                  <div className="w-full h-3 bg-primary/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${matchResult.confidence}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full ${
                        matchResult.confidence >= 60
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-red-500 to-orange-500'
                      }`}
                    />
                  </div>
                </div>
              )}
              {matchResult.similarity !== undefined && (
                <p className="text-sm text-muted-foreground">
                  Face Distance: {(1 - matchResult.similarity).toFixed(4)}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

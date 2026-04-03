'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Loader2, Upload, ArrowRight, RefreshCw, CheckCircle, XCircle, Fingerprint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { matchFaces } from '@/lib/verification-service'
import type { Easing } from 'framer-motion'

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94] as Easing
    },
  },
}

// Image card component
function ImageCard({ 
  label, 
  image, 
  color,
  placeholder,
  onUpload
}: { 
  label: string
  image?: string | null
  color: string
  placeholder?: React.ReactNode
  onUpload?: (file: File) => void
}) {
  return (
    <div>
      <div className={`${color} px-3 py-1 border-3 border-foreground border-b-0 inline-block`}>
        <span className="text-xs font-black uppercase tracking-wider">{label}</span>
      </div>
      <div 
        className="relative aspect-square border-3 border-foreground bg-white overflow-hidden"
        style={{ boxShadow: '6px 6px 0px var(--foreground)' }}
      >
        {image ? (
          <>
            <img
              src={image}
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-foreground/80 text-background py-2 px-3 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Ready</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            {onUpload ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onUpload(file)
                  }}
                  className="hidden"
                  id="selfie-upload"
                />
                <label 
                  htmlFor="selfie-upload" 
                  className="cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-[#c6f135]/30 transition-colors"
                >
                  <Upload className="w-10 h-10 mb-3 text-foreground/50" strokeWidth={2} />
                  <p className="font-bold text-sm uppercase">Upload Photo</p>
                  <p className="text-xs text-muted-foreground mt-1">or drag & drop</p>
                </label>
              </>
            ) : (
              placeholder
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Match result display
function MatchResult({ result }: { result: FaceMatchResult }) {
  const isMatch = result.isMatch || result.match
  const confidence = result.confidence || 0
  const passed = confidence >= 60

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${passed ? 'bg-[#c6f135]' : 'bg-[#ff6b6b]'} p-6 border-3 border-foreground shadow-[6px_6px_0px_var(--foreground)]`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-16 h-16 ${passed ? 'bg-foreground/10' : 'bg-white/20'} border-2 border-foreground flex items-center justify-center`}>
          {passed ? (
            <CheckCircle className="w-8 h-8" strokeWidth={2.5} />
          ) : (
            <XCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
          )}
        </div>
        <div>
          <h3 className={`text-2xl font-black uppercase ${passed ? 'text-foreground' : 'text-white'}`}>
            {passed ? 'Match Found!' : 'No Match'}
          </h3>
          <p className={`text-sm ${passed ? 'text-foreground/70' : 'text-white/70'}`}>
            {passed ? 'Faces successfully matched' : 'Confidence below 60% threshold'}
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="bg-foreground/10 p-4 border-2 border-foreground">
        <div className="flex justify-between mb-2">
          <span className={`font-bold text-sm uppercase ${passed ? 'text-foreground' : 'text-white'}`}>
            Match Confidence
          </span>
          <span className={`font-mono font-black text-xl ${passed ? 'text-foreground' : 'text-white'}`}>
            {confidence.toFixed(1)}%
          </span>
        </div>
        <div className="h-4 bg-white/50 border-2 border-foreground overflow-hidden">
          <motion.div
            className={`h-full ${passed ? 'bg-foreground' : 'bg-white'}`}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-xs ${passed ? 'text-foreground/50' : 'text-white/50'}`}>0%</span>
          <span className={`text-xs font-bold ${passed ? 'text-foreground/70' : 'text-white/70'}`}>
            60% required
          </span>
          <span className={`text-xs ${passed ? 'text-foreground/50' : 'text-white/50'}`}>100%</span>
        </div>
      </div>

      {result.similarity !== undefined && (
        <div className={`mt-3 text-sm ${passed ? 'text-foreground/70' : 'text-white/70'}`}>
          Face Distance: <span className="font-mono font-bold">{(1 - result.similarity).toFixed(4)}</span>
        </div>
      )}
    </motion.div>
  )
}

export default function FaceMatch({ idImage, onComplete }: FaceMatchProps) {
  const [selfie, setSelfie] = useState<string | null>(null)
  const [matching, setMatching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [matchResult, setMatchResult] = useState<FaceMatchResult | null>(null)
  const [camError, setCamError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((s) => {
        streamRef.current = s
        if (videoRef.current) videoRef.current.srcObject = s
      })
      .catch(() => setCamError('Camera access denied'))
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()) }
  }, [])

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    setSelfie(canvas.toDataURL('image/jpeg'))
    setMatchResult(null)
    setError(null)
  }

  const handleMatch = async () => {
    if (!selfie) return
    if (!idImage) {
      setError('Please upload your ID document first.')
      return
    }

    setMatching(true)
    setError(null)
    try {
      const response = await matchFaces(idImage, selfie)
      
      const result: FaceMatchResult = {
        success: response.success,
        isMatch: response.isMatch,
        match: response.isMatch,
        confidence: response.confidence,
        similarity: response.similarity,
        match_percentage: response.confidence
      }
      
      setMatchResult(result)
      onComplete(selfie, result)
    } catch (err) {
      console.error('Face match failed', err)
      const message = err instanceof Error ? err.message : 'Face matching failed. Please try again.'
      setError(message)
    } finally {
      setMatching(false)
    }
  }

  const resetSelfie = () => {
    setSelfie(null)
    setMatchResult(null)
    setError(null)
    // restart camera if it was stopped
    if (!streamRef.current || streamRef.current.getTracks().every(t => t.readyState === 'ended')) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then((s) => {
          streamRef.current = s
          if (videoRef.current) videoRef.current.srcObject = s
        })
        .catch(() => setCamError('Camera access denied'))
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      {/* Background pattern */}
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />

      <canvas ref={canvasRef} className="hidden" />

      <motion.div
        className="max-w-3xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.span 
            className="inline-flex items-center gap-2 bg-[#ff6b9d] text-foreground px-4 py-2 font-bold text-sm uppercase tracking-wider border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Fingerprint className="w-4 h-4" />
            Step 3 of 3
          </motion.span>

          <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
            FACE <span className="text-[#4ecdc4]">MATCH</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Upload a selfie to compare with your ID document photo
          </p>
        </motion.div>

        {/* Comparison grid */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 mb-8">
          <ImageCard
            label="ID Document"
            image={idImage}
            color="bg-[#4ecdc4]"
            placeholder={
              <div className="text-center p-4">
                <p className="font-bold text-foreground/50">No ID uploaded</p>
              </div>
            }
          />
          
          {/* Selfie: live camera or captured photo */}
          <div>
            <div className="bg-[#ff6b9d] px-3 py-1 border-3 border-foreground border-b-0 inline-block">
              <span className="text-xs font-black uppercase tracking-wider">Your Selfie</span>
            </div>
            <div
              className="relative aspect-square border-3 border-foreground bg-black overflow-hidden"
              style={{ boxShadow: '6px 6px 0px var(--foreground)' }}
            >
              {selfie ? (
                <>
                  <img src={selfie} alt="Selfie" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-foreground/80 text-background py-2 px-3 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Ready</span>
                  </div>
                </>
              ) : camError ? (
                <div className="w-full h-full flex items-center justify-center text-center px-4">
                  <p className="font-bold text-sm text-white">{camError}</p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <button
                    onClick={handleCapture}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#ff6b9d] border-3 border-foreground px-4 py-2 font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_var(--foreground)] hover:shadow-[5px_5px_0px_var(--foreground)] transition-all"
                  >
                    <Camera className="w-4 h-4 inline mr-1" />
                    Take Photo
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* VS indicator */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center mb-8"
        >
          <div className="bg-[#ffd93d] w-16 h-16 border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] flex items-center justify-center">
            <span className="font-black text-xl">VS</span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={itemVariants} className="space-y-4">
          {selfie && !matchResult && (
            <div className="flex gap-4">
              <Button
                onClick={resetSelfie}
                variant="outline"
                className="flex-1 bg-background border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] font-bold uppercase tracking-wider py-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--foreground)] hover:bg-muted"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Retake
              </Button>
              <Button
                onClick={handleMatch}
                disabled={matching}
                className="flex-1 bg-[#c6f135] text-foreground hover:bg-[#d4f94a] border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] font-bold uppercase tracking-wider py-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--foreground)] disabled:opacity-70"
              >
                {matching ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Matching...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5 mr-2" />
                    Compare Faces
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Error display */}
          {error && (
            <motion.div
              className="bg-[#ff6b6b] text-white p-4 border-3 border-foreground flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-bold">{error}</span>
            </motion.div>
          )}

          {/* Match result */}
          {matchResult && <MatchResult result={matchResult} />}
        </motion.div>

        {/* Tips */}
        <motion.div
          variants={itemVariants}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { label: 'Face Camera', tip: 'Look straight' },
            { label: 'Good Light', tip: 'Avoid shadows' },
            { label: 'Plain BG', tip: 'Clear background' },
            { label: 'No Filter', tip: 'Natural photo' },
          ].map((item) => (
            <div key={item.label} className="bg-muted p-3 border-2 border-foreground text-center">
              <p className="font-bold text-xs uppercase tracking-wider">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.tip}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

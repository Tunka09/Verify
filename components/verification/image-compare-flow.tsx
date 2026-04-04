'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Camera, Loader2, CheckCircle, XCircle,
  ArrowRight, RefreshCw, X, AlertCircle, ImageIcon, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { matchFaces } from '@/lib/verification-service'
import type { Easing } from 'framer-motion'

interface ImageCompareFlowProps {
  onComplete?: (result: CompareResult) => void
}

interface CompareResult {
  isMatch: boolean
  confidence: number
  similarity?: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as Easing },
  },
}

// Simple upload zone for the reference photo
function PhotoUploadZone({
  image,
  onUpload,
}: {
  image: string | null
  onUpload: (file: File) => void
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) onUpload(file)
    },
    [onUpload]
  )

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        id="photo-upload"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onUpload(file)
        }}
      />
      <label htmlFor="photo-upload">
        <motion.div
          className={`
            cursor-pointer border-4 border-foreground p-6 relative overflow-hidden
            ${isDragging ? 'bg-[#c6f135]' : image ? 'bg-[#c6f135]' : 'bg-muted border-dashed'}
            ${!image ? 'hover:bg-[#c6f135]/40' : ''}
          `}
          style={{ boxShadow: image ? '6px 6px 0px var(--foreground)' : '4px 4px 0px var(--foreground)' }}
          whileHover={!image ? { y: -3 } : {}}
          whileTap={{ scale: 0.98 }}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
        >
          {image ? (
            <div className="relative w-full h-52 border-3 border-foreground overflow-hidden bg-white">
              <img src={image} alt="Uploaded photo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-[#c6f135] px-2 py-1 border-2 border-foreground">
                <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-xs font-bold">Uploaded</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-foreground/10 border-3 border-foreground flex items-center justify-center"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ImageIcon className="w-8 h-8" strokeWidth={2} />
              </motion.div>
              <p className="font-black text-lg mb-1 uppercase">
                {isDragging ? 'Drop it!' : 'Upload Photo'}
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Any photo or business card with a face
              </p>
            </div>
          )}
        </motion.div>
      </label>
    </div>
  )
}

// Selfie camera capture
function SelfieCapture({
  onCapture,
}: {
  onCapture: (dataUrl: string) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setStreaming(true)
        }
      } catch {
        setError('Could not access camera. Please allow camera access.')
      }
    }

    startCamera()

    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    onCapture(canvas.toDataURL('image/jpeg', 0.9))
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-52 bg-muted border-4 border-foreground gap-3">
        <AlertCircle className="w-8 h-8 text-[#ff6b6b]" />
        <p className="text-sm font-bold text-center px-4">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="relative border-4 border-foreground overflow-hidden bg-black" style={{ boxShadow: '6px 6px 0px var(--foreground)' }}>
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-52 object-cover scale-x-[-1]" />
        {streaming && (
          <div className="absolute inset-0 flex items-end justify-center pb-4">
            <motion.div
              className="absolute inset-x-0 top-0 h-1 bg-[#c6f135]/80"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <Button
        onClick={capture}
        disabled={!streaming}
        className="w-full mt-4 bg-[#4ecdc4] text-foreground hover:bg-[#3dbdb4] border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] font-bold uppercase tracking-wider py-5 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--foreground)]"
      >
        <Camera className="w-5 h-5 mr-2" />
        Take Selfie
      </Button>
    </div>
  )
}

// Result card
function ResultCard({
  result,
  onRetry,
}: {
  result: CompareResult
  onRetry: () => void
}) {
  const isMatch = result.isMatch && result.confidence >= 60
  const confidence = result.confidence

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className={`border-4 border-foreground p-8 ${isMatch ? 'bg-[#c6f135]' : 'bg-[#ff6b6b]'}`}
      style={{ boxShadow: '6px 6px 0px var(--foreground)' }}
    >
      <div className="flex items-center gap-4 mb-6">
        {isMatch ? (
          <CheckCircle className="w-12 h-12" strokeWidth={2.5} />
        ) : (
          <XCircle className="w-12 h-12" strokeWidth={2.5} />
        )}
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight">
            {isMatch ? 'Face Matched!' : 'No Match'}
          </h3>
          <p className="font-medium">
            {isMatch ? 'The faces appear to be the same person.' : 'The faces do not match.'}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-bold uppercase tracking-wider">Match Confidence</span>
          <span className="font-mono font-bold">{confidence.toFixed(1)}%</span>
        </div>
        <div className="h-4 bg-foreground/20 border-2 border-foreground overflow-hidden">
          <motion.div
            className="h-full bg-foreground"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(confidence, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      <Button
        onClick={onRetry}
        className="w-full bg-foreground text-background hover:bg-foreground/80 border-3 border-foreground font-bold uppercase tracking-wider py-4 mt-2"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </motion.div>
  )
}

export default function ImageCompareFlow({ onComplete }: ImageCompareFlowProps) {
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [selfieImage, setSelfieImage] = useState<string | null>(null)
  const [comparing, setComparing] = useState(false)
  const [result, setResult] = useState<CompareResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setReferenceImage(e.target?.result as string)
      setResult(null)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleSelfieCapture = (dataUrl: string) => {
    setSelfieImage(dataUrl)
    setResult(null)
    setError(null)
  }

  const handleCompare = async () => {
    if (!referenceImage || !selfieImage) {
      setError('Please upload a photo and take a selfie first.')
      return
    }

    setError(null)
    setComparing(true)
    try {
      const res = await matchFaces(referenceImage, selfieImage)
      const confidence = res.confidence || res.match_percentage || 0
      const compareResult: CompareResult = {
        isMatch: res.isMatch ?? res.is_match ?? confidence >= 60,
        confidence,
        similarity: res.similarity,
      }
      setResult(compareResult)
      onComplete?.(compareResult)
    } catch (err) {
      console.error('Face compare failed', err)
      setError(err instanceof Error ? err.message : 'Face comparison failed. Make sure both images contain a visible face.')
    } finally {
      setComparing(false)
    }
  }

  const handleRetry = () => {
    setReferenceImage(null)
    setSelfieImage(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/choose-method"
          className="inline-flex items-center gap-2 bg-background border-3 border-foreground px-4 py-2 font-bold text-sm uppercase tracking-wider shadow-[4px_4px_0px_var(--foreground)] hover:shadow-[2px_2px_0px_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <motion.div
        className="max-w-3xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <motion.span
            className="inline-flex items-center gap-2 bg-[#4ecdc4] text-foreground px-4 py-2 font-bold text-sm uppercase tracking-wider border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <ImageIcon className="w-4 h-4" />
            Photo Compare
          </motion.span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-4">
            COMPARE YOUR <span className="text-[#4ecdc4]">FACE</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Upload a photo with a face, then take a selfie to compare
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ResultCard result={result} onRetry={handleRetry} />
            </motion.div>
          ) : (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Reference photo */}
                <motion.div variants={itemVariants}>
                  <div className="mb-3">
                    <span className="font-black uppercase tracking-wider text-sm">
                      1. Upload Reference Photo
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Business card, ID photo, or any image with a face
                    </p>
                  </div>
                  <PhotoUploadZone image={referenceImage} onUpload={handlePhotoUpload} />
                  {referenceImage && (
                    <button
                      onClick={() => setReferenceImage(null)}
                      className="mt-2 text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  )}
                </motion.div>

                {/* Selfie */}
                <motion.div variants={itemVariants}>
                  <div className="mb-3">
                    <span className="font-black uppercase tracking-wider text-sm">
                      2. Take a Selfie
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Look directly at the camera
                    </p>
                  </div>
                  {selfieImage ? (
                    <div>
                      <div
                        className="border-4 border-foreground overflow-hidden"
                        style={{ boxShadow: '6px 6px 0px var(--foreground)' }}
                      >
                        <img
                          src={selfieImage}
                          alt="Selfie"
                          className="w-full h-52 object-cover scale-x-[-1]"
                        />
                      </div>
                      <button
                        onClick={() => setSelfieImage(null)}
                        className="mt-2 text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Retake
                      </button>
                    </div>
                  ) : (
                    <SelfieCapture onCapture={handleSelfieCapture} />
                  )}
                </motion.div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  className="flex items-center gap-3 bg-[#ff6b6b] text-white p-4 border-3 border-foreground mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-bold">{error}</span>
                  <button onClick={() => setError(null)} className="ml-auto">
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* Compare button */}
              {referenceImage && selfieImage && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Button
                    onClick={handleCompare}
                    disabled={comparing}
                    className="w-full bg-[#c6f135] text-foreground hover:bg-[#d4f94a] border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] font-bold uppercase tracking-wider py-6 text-lg transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--foreground)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {comparing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Comparing Faces...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 mr-2" />
                        Compare Faces
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

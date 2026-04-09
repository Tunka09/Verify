'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Loader2, ArrowRight, RefreshCw, CheckCircle, XCircle, Fingerprint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { matchFaces } from '@/lib/verification-service'
import type { Easing } from 'framer-motion'
import type { FaceMatchVerifyResult } from '@/types/verification'

interface FaceMatchProps {
  idImage?: string
  onComplete: (selfie: string, result: FaceMatchVerifyResult) => void
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
  blur = false,
}: {
  label: string
  image?: string | null
  color: string
  placeholder?: React.ReactNode
  blur?: boolean
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
              className={`w-full h-full object-cover${blur ? ' blur-sm' : ''}`}
            />
            <div className="absolute bottom-0 inset-x-0 bg-foreground/80 text-background py-2 px-3 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Бэлэн</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  )
}

// Match result display
function MatchResult({ result, onRetake, onProceed }: { result: FaceMatchVerifyResult; onRetake: () => void; onProceed: () => void }) {
  const confidence = result.confidence || 0
  const passed = confidence >= 55

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
            {passed ? 'Тааралдлаа!' : 'Таарсангүй'}
          </h3>
          <p className={`text-sm ${passed ? 'text-foreground/70' : 'text-white/70'}`}>
            {passed ? 'Нүүр амжилттай тааралдлаа' : '55%-ын хязгаараас доогуур'}
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="bg-foreground/10 p-4 border-2 border-foreground mb-4">
        <div className="flex justify-between mb-2">
          <span className={`font-bold text-sm uppercase ${passed ? 'text-foreground' : 'text-white'}`}>
            Тааралдлын Итгэлцэл
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
            55% шаардлагатай
          </span>
          <span className={`text-xs ${passed ? 'text-foreground/50' : 'text-white/50'}`}>100%</span>
        </div>
      </div>

      {/* On failure: offer retake or proceed anyway */}
      {!passed && (
        <div className="flex gap-3 mt-2">
          <Button
            onClick={onRetake}
            className="flex-1 bg-white text-[#ff6b6b] hover:bg-white/90 border-2 border-foreground font-bold uppercase"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Дахин авах
          </Button>
          <Button
            onClick={onProceed}
            variant="outline"
            className="flex-1 bg-transparent text-white border-2 border-white hover:bg-white/10 font-bold uppercase"
          >
            Үргэлжлүүлэх
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </motion.div>
  )
}

export default function FaceMatch({ idImage, onComplete }: FaceMatchProps) {
  const [selfie, setSelfie] = useState<string | null>(null)
  const [matching, setMatching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [matchResult, setMatchResult] = useState<FaceMatchVerifyResult | null>(null)
  const [camError, setCamError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Restart camera on mount and on every retry
  useEffect(() => {
    let cancelled = false
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return }
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch {
        if (!cancelled) setCamError('Камерт хандах эрх байхгүй')
      }
    }

    startCamera()
    return () => {
      cancelled = true
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [retryCount])

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
      setError('Эхлээд иргэний үнэмлэхээ оруулна уу.')
      return
    }

    setMatching(true)
    setError(null)
    try {
      const response = await matchFaces(idImage, selfie)

      const result: FaceMatchVerifyResult = {
        success: response.success,
        isMatch: response.isMatch,
        match: response.isMatch,
        confidence: response.confidence,
        similarity: response.similarity,
        match_percentage: response.confidence,
      }

      setMatchResult(result)

      if ((result.confidence || 0) >= 55) {
        onComplete(selfie, result)
      }
    } catch (err) {
      console.error('Face match failed', err)
      const message = err instanceof Error ? err.message : 'Нүүр тааруулалт амжилтгүй. Дахин оролдоно уу.'
      setError(message)
    } finally {
      setMatching(false)
    }
  }

  const resetSelfie = () => {
    setSelfie(null)
    setMatchResult(null)
    setError(null)
    setCamError(null)
    setRetryCount((c) => c + 1)
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
            2-р алхам / 2-аас
          </motion.span>

          <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
            НҮҮР <span className="text-[#4ecdc4]">ТААРУУЛАХ</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Иргэний үнэмлэхийн зурагтай харьцуулахын тулд selfie авна уу
          </p>
        </motion.div>

        {/* Warning banner */}
        <motion.div
          variants={itemVariants}
          className="bg-[#ffd93d] border-3 border-foreground px-4 py-3 text-sm font-bold flex flex-wrap gap-x-3 gap-y-1 mb-6 shadow-[3px_3px_0px_var(--foreground)]"
        >
          <span>Камерт шууд харна уу</span>
          <span>· Шүлс, нүдний шил хэрэглэхгүй</span>
          <span>· Маск, бүрхэвч зүүхгүй</span>
          <span>· Малгай өмсөхгүй</span>
          <span>· Filter ашиглахгүй</span>
        </motion.div>

        {/* Comparison grid */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 mb-8">
          <ImageCard
            label="Иргэний Үнэмлэх"
            image={idImage}
            color="bg-[#4ecdc4]"
            blur
            placeholder={
              <div className="text-center p-4">
                <p className="font-bold text-foreground/50">ID оруулаагүй</p>
              </div>
            }
          />

          {/* Selfie: live camera or captured photo */}
          <div>
            <div className="bg-[#ff6b9d] px-3 py-1 border-3 border-foreground border-b-0 inline-block">
              <span className="text-xs font-black uppercase tracking-wider">Таны Зураг</span>
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
                    <span className="text-xs font-bold uppercase">Бэлэн</span>
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
                    Зураг Авах
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
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={resetSelfie}
                variant="outline"
                className="flex-1 bg-background border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] font-bold uppercase tracking-wider py-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--foreground)] hover:bg-muted"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Дахин Авах
              </Button>
              <Button
                onClick={handleMatch}
                disabled={matching}
                className="flex-1 bg-[#c6f135] text-foreground hover:bg-[#d4f94a] border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] font-bold uppercase tracking-wider py-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--foreground)] disabled:opacity-70"
              >
                {matching ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Тааруулж байна...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5 mr-2" />
                    Нүүр Харьцуулах
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

          {/* Match result — blocks auto-advance on failure */}
          {matchResult && (
            <MatchResult
              result={matchResult}
              onRetake={resetSelfie}
              onProceed={() => onComplete(selfie!, matchResult)}
            />
          )}
        </motion.div>

        {/* Tips */}
        <motion.div
          variants={itemVariants}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { label: 'Камерт харах', tip: 'Шууд харна уу' },
            { label: 'Сайн Гэрэл', tip: 'Сүүдэргүй байх' },
            { label: 'Цэвэр Дэвсгэр', tip: 'Энгийн арын дэвсгэр' },
            { label: 'Filter Хэрэглэхгүй', tip: 'Байгалийн зураг' },
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

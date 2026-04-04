'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader2, Eye, Smile, RotateCcw, AlertCircle, FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { checkLiveness } from '@/lib/verification-service'
import type { Easing } from 'framer-motion'
import type { LivenessResult } from '@/types/verification'

interface LivenessDetectionProps {
  onComplete: (result: LivenessResult) => void
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

const challenges = [
  {
    instruction: 'Blink your eyes slowly',
    icon: Eye,
    color: 'bg-[#c6f135]',
  },
  {
    instruction: 'Turn your head right',
    icon: RotateCcw,
    color: 'bg-[#4ecdc4]',
  },
  {
    instruction: 'Smile naturally',
    icon: Smile,
    color: 'bg-[#ff6b9d]',
  },
]

// Progress indicator
function ChallengeProgress({
  current,
  total,
  completed
}: {
  current: number
  total: number
  completed: number
}) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current
        const isDone = i < completed

        return (
          <motion.div
            key={i}
            className={`
              w-12 h-12 flex items-center justify-center border-3 border-foreground
              ${isDone ? 'bg-[#c6f135]' : isActive ? 'bg-[#ffd93d]' : 'bg-muted'}
              ${isActive ? 'shadow-[4px_4px_0px_var(--foreground)]' : 'shadow-[2px_2px_0px_var(--foreground)]'}
            `}
            animate={isActive ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
          >
            {isDone ? (
              <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
            ) : (
              <span className="font-black text-lg">{i + 1}</span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

// Live camera view — accepts an external ref so the parent can capture frames
function CameraView({ isProcessing, videoRef }: { isProcessing: boolean; videoRef: React.RefObject<HTMLVideoElement | null> }) {
  const [camError, setCamError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((s) => {
        stream = s
        if (videoRef.current) videoRef.current.srcObject = s
      })
      .catch(() => setCamError('Camera access denied'))
    return () => { stream?.getTracks().forEach((t) => t.stop()) }
  }, [videoRef])

  return (
    <motion.div
      className="relative w-full aspect-square max-w-sm mx-auto border-4 border-foreground bg-muted overflow-hidden"
      style={{ boxShadow: '8px 8px 0px var(--foreground)' }}
    >
      {camError ? (
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <p className="font-bold text-sm text-muted-foreground">{camError}</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        />
      )}

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-foreground z-10" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-foreground z-10" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-foreground z-10" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-foreground z-10" />

      {/* Scanning animation */}
      {isProcessing && (
        <motion.div
          className="absolute inset-x-0 h-1 bg-[#c6f135] z-10"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <div className="bg-[#ffd93d] p-4 border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function LivenessDetection({ onComplete }: LivenessDetectionProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const captureFrame = useCallback((): string => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.videoWidth === 0) return 'data:,placeholder'
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.6)
  }, [])

  const processChallenge = useCallback(async () => {
    setIsProcessing(true)
    setError(null)
    try {
      const frame = captureFrame()
      const response = await checkLiveness(
        challenges[currentChallenge].instruction,
        frame
      )
      const result = response.data || response

      if (completedChallenges < challenges.length - 1) {
        setCompletedChallenges((prev) => prev + 1)
        setCurrentChallenge((prev) => prev + 1)
      } else {
        onComplete(result)
      }
    } catch (err) {
      console.error('Liveness check failed', err)
      setError('Verification failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }, [currentChallenge, completedChallenges, captureFrame, onComplete])

  useEffect(() => {
    if (!isProcessing && completedChallenges < challenges.length && !error) {
      const timer = setTimeout(processChallenge, 1500)
      return () => clearTimeout(timer)
    }
  }, [isProcessing, completedChallenges, error, processChallenge])

  const challenge = challenges[currentChallenge]
  const Icon = challenge.icon

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      {/* Background pattern */}
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      <motion.div
        className="max-w-lg mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.span
            className="inline-flex items-center gap-2 bg-[#4ecdc4] text-foreground px-4 py-2 font-bold text-sm uppercase tracking-wider border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Eye className="w-4 h-4" />
            Step 2 of 3
          </motion.span>

          <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
            LIVENESS <span className="text-[#ff6b9d]">CHECK</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Complete the challenges to verify you&apos;re a real person
          </p>
        </motion.div>

        {/* Simulation disclosure */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 bg-[#ffd93d] p-3 border-3 border-foreground shadow-[3px_3px_0px_var(--foreground)] mb-6 text-sm font-bold"
        >
          <FlaskConical className="w-4 h-4 flex-shrink-0" />
          <span>Demo mode: liveness is simulated. Real detection requires the Python backend.</span>
        </motion.div>

        {/* Progress */}
        <motion.div variants={itemVariants}>
          <ChallengeProgress
            current={currentChallenge}
            total={challenges.length}
            completed={completedChallenges}
          />
        </motion.div>

        {/* Camera view */}
        <motion.div variants={itemVariants} className="mb-8">
          <CameraView isProcessing={isProcessing} videoRef={videoRef} />
        </motion.div>

        {/* Current challenge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChallenge}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`${challenge.color} p-6 border-3 border-foreground shadow-[6px_6px_0px_var(--foreground)] mb-6`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-foreground/10 border-2 border-foreground flex items-center justify-center flex-shrink-0">
                <Icon className="w-7 h-7" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1">
                  Challenge {currentChallenge + 1} of {challenges.length}
                </p>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {challenge.instruction}
                </h2>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Status */}
        {isProcessing && (
          <motion.div
            className="flex items-center justify-center gap-3 bg-[#ffd93d] p-4 border-3 border-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-bold uppercase tracking-wider">Verifying...</span>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            className="bg-[#ff6b6b] text-white p-4 border-3 border-foreground space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
            <Button
              onClick={processChallenge}
              disabled={isProcessing}
              className="w-full bg-white text-[#ff6b6b] hover:bg-white/90 border-2 border-foreground font-bold uppercase"
            >
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          variants={itemVariants}
          className="mt-8 grid grid-cols-3 gap-3"
        >
          {[
            { label: 'Good Light', tip: 'Face a window' },
            { label: 'Center Face', tip: 'Stay in frame' },
            { label: 'Clear View', tip: 'Remove glasses' },
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

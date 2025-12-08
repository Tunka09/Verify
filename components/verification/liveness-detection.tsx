'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { checkLiveness } from '@/lib/verification-service'

interface LivenessDetectionProps {
  onComplete: (result: LivenessResult) => void
}

interface LivenessResult {
  isLive: boolean
  confidence?: number
  challenges?: Record<string, boolean>
}

export default function LivenessDetection({ onComplete }: LivenessDetectionProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const challenges = [
    {
      instruction: 'Нүдээ удаанаар цавчих',
      emoji: '👁️',
      duration: 3,
    },
    {
      instruction: 'Толгойгоо баруун тийш эргүүлэх',
      emoji: '→',
      duration: 3,
    },
    {
      instruction: 'Энгийнээр инээмсэглэх',
      emoji: '😊',
      duration: 3,
    },
  ]

  const processChallenge = async () => {
    setIsProcessing(true)
    setError(null)
    try {
      const response = await checkLiveness(
        challenges[currentChallenge].instruction,
        'data:,placeholder-frame'
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
      setError('Шалгалт амжилтгүй боллоо. Дахин оролдоно уу.')
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (!isProcessing && completedChallenges < challenges.length && !error) {
      const timer = setTimeout(processChallenge, 1000)
      return () => clearTimeout(timer)
    }
  }, [isProcessing, completedChallenges, error, currentChallenge])

  const challenge = challenges[currentChallenge]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Амьд эсэхийг шалгах
        </h1>
        <p className="text-muted-foreground mb-12">
          Бодит хүн мөн эсэхийг батлахын тулд даалгавруудыг биелүүлнэ үү
        </p>

        {/* Camera Placeholder */}
        <motion.div
          className="relative mb-12 rounded-xl overflow-hidden border-2 border-primary/30"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative w-full aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            {/* Face Mesh Placeholder */}
            <svg className="w-32 h-32 text-primary/30" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" />
              <circle cx="35" cy="40" r="4" fill="currentColor" />
              <circle cx="65" cy="40" r="4" fill="currentColor" />
              <path d="M 40 60 Q 50 70 60 60" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>

            {/* Scanning Line Animation */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-accent/20 scan-line"></div>
          </div>
        </motion.div>

        {/* Challenge Instruction */}
        <motion.div
          key={currentChallenge}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-8 glassmorphism-dark rounded-xl border border-primary/30"
        >
          <div className="text-6xl mb-4">{challenge.emoji}</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {challenge.instruction}
          </h2>
          <p className="text-muted-foreground text-sm">
            Completing challenge {currentChallenge + 1} of {challenges.length}
          </p>
        </motion.div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-3 mb-12">
          {challenges.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: index === currentChallenge ? 1.2 : 1,
              }}
            >
              {index <= completedChallenges ? (
                <CheckCircle className="w-8 h-8 text-accent" />
              ) : (
                <Circle
                  className={`w-8 h-8 ${
                    index === currentChallenge
                      ? 'text-primary animate-pulse'
                      : 'text-primary/30'
                  }`}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Status */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 text-accent">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Verifying...</span>
          </div>
        )}

        {error && (
          <div className="text-destructive text-sm mt-6 space-y-3">
            <p>{error}</p>
            <Button onClick={processChallenge} disabled={isProcessing}>
              Retry
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

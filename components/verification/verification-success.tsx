'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Download, Share2, Home, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface VerificationSuccessProps {
  result: {
    verified: boolean
    confidence: number
    userName?: string
    documentType?: string
    documentNumber?: string
    verificationId?: string
    livenessConfidence?: number
    matchSimilarity?: number
  }
  loading?: boolean
  error?: string | null
}

export default function VerificationSuccess({
  result,
  loading,
  error,
}: VerificationSuccessProps) {
  const confettiPieces = Array.from({ length: 50 })

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Confetti Animation */}
      {confettiPieces.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full pointer-events-none"
          initial={{
            x: Math.random() * window.innerWidth - window.innerWidth / 2,
            y: -20,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 20,
            x:
              Math.random() * window.innerWidth -
              window.innerWidth / 2 +
              (Math.random() - 0.5) * 200,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            ease: 'easeIn',
            delay: Math.random() * 0.5,
          }}
        />
      ))}

      <motion.div
        className="max-w-2xl w-full text-center relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Icon */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-background" />
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            {result.verified ? 'БАТАЛГААЖЛАА ✓' : 'ТАТГАЛЗСАН ✗'}
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            {loading 
              ? 'Баталгаажуулалтыг дуусгаж байна...' 
              : result.verified 
                ? `Таарах хувь ${result.confidence?.toFixed(1)}% - Амжилттай баталгаажлаа!`
                : `Таарах хувь ${result.confidence?.toFixed(1)}% - Хангалтгүй байна (60% шаардлагатай)`
            }
          </p>
          {error && (
            <div className="flex items-center justify-center gap-2 text-destructive text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </motion.div>

        {/* Result Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 glassmorphism-dark p-10 rounded-xl border border-primary/30 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Full Name</p>
              <p className="text-2xl font-bold text-foreground">
                {result.userName || 'Pending'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Document Type
              </p>
              <p className="text-2xl font-bold text-foreground">
                {result.documentType || 'ID Document'}
              </p>
            </div>
            {result.documentNumber && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Document Number
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {result.documentNumber}
                </p>
              </div>
            )}
            {result.verificationId && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Verification ID
                </p>
                <p className="text-xl font-bold text-foreground">
                  {result.verificationId}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Таарах хувь / Match Confidence
              </p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {result.confidence?.toFixed?.(1) ?? '—'}%
                </p>
                <div className="flex-1 h-3 bg-primary/20 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      (result.confidence || 0) >= 60
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-red-500 to-orange-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence || 0}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  ></motion.div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(result.confidence || 0) >= 60 
                  ? '✓ Амжилттай (60% дээш)' 
                  : '✗ Хангалтгүй (60% шаардлагатай)'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Төлөв / Status</p>
              <p className={`text-2xl font-bold ${result.verified ? 'text-green-500' : 'text-red-500'}`}>
                {result.verified ? '✓ Баталгаажсан' : '✗ Татгалзсан'}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="pt-6 border-t border-primary/20 space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Liveness Check</span>
              <span className="text-foreground font-semibold">
                {result.livenessConfidence ? `${result.livenessConfidence.toFixed(1)}%` : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Face Match</span>
              <span className="text-foreground font-semibold">
                {result.matchSimilarity ? `${result.matchSimilarity.toFixed(2)}%` : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document Authenticity</span>
              <span className="text-foreground font-semibold">98.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing Time</span>
              <span className="text-foreground font-semibold">2.3s</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground rounded-lg font-semibold py-6"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-primary/30 hover:bg-primary/10 text-primary rounded-lg font-semibold py-6"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Result
          </Button>
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-primary/30 hover:bg-primary/10 text-primary rounded-lg font-semibold py-6"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

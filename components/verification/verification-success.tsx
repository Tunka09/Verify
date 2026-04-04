'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Download, Share2, Home, AlertTriangle, Shield, Clock, User, FileText, Fingerprint, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Easing } from 'framer-motion'
import type { VerificationRecord } from '@/types/verification'

interface VerificationSuccessProps {
  result: VerificationRecord & { documentType?: string; verificationId?: string }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as Easing
    },
  },
}

// Animated progress ring
function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#c6f135'
}: {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="square"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-2xl md:text-3xl font-black"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        >
          {progress.toFixed(1)}%
        </motion.span>
      </div>
    </div>
  )
}

// Animated bar chart
function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={item.label}>
          <div className="flex justify-between mb-2">
            <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
            <span className="font-mono font-bold">{item.value > 0 ? `${item.value.toFixed(1)}%` : 'N/A'}</span>
          </div>
          <div className="h-6 bg-muted border-2 border-foreground overflow-hidden">
            <motion.div
              className="h-full"
              style={{ backgroundColor: item.color }}
              initial={{ width: 0 }}
              animate={{ width: item.value > 0 ? `${item.value}%` : '0%' }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.2 }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Stat card component
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay = 0
}: {
  icon: typeof Shield
  label: string
  value: string | number
  color: string
  delay?: number
}) {
  return (
    <motion.div
      className={`${color} p-4 md:p-6 border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)]`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -4, boxShadow: '6px 6px 0px var(--foreground)' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-foreground/10 border-2 border-foreground flex items-center justify-center">
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-foreground/70">{label}</span>
      </div>
      <p className="text-xl md:text-2xl font-black">{value}</p>
    </motion.div>
  )
}

// Confetti component
function Confetti({ count = 30 }: { count?: number }) {
  const [pieces, setPieces] = useState<Array<{ x: number; delay: number; color: string }>>([])

  useEffect(() => {
    const colors = ['#c6f135', '#ff6b9d', '#4ecdc4', '#ffd93d', '#6c5ce7']
    setPieces(
      Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    )
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 border-2 border-foreground"
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            rotate: Math.random() * 360,
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{
            y: '100vh',
            rotate: Math.random() * 720,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: piece.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}

export default function VerificationSuccess({ result }: VerificationSuccessProps) {
  const isVerified = result.verified
  const confidence = result.confidence || 0
  const [shareLabel, setShareLabel] = useState('Share Result')

  const chartData = [
    { label: 'Face Match', value: result.matchSimilarity || confidence, color: '#c6f135' },
    { label: 'Liveness', value: result.livenessConfidence || 0, color: '#4ecdc4' },
    { label: 'Document Auth', value: result.documentConfidence || 0, color: '#ff6b9d' },
  ]

  const handleDownload = () => {
    const lines = [
      'VERIFICATION CERTIFICATE',
      '========================',
      `Status:      ${isVerified ? 'VERIFIED' : 'REJECTED'}`,
      `Name:        ${result.userName || 'N/A'}`,
      `Document:    ${result.documentNumber || 'N/A'}`,
      `Confidence:  ${confidence.toFixed(1)}%`,
      result.livenessConfidence ? `Liveness:    ${result.livenessConfidence.toFixed(1)}%` : '',
      result.documentConfidence ? `Doc Auth:    ${result.documentConfidence.toFixed(1)}%` : '',
      result.elapsedTime ? `Duration:    ${result.elapsedTime}` : '',
      `Issued:      ${new Date().toISOString()}`,
    ].filter(Boolean).join('\n')

    const blob = new Blob([lines], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `verify-certificate-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const text = `Identity verification ${isVerified ? 'passed ✓' : 'failed ✗'} — ${confidence.toFixed(1)}% confidence. Powered by Verify.`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Verify Result', text })
      } else {
        await navigator.clipboard.writeText(text)
        setShareLabel('Copied!')
        setTimeout(() => setShareLabel('Share Result'), 2000)
      }
    } catch {
      // User cancelled or clipboard unavailable — silently ignore
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12 relative overflow-hidden">
      {/* Confetti for success */}
      {isVerified && <Confetti count={40} />}

      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-50" />

      {/* Decorative shapes */}
      <motion.div
        className="absolute top-20 right-10 w-16 h-16 bg-[#c6f135] border-3 border-foreground rotate-12 hidden lg:block"
        animate={{ rotate: [12, -12, 12] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-32 left-10 w-12 h-12 bg-[#ff6b9d] rounded-full border-3 border-foreground hidden lg:block"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="max-w-4xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-8 md:mb-12"
        >
          {/* Status icon */}
          <motion.div
            className={`inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 ${
              isVerified ? 'bg-[#c6f135]' : 'bg-[#ff6b6b]'
            } border-4 border-foreground shadow-[6px_6px_0px_var(--foreground)] mb-6`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {isVerified ? (
              <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-foreground" strokeWidth={2.5} />
            ) : (
              <XCircle className="w-12 h-12 md:w-16 md:h-16 text-white" strokeWidth={2.5} />
            )}
          </motion.div>

          {/* Status text */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isVerified ? (
              <span className="text-[#c6f135]">VERIFIED</span>
            ) : (
              <span className="text-[#ff6b6b]">REJECTED</span>
            )}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isVerified
              ? `Identity verified with ${confidence.toFixed(1)}% confidence`
              : `Verification failed. Minimum 60% required, got ${confidence.toFixed(1)}%`
            }
          </motion.p>
        </motion.div>

        {/* Main content grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left: User info card */}
          <motion.div
            variants={itemVariants}
            className="bg-card p-6 md:p-8 border-3 border-foreground shadow-[6px_6px_0px_var(--foreground)]"
          >
            <h3 className="text-lg font-black uppercase tracking-wider mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#4ecdc4] border-2 border-foreground flex items-center justify-center">
                <User className="w-4 h-4" />
              </span>
              Identity Details
            </h3>

            <div className="space-y-4">
              <div className="pb-4 border-b-2 border-foreground/10">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Full Name</p>
                <p className="text-xl md:text-2xl font-black">{result.userName || 'Pending'}</p>
              </div>

              <div className="pb-4 border-b-2 border-foreground/10">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Document Type</p>
                <p className="text-lg font-bold">{result.documentType || 'ID Document'}</p>
              </div>

              {result.documentNumber && (
                <div className="pb-4 border-b-2 border-foreground/10">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Document Number</p>
                  <p className="text-lg font-mono font-bold">{result.documentNumber}</p>
                </div>
              )}

              {result.verificationId && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Verification ID</p>
                  <p className="text-sm font-mono bg-muted px-3 py-2 border-2 border-foreground">{result.verificationId}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Confidence ring + bar chart */}
          <motion.div
            variants={itemVariants}
            className="bg-card p-6 md:p-8 border-3 border-foreground shadow-[6px_6px_0px_var(--foreground)]"
          >
            <h3 className="text-lg font-black uppercase tracking-wider mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#ff6b9d] border-2 border-foreground flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </span>
              Confidence Score
            </h3>

            <div className="flex justify-center mb-8">
              <ProgressRing
                progress={confidence}
                color={confidence >= 60 ? '#c6f135' : '#ff6b6b'}
              />
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 font-bold text-sm uppercase tracking-wider border-2 border-foreground mb-6 ${
              confidence >= 60 ? 'bg-[#c6f135]' : 'bg-[#ff6b6b] text-white'
            }`}>
              {confidence >= 60 ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Passed (60%+ required)
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Failed (60%+ required)
                </>
              )}
            </div>

            <BarChart data={chartData} />
          </motion.div>
        </div>

        {/* Stats grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon={Camera}
            label="Liveness"
            value={result.livenessConfidence ? `${result.livenessConfidence.toFixed(1)}%` : 'N/A'}
            color="bg-[#4ecdc4]"
            delay={0.6}
          />
          <StatCard
            icon={Fingerprint}
            label="Face Match"
            value={`${(result.matchSimilarity || confidence).toFixed(1)}%`}
            color="bg-[#c6f135]"
            delay={0.7}
          />
          <StatCard
            icon={FileText}
            label="Doc Auth"
            value={result.documentConfidence ? `${result.documentConfidence.toFixed(1)}%` : 'N/A'}
            color="bg-[#ff6b9d]"
            delay={0.8}
          />
          <StatCard
            icon={Clock}
            label="Time"
            value={result.elapsedTime || 'N/A'}
            color="bg-[#ffd93d]"
            delay={0.9}
          />
        </motion.div>

        {/* Action buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={handleDownload}
            className="flex-1 bg-[#c6f135] text-foreground hover:bg-[#d4f94a] border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] font-bold uppercase tracking-wider py-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--foreground)]"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 bg-background border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] font-bold uppercase tracking-wider py-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--foreground)] hover:bg-muted"
          >
            <Share2 className="w-5 h-5 mr-2" />
            {shareLabel}
          </Button>
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full bg-background border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] font-bold uppercase tracking-wider py-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--foreground)] hover:bg-muted"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Button>
          </Link>
        </motion.div>

        {/* Error banner */}
        {result.verified === false && confidence === 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-6 inline-flex items-center gap-2 bg-[#ff6b6b] text-white px-4 py-2 border-2 border-foreground"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold">No verification data received</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

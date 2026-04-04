'use client'

import { motion } from 'framer-motion'
import { CreditCard, ImageIcon, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

export default function ChooseMethodPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.span
              className="inline-flex items-center gap-2 bg-[#c6f135] text-foreground px-4 py-2 font-bold text-sm uppercase tracking-wider border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            >
              БАТАЛГААЖУУЛАЛТ
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">
              АРГАА СОНГОНО УУ
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Choose your verification method
            </p>
          </motion.div>

          {/* Method cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* ID Card */}
            <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
              <Link href="/verify">
                <motion.div
                  className="bg-[#c6f135] border-4 border-foreground p-8 cursor-pointer h-full"
                  style={{ boxShadow: '6px 6px 0px var(--foreground)' }}
                  whileHover={{ y: -5, boxShadow: '10px 10px 0px var(--foreground)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-14 h-14 bg-foreground flex items-center justify-center mb-5 border-2 border-foreground">
                    <CreditCard className="w-7 h-7 text-background" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-3">
                    ID Card
                  </h2>
                  <p className="text-sm font-medium text-foreground/70 mb-6 leading-relaxed">
                    Upload your Mongolian national ID front &amp; back. OCR reads your name, registration number, gender, dates, and verifies your face.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['OCR', 'Face Match', 'Liveness'].map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 border-foreground bg-foreground/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 font-black uppercase text-sm">
                    Start Verification
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Photo Compare */}
            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
              <Link href="/compare">
                <motion.div
                  className="bg-[#4ecdc4] border-4 border-foreground p-8 cursor-pointer h-full"
                  style={{ boxShadow: '6px 6px 0px var(--foreground)' }}
                  whileHover={{ y: -5, boxShadow: '10px 10px 0px var(--foreground)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-14 h-14 bg-foreground flex items-center justify-center mb-5 border-2 border-foreground">
                    <ImageIcon className="w-7 h-7 text-background" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-3">
                    Photo Compare
                  </h2>
                  <p className="text-sm font-medium text-foreground/70 mb-6 leading-relaxed">
                    Upload any photo or business card that contains a face image, then compare it against your actual face with a selfie.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Upload Photo', 'Face Match'].map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-bold uppercase tracking-wider border-2 border-foreground bg-foreground/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 font-black uppercase text-sm">
                    Start Comparing
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Scan, Sparkles, Book } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Easing } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.15, 
      ease: [0.25, 0.46, 0.45, 0.94] as Easing
    },
  },
}

const floatVariants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [-8, 8, -8],
    rotate: [-2, 2, -2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
}

// Decorative shapes component
function DecorativeShapes() {
  return (
    <>
      {/* Top left shape */}
      <motion.div
        className="absolute top-20 left-10 w-10 h-10 bg-[#3b82f6] border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] hidden md:block"
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 12 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
      />

      {/* Top right circle */}
      <motion.div
        className="absolute top-32 right-20 w-14 h-14 bg-[#06b6d4] rounded-full border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] hidden md:block"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 100 }}
      />

      {/* Bottom left circle */}
      <motion.div
        className="absolute bottom-40 left-20 w-8 h-8 bg-[#8b5cf6] rounded-full border-3 border-foreground shadow-[3px_3px_0px_var(--foreground)] hidden md:block"
        variants={floatVariants}
        initial="initial"
        animate="animate"
      />

      {/* Bottom right square */}
      <motion.div
        className="absolute bottom-32 right-32 w-10 h-10 bg-[#0ea5e9] border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] rotate-45 hidden md:block"
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 45 }}
        transition={{ delay: 0.9, type: 'spring', stiffness: 100 }}
      />

      {/* Floating sparkle */}
      <motion.div
        className="absolute top-1/3 right-1/4 hidden lg:block"
        variants={floatVariants}
        initial="initial"
        animate="animate"
      >
        <Sparkles className="w-6 h-6 text-[#3b82f6]" strokeWidth={2.5} />
      </motion.div>
    </>
  )
}

// Stats ticker component
function StatsTicker() {
  const stats = [
    'БАТАЛГААЖСАН: 2,847,392',
    'НАРИЙВЧЛАЛ: 99.7%',
    'ХУГАЦАА: 47мс',
    'ИДЭВХТЭЙ: 12,847',
    'БАТАЛГААЖСАН: 2,847,392',
    'НАРИЙВЧЛАЛ: 99.7%',
    'ХУГАЦАА: 47мс',
    'ИДЭВХТЭЙ: 12,847',
  ]

  return (
    <div className="w-full overflow-hidden bg-foreground py-3 border-y-4 border-foreground">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {stats.map((stat, i) => (
          <span key={i} className="text-background font-bold text-sm tracking-wider flex items-center gap-3">
            <span className="w-2 h-2 bg-[#3b82f6] rounded-full" />
            {stat}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-background">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-[0.15]" />
      
      {/* Decorative shapes */}
      <DecorativeShapes />

      {/* Main content */}
      <div className="flex-1 flex items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          className="max-w-7xl mx-auto w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 bg-[#3b82f6] text-white px-3 py-1.5 font-bold text-xs uppercase tracking-wide border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)]">
              <Sparkles className="w-3 h-3 flex-shrink-0" />
              AI-тэй Иргэний Үнэмлэх Баталгаажуулалт
            </span>
          </motion.div>

          {/* Main headline - Asymmetric layout */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter">
              <span className="block">НҮҮР</span>
              <span className="block text-[#3b82f6] relative inline-block">
                ТАНИХ
                <motion.span
                  className="absolute -right-3 -top-3 w-6 h-6 bg-[#06b6d4] rounded-full border-2 border-foreground hidden sm:block"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
              <span className="block text-[#06b6d4]">СИСТЕМ</span>
            </h1>
          </motion.div>

          {/* Description with marker highlight */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed"
          >
            Иргэний үнэмлэхээ оруулж, selfie авч,{' '}
            <span className="bg-[#3b82f6] px-1 text-white font-semibold">хэдхэн секундэд баталгаажуул</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-16"
          >
            <Link href="/choose-method" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="neo-btn w-full sm:w-auto bg-[#3b82f6] text-white hover:bg-[#2563eb] px-8 py-6 text-base gap-3"
              >
                <Scan className="w-5 h-5" />
                БАТАЛГААЖУУЛАХ
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/documentation" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="neo-btn w-full sm:w-auto bg-background hover:bg-muted px-8 py-6 text-base"
              >
                <Book className="w-5 h-5 mr-2" />
                БАРИМТ БИЧИГ
              </Button>
            </Link>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-3"
          >
            {[
              { label: 'Нүүр илрүүлэлт', color: 'bg-[#3b82f6]', textColor: 'text-white' },
              { label: 'Баримт OCR', color: 'bg-[#06b6d4]', textColor: 'text-foreground' },
              { label: 'Нүүр тааруулалт', color: 'bg-[#0ea5e9]', textColor: 'text-white' },
              { label: 'Хуурамч илрүүлэлт', color: 'bg-[#8b5cf6]', textColor: 'text-white' },
            ].map((feature, i) => (
              <motion.span
                key={feature.label}
                className={`${feature.color} ${feature.textColor} px-3 py-1.5 font-bold text-xs border-2 border-foreground shadow-[3px_3px_0px_var(--foreground)]`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ default: { delay: 0.8 + i * 0.1, type: 'spring', stiffness: 200 }, y: { duration: 0.15, ease: 'easeOut' }, boxShadow: { duration: 0.15, ease: 'easeOut' } }}
                whileHover={{ y: -3, boxShadow: '5px 5px 0px var(--foreground)', transition: { duration: 0.15, ease: 'easeOut' } }}
              >
                {feature.label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}

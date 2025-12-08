'use client'

import { motion } from 'framer-motion'
import { ChevronDown, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Brand */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex items-center justify-center gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary blur-xl opacity-75 animate-pulse"></div>
            <div className="relative bg-background p-3 rounded-lg border border-primary/30">
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Ирээдүйн танилт ба баталгаажуулалт
          </span>
          <br />
          <span className="text-2xl sm:text-3xl md:text-4xl text-muted-foreground">
 эндээс эхэлнэ
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Цэргийн түвшний AI дүүрний танихал, амьдралын илрүүлэлт, одноос танихчадвар 2035 оны эрин үеийн мэдрэлийн сүлжээнээр эрхэлүүлэв.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link href="/verify">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground border-primary/30 rounded-lg text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Туршиж үзэх 
            </Button>
          </Link>
          {/* <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 hover:bg-primary/10 text-primary rounded-lg font-semibold"
            >
              Боломжуудыг үзэх
            </Button>
          </Link> */}
        </motion.div>

        {/* Floating Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-block glassmorphism-dark px-6 py-3 rounded-full border border-primary/30 mb-16"
        >
          <span className="text-sm text-accent">
            ✨ Дэлхийн аж ахуйн платформуудаас итгэрүүлсэн
          </span>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center"
        >
          <ChevronDown className="w-6 h-6 text-primary/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}

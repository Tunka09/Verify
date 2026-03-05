'use client'

import { motion } from 'framer-motion'
import { Eye, Users, Shield, Zap, Lock, Brain, Scan, FileCheck, Fingerprint, Camera } from 'lucide-react'
import type { Easing } from 'framer-motion'

const features = [
  {
    icon: Eye,
    title: 'Biometric Analysis',
    description: 'Real-time facial recognition with anti-spoofing technology',
    color: 'bg-[#3b82f6]',
    textColor: 'text-white',
    size: 'large',
  },
  {
    icon: FileCheck,
    title: 'Document OCR',
    description: 'Extract data from IDs instantly',
    color: 'bg-[#06b6d4]',
    textColor: 'text-foreground',
    size: 'small',
  },
  {
    icon: Camera,
    title: 'Liveness Detection',
    description: 'Verify real presence',
    color: 'bg-[#0ea5e9]',
    textColor: 'text-white',
    size: 'small',
  },
  {
    icon: Shield,
    title: 'Fraud Prevention',
    description: 'Military-grade protection against deepfakes and document forgery',
    color: 'bg-[#8b5cf6]',
    textColor: 'text-white',
    size: 'medium',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Results in under 50ms',
    color: 'bg-[#1e40af]',
    textColor: 'text-white',
    size: 'small',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Zero data retention policy',
    color: 'bg-[#6366f1]',
    textColor: 'text-white',
    size: 'small',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
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

// Animated progress ring for one card
function ProgressRing({ progress = 97.3 }: { progress?: number }) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-foreground/10"
        />
        <motion.circle
          cx="48"
          cy="48"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-foreground"
          strokeLinecap="square"
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-black">{progress}%</span>
      </div>
    </div>
  )
}

// Live stats counter
function LiveCounter({ end = 2847392, label = 'Verified' }: { end?: number; label?: string }) {
  return (
    <div className="text-center">
      <motion.div
        className="text-3xl md:text-4xl font-black font-mono"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {end.toLocaleString()}
      </motion.div>
      <div className="text-sm text-muted-foreground font-bold uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  )
}

// Feature card component
function FeatureCard({ 
  feature, 
  index,
  className = ''
}: { 
  feature: typeof features[0]
  index: number
  className?: string
}) {
  const Icon = feature.icon
  const textColorClass = feature.textColor || 'text-foreground'
  
  return (
    <motion.div
      variants={itemVariants}
      className={`
        ${feature.color} 
        p-6 md:p-8
        border-3 border-foreground 
        shadow-[6px_6px_0px_var(--foreground)]
        transition-all duration-200
        hover:translate-x-[-3px] hover:translate-y-[-3px]
        hover:shadow-[9px_9px_0px_var(--foreground)]
        cursor-pointer
        relative overflow-hidden
        ${className}
      `}
      whileTap={{ scale: 0.98 }}
    >
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-foreground/10" />
      
      <div className="relative z-10">
        <div className={`w-14 h-14 bg-foreground/10 border-2 border-foreground flex items-center justify-center mb-4`}>
          <Icon className={`w-7 h-7 ${textColorClass}`} strokeWidth={2.5} />
        </div>
        
        <h3 className={`text-xl md:text-2xl font-black mb-2 ${textColorClass} uppercase tracking-tight`}>
          {feature.title}
        </h3>
        
        <p className={`${textColorClass} opacity-80 font-medium leading-relaxed`}>
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      {/* Section divider - zigzag pattern */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-foreground" />
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <motion.span 
                className="inline-block bg-[#3b82f6] text-white px-4 py-1 font-bold text-sm uppercase tracking-wider border-2 border-foreground shadow-[3px_3px_0px_var(--foreground)] mb-4"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                Features
              </motion.span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none">
                EVERYTHING YOU NEED
                <br />
                <span className="text-[#06b6d4]">TO VERIFY</span>
              </h2>
            </div>
            
            {/* Live accuracy stat */}
            <div className="bg-[#3b82f6] p-6 border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)]">
              <ProgressRing progress={97.3} />
              <p className="text-center text-sm font-bold mt-2 uppercase text-white">Accuracy Rate</p>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Large feature card - spans 2 cols */}
          <FeatureCard 
            feature={features[0]} 
            index={0} 
            className="lg:col-span-2 lg:row-span-2"
          />
          
          {/* Two small cards */}
          <FeatureCard feature={features[1]} index={1} />
          <FeatureCard feature={features[2]} index={2} />
          
          {/* Stats card */}
          <motion.div
            variants={itemVariants}
            className="bg-foreground text-background p-6 md:p-8 border-3 border-foreground flex flex-col justify-center items-center"
          >
            <LiveCounter end={2847392} label="Total Verified" />
          </motion.div>
          
          {/* Medium feature card */}
          <FeatureCard feature={features[3]} index={3} />
          
          {/* Two more small cards */}
          <FeatureCard feature={features[4]} index={4} />
          <FeatureCard feature={features[5]} index={5} />
        </motion.div>

        {/* Bottom stats bar */}
        <motion.div
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { value: '<50ms', label: 'Processing Time', color: 'bg-[#3b82f6]', textColor: 'text-white' },
            { value: '99.7%', label: 'Success Rate', color: 'bg-[#06b6d4]', textColor: 'text-foreground' },
            { value: '190+', label: 'Countries', color: 'bg-[#0ea5e9]', textColor: 'text-white' },
            { value: '24/7', label: 'Availability', color: 'bg-[#8b5cf6]', textColor: 'text-white' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`${stat.color} p-4 md:p-6 border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] text-center`}
              whileHover={{ y: -4, boxShadow: '6px 6px 0px var(--foreground)' }}
            >
              <div className={`text-2xl md:text-3xl font-black ${stat.textColor}`}>{stat.value}</div>
              <div className={`text-sm font-bold uppercase tracking-wider mt-1 ${stat.textColor} opacity-80`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

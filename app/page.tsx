'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Zap, Eye, Users, Shield } from 'lucide-react'
import Particles from '@/components/particles'
import NeuralNetwork from '@/components/neural-network'
import { Button } from '@/components/ui/button'
import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/features-section'
import CTASection from '@/components/cta-section'

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-hidden dark">
      <Particles />
      <NeuralNetwork />
      
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </div>
    </div>
  )
}

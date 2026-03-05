'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Scan, Calendar, Star, Check } from 'lucide-react'
import type { Easing } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94] as Easing
    },
  },
}

// Floating testimonial cards
function TestimonialCard({ 
  quote, 
  author, 
  role, 
  color,
  rotation = 0
}: { 
  quote: string
  author: string
  role: string
  color: string
  rotation?: number
}) {
  return (
    <motion.div
      className={`${color} p-6 border-3 border-foreground shadow-[6px_6px_0px_var(--foreground)] max-w-sm`}
      style={{ rotate: rotation }}
      whileHover={{ rotate: 0, scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-foreground text-foreground" />
        ))}
      </div>
      <p className="font-bold text-foreground mb-4 leading-relaxed">"{quote}"</p>
      <div className="border-t-2 border-foreground/30 pt-3">
        <p className="font-black text-foreground">{author}</p>
        <p className="text-sm text-foreground/70 font-medium">{role}</p>
      </div>
    </motion.div>
  )
}

export default function CTASection() {
  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-foreground text-background overflow-hidden">
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-10 left-10 w-20 h-20 bg-[#c6f135] border-3 border-background rotate-12 hidden lg:block"
        animate={{ rotate: [12, -12, 12] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-16 h-16 bg-[#ff6b9d] rounded-full border-3 border-background hidden lg:block"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute top-1/2 right-10 w-12 h-12 bg-[#4ecdc4] border-3 border-background hidden lg:block"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Left side - Main CTA */}
          <div>
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 bg-[#c6f135] text-foreground px-4 py-2 font-bold text-sm uppercase tracking-wider border-3 border-background shadow-[4px_4px_0px_var(--background)] mb-8">
                <Star className="w-4 h-4 fill-foreground" />
                Start Free Today
              </span>
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] mb-6"
            >
              READY TO
              <br />
              <span className="text-[#c6f135]">VERIFY?</span>
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-background/70 mb-8 max-w-md leading-relaxed"
            >
              Join thousands of businesses using our AI-powered verification system. No credit card required.
            </motion.p>

            {/* Feature checklist */}
            <motion.ul variants={itemVariants} className="space-y-3 mb-10">
              {[
                'Instant verification results',
                'No setup required',
                'Enterprise-grade security',
                'Free tier available',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#c6f135] border-2 border-background flex items-center justify-center">
                    <Check className="w-4 h-4 text-foreground" strokeWidth={3} />
                  </span>
                  <span className="font-bold">{item}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/verify">
                <Button
                  size="lg"
                  className="bg-[#c6f135] text-foreground hover:bg-[#d4f94a] border-3 border-background shadow-[4px_4px_0px_var(--background)] font-bold uppercase tracking-wider px-8 py-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--background)]"
                >
                  <Scan className="w-5 h-5 mr-2" />
                  Start Verification
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-3 border-background text-background hover:bg-background hover:text-foreground shadow-[4px_4px_0px_var(--background)] font-bold uppercase tracking-wider px-8 py-6 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--background)]"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Demo
              </Button>
            </motion.div>
          </div>

          {/* Right side - Testimonials stack */}
          <motion.div 
            variants={itemVariants}
            className="relative hidden lg:block"
          >
            <div className="space-y-6">
              <TestimonialCard
                quote="Verification time dropped from 2 minutes to under 5 seconds. Game changer!"
                author="Sarah Chen"
                role="CTO, FinanceApp"
                color="bg-[#c6f135]"
                rotation={-3}
              />
              <TestimonialCard
                quote="The accuracy is incredible. We've virtually eliminated fraud."
                author="Marcus Johnson"
                role="Security Lead, TrustBank"
                color="bg-[#ff6b9d]"
                rotation={2}
              />
              <TestimonialCard
                quote="Best onboarding experience our users have ever had."
                author="Yuki Tanaka"
                role="Product Manager, GlobalID"
                color="bg-[#4ecdc4]"
                rotation={-1}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 pt-12 border-t-4 border-background/20"
        >
          <p className="text-center text-background/50 font-bold uppercase tracking-wider text-sm mb-8">
            Trusted by leading companies worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {['TechCorp', 'FinanceHub', 'SecureBank', 'GlobalTrust', 'DataSafe'].map((company, i) => (
              <motion.span
                key={company}
                className="text-xl md:text-2xl font-black text-background/40 hover:text-background/70 transition-colors cursor-default"
                whileHover={{ scale: 1.05 }}
              >
                {company}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

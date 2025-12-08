'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20"></div>
      </div>

      <motion.div
        className="text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Ирээдүй рүү алхахад бэлэн үү?
        </h2>

        <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
          NeuroVerify-г ашиглан дараагийн үеийн танилт, баталгаажуулалтыг хийж буй мянга мянган байгууллагуудтай нэгдээрэй.
        </p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link href="/verify">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground border-primary/30 rounded-lg text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              Үнэгүй баталгаажуулалт эхлүүлэх
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/30 hover:bg-primary/10 text-primary rounded-lg font-semibold"
          >
            Демо цаг товлох
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 pt-16 border-t border-primary/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              99.9%
            </div>
            <p className="text-sm text-muted-foreground mt-2">Нарийвчлал</p>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              {'<'}50ms
            </div>
            <p className="text-sm text-muted-foreground mt-2">Боловсруулах хугацаа</p>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              10M+
            </div>
            <p className="text-sm text-muted-foreground mt-2">Өдөрт хийгдэх шалгалт</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

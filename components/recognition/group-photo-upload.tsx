'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GroupPhotoUploadProps {
  onUpload: (image: string) => void
}

export default function GroupPhotoUpload({ onUpload }: GroupPhotoUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setUploadedImage(result)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!uploadedImage) return

    setProcessing(true)
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    onUpload(uploadedImage)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 glassmorphism-dark rounded-full border border-primary/30">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent">Алдартнуудыг таних</span>
          </div>
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Зураг дээрх хүмүүсийг таних
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Хиймэл оюун ухааны тусламжтайгаар алдартнууд, олны танил хүмүүс болон танилуудаа бүлэг зураг дээрээс шууд танихын тулд зургаа оруулна уу.
          </p>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
            className="hidden"
            id="photo-upload"
          />
          <label htmlFor="photo-upload">
            <div
              className={`cursor-pointer glassmorphism-dark p-12 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 text-center group ${
                uploadedImage ? 'border-accent' : ''
              }`}
            >
              {uploadedImage ? (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="relative w-full max-w-sm mx-auto rounded-lg overflow-hidden border border-accent/30">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none"></div>
                  </div>
                  <p className="text-sm text-accent font-semibold">
                    Зураг шинжлэхэд бэлэн
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-primary group-hover:text-accent transition-colors" />
                  <div>
                    <p className="font-semibold text-foreground text-lg">
                      Зургаа энд чирж оруулна уу
                    </p>
                    <p className="text-sm text-muted-foreground">
                      эсвэл дарж сонгоно уу
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG дээд тал нь 50MB. 2-50 хүнтэй бүлэг зураг илүү тохиромжтой.
                  </p>
                </div>
              )}
            </div>
          </label>
        </motion.div>

        {/* CTA Button */}
        {uploadedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Button
              onClick={handleAnalyze}
              disabled={processing}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground rounded-lg font-semibold py-6 text-lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Зургийг шинжилж байна...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Хүмүүсийг таних
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid md:grid-cols-3 gap-4"
        >
          <div className="glassmorphism-dark p-4 rounded-lg border border-primary/20">
            <p className="text-2xl font-black text-primary mb-1">10M+</p>
            <p className="text-xs text-muted-foreground">Алдартнуудын сан</p>
          </div>
          <div className="glassmorphism-dark p-4 rounded-lg border border-primary/20">
            <p className="text-2xl font-black text-accent mb-1">99.2%</p>
            <p className="text-xs text-muted-foreground">Нарийвчлал</p>
          </div>
          <div className="glassmorphism-dark p-4 rounded-lg border border-primary/20">
            <p className="text-2xl font-black text-secondary mb-1">{'<'}1s</p>
            <p className="text-xs text-muted-foreground">Таних хурд</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

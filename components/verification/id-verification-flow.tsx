'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { extractDocument } from '@/lib/verification-service'

interface IDVerificationFlowProps {
  onComplete: (data: ExtractedDocumentData) => void
  onUpload: (front?: string, back?: string) => void
}

interface ExtractedDocumentData {
  name?: string
  idNumber?: string
  documentNumber?: string
  dateOfBirth?: string
  expiry?: string
  issuedCountry?: string
  documentType?: string
  authenticity?: number
  confidence?: number
  backData?: any
}

export default function IDVerificationFlow({
  onComplete,
  onUpload,
}: IDVerificationFlowProps) {
  const [frontImage, setFrontImage] = useState<string | null>(null)
  const [backImage, setBackImage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (side: 'front' | 'back', file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (side === 'front') {
        setFrontImage(result)
        onUpload(result)
      } else {
        setBackImage(result)
        onUpload(undefined, result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleExtract = async () => {
    if (!frontImage) {
      setError('Мэдээллийг уншихын тулд урд талын зураг шаардлагатай')
      return
    }

    setError(null)
    setScanning(true)
    try {
      const frontResult = await extractDocument(frontImage, 'front')
      // Backend: { success, data: { name, idNumber, confidence, ... } }
      const parsedFront = frontResult.data || frontResult

      let backResult = null
      if (backImage) {
        backResult = await extractDocument(backImage, 'back')
      }

      const combined: ExtractedDocumentData = {
        name: parsedFront.name,
        idNumber: parsedFront.idNumber,
        documentNumber: parsedFront.idNumber,
        confidence: parsedFront.confidence,
        dateOfBirth: parsedFront.dateOfBirth || undefined,
        authenticity: parsedFront.confidence || 95,
        backData: backResult?.data || backResult || undefined,
      }

      setExtractedData(combined)
      onComplete(combined)
    } catch (err) {
      console.error('Extraction failed', err)
      setError('Бичиг баримтын мэдээллийг уншиж чадсангүй. Дахин оролдоно уу.')
    } finally {
      setScanning(false)
    }
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
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Иргэний үнэмлэхээ баталгаажуулах
          </h1>
          <p className="text-muted-foreground text-lg">
            Бичиг баримтынхаа урд болон ар талын зургийг оруулна уу
          </p>
        </div>

        {/* Upload Area */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Front Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload('front', file)
                }}
                className="hidden"
                id="front-upload"
              />
              <label htmlFor="front-upload">
                <div
                  className={`cursor-pointer glassmorphism-dark p-12 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 text-center group ${
                    frontImage ? 'border-accent' : ''
                  }`}
                >
                  {frontImage ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-accent/30">
                        <img
                          src={frontImage || "/placeholder.svg"}
                          alt="ID Front"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none"></div>
                      </div>
                      <p className="text-sm text-accent font-semibold">
                        Урд тал орсон
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-8 h-8 mx-auto text-primary group-hover:text-accent transition-colors" />
                      <p className="font-semibold text-foreground">
                        Урд тал оруулах
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG эсвэл JPG, дээд тал нь 10MB
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </motion.div>

          {/* Back Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload('back', file)
                }}
                className="hidden"
                id="back-upload"
              />
              <label htmlFor="back-upload">
                <div
                  className={`cursor-pointer glassmorphism-dark p-12 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 text-center group ${
                    backImage ? 'border-accent' : ''
                  }`}
                >
                  {backImage ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-accent/30">
                        <img
                          src={backImage || "/placeholder.svg"}
                          alt="ID Back"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none"></div>
                      </div>
                      <p className="text-sm text-accent font-semibold">
                        Back uploaded
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-8 h-8 mx-auto text-primary group-hover:text-accent transition-colors" />
                      <p className="font-semibold text-foreground">
                        Ар тал оруулах
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG эсвэл JPG, дээд тал нь 10MB
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </motion.div>
        </div>

        {/* Extract Data */}
        {frontImage && !extractedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Button
              onClick={handleExtract}
              disabled={scanning}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground rounded-lg font-semibold py-6 text-lg"
            >
              {scanning ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Уншиж байна...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Бичиг баримтын мэдээллийг унших
                </>
              )}
            </Button>
          </motion.div>
        )}

        {error && (
          <p className="text-destructive text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* Extracted Data Display */}
        {extractedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 glassmorphism-dark p-8 rounded-xl border border-primary/30 space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-accent" />
              <h3 className="text-xl font-bold text-accent">
                Бичиг баримт амжилттай уншигдлаа
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Овог нэр</p>
                <p className="font-semibold text-foreground">
                  {extractedData.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Төрсөн огноо
                </p>
                <p className="font-semibold text-foreground">
                  {extractedData.dateOfBirth}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Бичиг баримтын дугаар
                </p>
                <p className="font-semibold text-foreground">
                  {extractedData.documentNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Дуусах хугацаа</p>
                <p className="font-semibold text-foreground">
                  {extractedData.expiry}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Олгосон улс
                </p>
                <p className="font-semibold text-foreground">
                  {extractedData.issuedCountry}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Баталгаажуулалтын оноо
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-accent">
                    {extractedData.authenticity}%
                  </p>
                  <div className="w-24 h-2 bg-primary/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{
                        width: `${extractedData.authenticity}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => extractedData && onComplete(extractedData)}
              disabled={!extractedData}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-foreground rounded-lg font-semibold py-6 disabled:opacity-70"
            >
              Амьд эсэхийг шалгах руу шилжих
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

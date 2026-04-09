'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Loader2, CheckCircle, Camera, ArrowRight, X, AlertCircle, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { extractDocument } from '@/lib/verification-service'
import type { Easing } from 'framer-motion'
import type { ExtractedDocumentData } from '@/types/verification'

interface IDVerificationFlowProps {
  onComplete: (data: ExtractedDocumentData) => void
  onUpload: (front?: string, back?: string) => void
}

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94] as Easing
    },
  },
}

// Step indicator component
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: 'Upload', icon: Upload },
    { label: 'Scan', icon: Camera },
    { label: 'Verify', icon: CheckCircle },
  ]

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => {
        const Icon = step.icon
        const isActive = i === currentStep
        const isCompleted = i < currentStep
        
        return (
          <div key={step.label} className="flex items-center gap-2">
            <motion.div
              className={`
                w-10 h-10 flex items-center justify-center border-3 border-foreground
                ${isActive ? 'bg-[#c6f135]' : isCompleted ? 'bg-[#4ecdc4]' : 'bg-muted'}
                ${isActive ? 'shadow-[3px_3px_0px_var(--foreground)]' : ''}
              `}
              animate={isActive ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
            >
              <Icon className="w-5 h-5" strokeWidth={2.5} />
            </motion.div>
            <span className={`text-sm font-bold uppercase tracking-wider hidden sm:block ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-8 h-1 mx-2 ${i < currentStep ? 'bg-[#4ecdc4]' : 'bg-muted'} border border-foreground`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Rotate a base64 image 90 degrees clockwise using canvas
function rotateImage90(base64: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.height
      canvas.height = img.width
      const ctx = canvas.getContext('2d')!
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(Math.PI / 2)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)
      resolve(canvas.toDataURL('image/jpeg', 0.92))
    }
    img.src = base64
  })
}

// Upload zone component
function UploadZone({
  side,
  image,
  onUpload,
  onRotate,
  isActive = false
}: {
  side: 'front' | 'back'
  image: string | null
  onUpload: (file: File) => void
  onRotate?: (rotated: string) => void
  isActive?: boolean
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isBlurred, setIsBlurred] = useState(true) // Default: blurred for privacy
  const [rotating, setRotating] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onUpload(file)
    }
  }, [onUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const colors = {
    front: { bg: 'bg-[#c6f135]', label: 'Front Side' },
    back: { bg: 'bg-[#4ecdc4]', label: 'Back Side' },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: side === 'front' ? 0.1 : 0.2 }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onUpload(file)
        }}
        className="hidden"
        id={`${side}-upload`}
      />
      <label htmlFor={`${side}-upload`}>
        <motion.div
          className={`
            cursor-pointer p-6 md:p-8 border-4 border-foreground
            transition-all duration-200 relative overflow-hidden
            ${isDragging ? 'bg-[#c6f135] border-solid' : image ? colors[side].bg : 'bg-muted border-dashed'}
            ${!image ? 'hover:bg-[#c6f135]/50' : ''}
          `}
          style={{
            boxShadow: image || isDragging ? '6px 6px 0px var(--foreground)' : '4px 4px 0px var(--foreground)',
          }}
          whileHover={!image ? { y: -4, boxShadow: '8px 8px 0px var(--foreground)' } : {}}
          whileTap={{ scale: 0.98 }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Label badge */}
          <div className={`absolute top-0 left-0 ${colors[side].bg} px-3 py-1 border-r-3 border-b-3 border-foreground`}>
            <span className="text-xs font-black uppercase tracking-wider">{colors[side].label}</span>
          </div>

          {image ? (
            <div className="pt-6">
              <div className="relative w-full h-40 md:h-48 border-3 border-foreground overflow-hidden bg-white">
                <img
                  src={image}
                  alt={`ID ${side}`}
                  className={`w-full h-full object-cover transition-all duration-300 ${isBlurred ? 'blur-lg' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                
                {/* Privacy overlay with toggle */}
                {isBlurred && (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 bg-foreground/80 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="text-xs font-bold text-foreground/80">Нууцлагдсан</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Toggle blur + rotate buttons */}
              <div className="flex items-center justify-between mt-4">
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <CheckCircle className="w-5 h-5 text-foreground" strokeWidth={2.5} />
                  <span className="font-bold text-foreground">Uploaded</span>
                </motion.div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={rotating}
                    onClick={async (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (!image || !onRotate) return
                      setRotating(true)
                      const rotated = await rotateImage90(image)
                      onRotate(rotated)
                      setRotating(false)
                    }}
                    className="px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-foreground bg-[#ffd93d] hover:bg-[#ffc600] transition-all duration-200 disabled:opacity-50 flex items-center gap-1"
                  >
                    <RotateCw className={`w-3 h-3 ${rotating ? 'animate-spin' : ''}`} />
                    Rotate
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setIsBlurred(!isBlurred)
                    }}
                    className={`
                      px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-foreground
                      transition-all duration-200
                      ${isBlurred ? 'bg-muted hover:bg-foreground/10' : 'bg-[#ff6b6b] text-white hover:bg-[#ff5252]'}
                    `}
                  >
                    {isBlurred ? '👁 Харах' : '🔒 Нуух'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-8 text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-foreground/10 border-3 border-foreground flex items-center justify-center"
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Upload className="w-8 h-8" strokeWidth={2} />
              </motion.div>
              <p className="font-black text-lg mb-2 uppercase">
                {isDragging ? 'Drop it!' : 'Upload Image'}
              </p>
              <p className="text-sm text-muted-foreground font-medium">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG up to 10MB
              </p>
            </div>
          )}
        </motion.div>
      </label>
    </motion.div>
  )
}

// Extracted data display
function ExtractedDataCard({ data, onContinue }: { data: ExtractedDocumentData; onContinue: () => void }) {
  const fullName = data.surname && data.givenName
    ? `${data.surname} ${data.givenName}`
    : data.name

  const fields = [
    { label: 'Full Name', value: fullName },
    { label: 'Family Name', value: data.familyName },
    { label: 'Gender', value: data.gender },
    { label: 'Date of Birth', value: data.dateOfBirth },
    { label: 'Registration Number', value: data.registrationNumber || data.documentNumber || data.idNumber },
    { label: 'Date of Issue', value: data.dateOfIssue },
    { label: 'Date of Expiry', value: data.expiry },
    { label: 'Confidence Score', value: data.confidence ? `${data.confidence.toFixed(1)}%` : undefined },
  ].filter(f => f.value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="bg-card p-6 md:p-8 border-3 border-foreground shadow-[6px_6px_0px_var(--foreground)]"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#c6f135] border-3 border-foreground flex items-center justify-center">
          <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight">Document Scanned</h3>
          <p className="text-sm text-muted-foreground font-medium">Information extracted successfully</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {fields.map((field, i) => (
          <motion.div
            key={field.label}
            className="bg-muted p-4 border-2 border-foreground"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              {field.label}
            </p>
            <p className="font-bold text-lg">{field.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Confidence bar */}
      {data.confidence && (
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold uppercase tracking-wider">Document Authenticity</span>
            <span className="font-mono font-bold">{data.confidence.toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-muted border-2 border-foreground overflow-hidden">
            <motion.div
              className="h-full bg-[#c6f135]"
              initial={{ width: 0 }}
              animate={{ width: `${data.confidence}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      <Button
        onClick={onContinue}
        className="w-full bg-[#c6f135] text-foreground hover:bg-[#d4f94a] border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] font-bold uppercase tracking-wider py-6 text-lg transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--foreground)]"
      >
        Continue to Liveness Check
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </motion.div>
  )
}

export default function IDVerificationFlow({
  onComplete,
  onUpload,
}: IDVerificationFlowProps) {
  const [frontImage, setFrontImage] = useState<string | null>(null)
  const [backImage, setBackImage] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedDocumentData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currentStep = extractedData ? 2 : frontImage ? 1 : 0

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
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleExtract = async () => {
    if (!frontImage) {
      setError('Please upload the front side of your ID')
      return
    }

    setError(null)
    setScanning(true)
    try {
      const frontResult = await extractDocument(frontImage, 'front')
      const parsedFront = frontResult.data || frontResult

      let backResult = null
      if (backImage) {
        backResult = await extractDocument(backImage, 'back')
      }

      const parsedBack = backResult?.data || backResult || {}

      const surname = parsedFront.surname || ''
      const givenName = parsedFront.givenName || ''
      const fullName = surname && givenName
        ? `${surname} ${givenName}`
        : parsedFront.name

      const combined: ExtractedDocumentData = {
        name: fullName,
        familyName: parsedFront.familyName || undefined,
        surname: surname || undefined,
        givenName: givenName || undefined,
        gender: parsedFront.gender || undefined,
        idNumber: parsedFront.idNumber || parsedFront.registrationNumber,
        documentNumber: parsedFront.idNumber || parsedFront.registrationNumber,
        registrationNumber: parsedFront.registrationNumber || parsedFront.idNumber,
        confidence: parsedFront.confidence,
        dateOfBirth: parsedFront.dateOfBirth || undefined,
        dateOfIssue: parsedBack.dateOfIssue || undefined,
        expiry: parsedBack.expiry || parsedBack.dateOfExpiry || undefined,
        authenticity: parsedFront.confidence || 95,
        backData: parsedBack,
      }

      setExtractedData(combined)
    } catch (err) {
      console.error('Extraction failed', err)
      setError('Failed to extract document data. Please try again.')
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      {/* Background pattern */}
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />

      <motion.div
        className="max-w-3xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.span 
            className="inline-flex items-center gap-2 bg-[#4ecdc4] text-foreground px-4 py-2 font-bold text-sm uppercase tracking-wider border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <FileText className="w-4 h-4" />
            Step 1 of 3
          </motion.span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-4">
            UPLOAD YOUR <span className="text-[#c6f135]">ID</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Upload clear photos of your identity document for verification
          </p>
        </motion.div>

        {/* Step indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Upload or Results */}
        <AnimatePresence mode="wait">
          {!extractedData ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Upload zones */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <UploadZone
                  side="front"
                  image={frontImage}
                  onUpload={(file) => handleImageUpload('front', file)}
                  onRotate={(rotated) => { setFrontImage(rotated); onUpload(rotated) }}
                  isActive={!frontImage}
                />
                <UploadZone
                  side="back"
                  image={backImage}
                  onUpload={(file) => handleImageUpload('back', file)}
                  onRotate={(rotated) => { setBackImage(rotated); onUpload(undefined, rotated) }}
                />
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  className="flex items-center gap-3 bg-[#ff6b6b] text-white p-4 border-3 border-foreground mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-bold">{error}</span>
                  <button onClick={() => setError(null)} className="ml-auto">
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* Scan button */}
              {frontImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    onClick={handleExtract}
                    disabled={scanning}
                    className="w-full bg-[#c6f135] text-foreground hover:bg-[#d4f94a] border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)] font-bold uppercase tracking-wider py-6 text-lg transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_var(--foreground)] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {scanning ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Scanning Document...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 mr-2" />
                        Scan Document
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <ExtractedDataCard
              key="results"
              data={extractedData}
              onContinue={() => onComplete(extractedData)}
            />
          )}
        </AnimatePresence>

        {/* Tips section */}
        <motion.div
          variants={itemVariants}
          className="mt-12 grid md:grid-cols-3 gap-4"
        >
          {[
            { title: 'Good Lighting', desc: 'Ensure clear, even lighting' },
            { title: 'Flat Surface', desc: 'Place ID on a flat background' },
            { title: 'Full Frame', desc: 'Capture all corners of the ID' },
          ].map((tip, i) => (
            <div 
              key={tip.title}
              className="bg-muted p-4 border-2 border-foreground text-center"
            >
              <p className="font-bold text-sm uppercase tracking-wider mb-1">{tip.title}</p>
              <p className="text-xs text-muted-foreground">{tip.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

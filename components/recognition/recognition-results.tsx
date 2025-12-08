'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Person {
  id: string
  name: string
  role: string
  confidence: number
  position: { x: number; y: number; width: number; height: number }
  bio: string
  wikipedia?: string
  social?: { twitter?: string; instagram?: string }
}

interface RecognitionResultsProps {
  image: string | null
  recognitionData: {
    detectedFaces: number
    people: Person[]
    processingTime: number
  }
  onStartOver: () => void
}

export default function RecognitionResults({
  image,
  recognitionData,
  onStartOver,
}: RecognitionResultsProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  // Mock data - in real app, this comes from backend
  const mockPeople: Person[] = [
    {
      id: '1',
      name: 'Emma Stone',
      role: 'Academy Award-winning actress',
      confidence: 99.2,
      position: { x: 10, y: 15, width: 25, height: 35 },
      bio: 'American actress known for La La Land and Poor Things.',
      wikipedia: 'https://en.wikipedia.org/wiki/Emma_Stone',
      social: { instagram: '@emmastone', twitter: '@emmastone' },
    },
    {
      id: '2',
      name: 'Ryan Gosling',
      role: 'Award-winning actor',
      confidence: 98.7,
      position: { x: 40, y: 20, width: 25, height: 35 },
      bio: 'Canadian actor known for La La Land and Blade Runner 2049.',
      wikipedia: 'https://en.wikipedia.org/wiki/Ryan_Gosling',
      social: { instagram: '@ryangosling' },
    },
    {
      id: '3',
      name: 'Zendaya',
      role: 'Actress & Singer',
      confidence: 97.5,
      position: { x: 70, y: 25, width: 25, height: 35 },
      bio: 'American actress and singer known for Euphoria and Spider-Man films.',
      wikipedia: 'https://en.wikipedia.org/wiki/Zendaya',
      social: { instagram: '@zendaya', twitter: '@Zendaya' },
    },
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Танилтын үр дүн
            </h1>
            <p className="text-muted-foreground">
              {mockPeople.length} хүн илэрлээ. Хугацаа: {recognitionData.processingTime.toFixed(2)}s
            </p>
          </div>
          <Link href="/">
            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary/10"
            >
              ← Нүүр хуудас руу буцах
            </Button>
          </Link>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Image with Detection Overlays */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <div className="relative rounded-xl overflow-hidden border-2 border-primary/30 group">
              <img
                src={image || "/placeholder.svg"}
                alt="Analyzed photo"
                className="w-full"
              />

              {/* Detection Boxes */}
              {mockPeople.map((person) => (
                <motion.div
                  key={person.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${person.position.x}%`,
                    top: `${person.position.y}%`,
                    width: `${person.position.width}%`,
                    height: `${person.position.height}%`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedPerson(person)}
                >
                  <div className="w-full h-full border-2 border-accent rounded-lg hover:shadow-2xl hover:shadow-accent/50 transition-all duration-300 flex items-center justify-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-gradient-to-r from-primary to-accent px-3 py-1 rounded text-xs font-bold text-background whitespace-nowrap transform -translate-y-8">
                      {person.confidence.toFixed(1)}%
                    </div>
                  </div>

                  {/* Animated Corner Brackets */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <rect
                      x="5"
                      y="5"
                      width="90"
                      height="90"
                      fill="none"
                      stroke="url(#grad)"
                      strokeWidth="0.5"
                      opacity="0.5"
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00f0ff" />
                        <stop offset="100%" stopColor="#ff006e" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              ))}

              {/* Scan Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-accent/20 scan-line pointer-events-none"></div>
            </div>
          </motion.div>

          {/* People List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Илэрсэн хүмүүс
              </h2>

              {mockPeople.map((person) => (
                <motion.div
                  key={person.id}
                  className="glassmorphism-dark p-4 rounded-lg border border-primary/20 cursor-pointer hover:border-primary/50 transition-all duration-300"
                  onClick={() => setSelectedPerson(person)}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-foreground">{person.name}</h3>
                    <div className="flex items-center gap-1 px-2 py-1 bg-primary/20 rounded text-xs font-semibold text-accent">
                      {person.confidence.toFixed(1)}%
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {person.role}
                  </p>

                  {/* Confidence Bar */}
                  <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${person.confidence}%` }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}

              {/* Action Button */}
              <Button
                onClick={onStartOver}
                variant="outline"
                className="w-full border-primary/30 hover:bg-primary/10 text-primary rounded-lg mt-6"
              >
                Өөр зураг шинжлэх
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPerson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPerson(null)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full glassmorphism-dark p-8 rounded-xl border border-primary/30"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPerson(null)}
                className="absolute top-4 right-4 p-2 hover:bg-primary/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>

              {/* Person Details */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {selectedPerson.name}
                </h2>
                <p className="text-sm text-accent font-semibold mb-4">
                  Нарийвчлал: {selectedPerson.confidence.toFixed(1)}%
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  {selectedPerson.role}
                </p>
                <p className="text-sm leading-relaxed">{selectedPerson.bio}</p>
              </div>

              {/* Links */}
              {(selectedPerson.wikipedia || selectedPerson.social) && (
                <div className="space-y-3 pt-6 border-t border-primary/20">
                  {selectedPerson.wikipedia && (
                    <a href={selectedPerson.wikipedia} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full gap-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg">
                        <ExternalLink className="w-4 h-4" />
                        Wikipedia үзэх
                      </Button>
                    </a>
                  )}
                  {selectedPerson.social?.instagram && (
                    <a href={`https://instagram.com/${selectedPerson.social.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full gap-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm">
                        {selectedPerson.social.instagram}
                      </Button>
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

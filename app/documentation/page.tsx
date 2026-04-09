'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ChevronRight, 
  ChevronDown,
  ArrowLeft,
  Book, 
  Code2, 
  Database, 
  Shield, 
  Zap, 
  Users,
  Layers,
  FileCode,
  TestTube,
  CheckCircle,
  Settings,
  GitBranch,
  Cpu,
  Camera,
  FileText,
  Target,
  BarChart3,
  Server,
  Globe
} from 'lucide-react'

// Documentation sections based on LaTeX content
const sections = [
  {
    id: 'introduction',
    title: 'Удиртгал',
    titleEn: 'Introduction',
    icon: Book,
    color: 'bg-[#3b82f6]',
    content: `Сүүлийн жилүүдэд дижитал шилжилтийн хүрээнд хэрэглэгчийг алсаас бүртгэх (remote onboarding), цахим үйлчилгээ нээх, санхүүгийн салбарын KYC/eKYC (Know Your Customer) процессууд эрчимтэй нэмэгдэж байна.

Энэхүү төсөл нь NeuroVerify - AI Identity Verification System бөгөөд Монгол хэлний интерфэйстэй, веб орчинд ажиллах identity verification урсгалыг бүрэн хэрэгжүүлсэн full-stack систем юм.`,
  },
  {
    id: 'goals',
    title: 'Зорилго',
    titleEn: 'Goals',
    icon: Target,
    color: 'bg-[#06b6d4]',
    content: `Веб орчинд хэрэглэгчийн иргэний үнэмлэх (эсвэл паспорт) болон селфи зураг дээр тулгуурлан тухайн хүн мөн эсэхийг хиймэл оюун (AI) аргаар үнэлэх, мөн хуурилтаас сэргийлэх зорилгоор liveness шалгалтын урсгалыг дэмжих иж бүрэн систем боловсруулах.`,
    subItems: [
      'Иргэний үнэмлэх/паспортын зураг оруулах урсгал боловсруулах',
      'Селфи зураг авах/оруулах алхам хэрэгжүүлэх',
      'Нүүр илрүүлэлт, embedding үүсгэх, тааралтыг хувь болгон тооцох API',
      'Амьд эсэхийг шалгах (liveness) UX урсгал',
      'Монгол хэл дээр ойлгомжтой интерфэйс',
      'Тестлэл, логжилт, алдааны боловсруулалт',
    ],
  },
  {
    id: 'research',
    title: 'Сэдвийн судалгаа',
    titleEn: 'Literature Review',
    icon: FileText,
    color: 'bg-[#8b5cf6]',
    content: `Identity verification системийн түгээмэл архитектур нь дараах гурван үндсэн блокоос бүрддэг:`,
    blocks: [
      {
        title: 'ID Check (Баримт шалгалт)',
        description: 'Засгийн газрын бичиг баримтын зураг, чанар, мэдээллийн уялдаа, хүчинтэй эсэхийг шалгана',
      },
      {
        title: 'Selfie + Face Match (Нүүр тулгалт)',
        description: 'Селфи болон баримтын нүүрний зургийг тулган харьцуулж, ижил этгээд эсэх магадлалыг тооцно',
      },
      {
        title: 'Liveness Check (Амьд эсэх)',
        description: 'Фото/видео replay ашигласан халдлагаас хамгаалж, бодит цагийн оролцоог баталгаажуулна',
      },
    ],
  },
  {
    id: 'face-recognition',
    title: 'Нүүр танилт',
    titleEn: 'Face Recognition',
    icon: Camera,
    color: 'bg-[#0ea5e9]',
    content: `Нүүр танилтын систем нь дараах үе шатуудаар ажилладаг:`,
    steps: [
      { step: 1, title: 'Face Detection', description: 'Зурагнаас нүүрний байршлыг олох (HOG, CNN алгоритм)' },
      { step: 2, title: 'Face Alignment', description: 'Нүүрийг стандарт байрлалд оруулах' },
      { step: 3, title: 'Feature Extraction', description: '128 хэмжээст embedding вектор үүсгэх' },
      { step: 4, title: 'Face Comparison', description: 'Euclidean distance ашиглан хоёр нүүрийг харьцуулах' },
    ],
    techDetails: {
      model: 'ResNet-34 (dlib)',
      trainedOn: '3 сая зураг',
      accuracy: '99.38% (LFW dataset)',
      embeddingSize: '128 хэмжээст вектор',
    },
  },
  {
    id: 'comparison',
    title: 'Системийн харьцуулалт',
    titleEn: 'System Comparison',
    icon: BarChart3,
    color: 'bg-[#6366f1]',
    systems: [
      { name: 'Jumio', features: 'ID verification + selfie + liveness, клауд API', comparison: 'Өргөн хэрэглээтэй ч өртөг өндөр' },
      { name: 'Onfido', features: 'Баримт шалгалт, нүүр танилт, risk score', comparison: 'Enterprise түвшний төсөв шаарддаг' },
      { name: 'Azure Face API', features: 'Нүүр илрүүлэлт, verification', comparison: 'Microsoft-д хамааралтай' },
      { name: 'NeuroVerify', features: 'Монгол хэлний UX, нээлттэй сангууд', comparison: 'Сургалтад тохиромжтой', highlight: true },
    ],
  },
  {
    id: 'tech-stack',
    title: 'Технологийн стек',
    titleEn: 'Technology Stack',
    icon: Layers,
    color: 'bg-[#3b82f6]',
    frontend: [
      { tech: 'Next.js', version: '15.0.3', purpose: 'React framework, App Router' },
      { tech: 'React', version: '19.0.0', purpose: 'UI component library' },
      { tech: 'TypeScript', version: '5.x', purpose: 'Type safety' },
      { tech: 'Tailwind CSS', version: '4.x', purpose: 'Utility-first CSS' },
      { tech: 'Framer Motion', version: '12.x', purpose: 'Animation library' },
    ],
    backend: [
      { tech: 'Python', version: '3.11+', purpose: 'Backend programming language' },
      { tech: 'FastAPI', version: '0.115.2', purpose: 'Modern async API framework' },
      { tech: 'face_recognition', version: '1.3.0', purpose: 'Face detection & comparison' },
      { tech: 'dlib', version: '19.24.2', purpose: 'Machine learning toolkit' },
      { tech: 'OpenCV', version: '4.10.0', purpose: 'Image processing' },
      { tech: 'NumPy', version: '1.26.4', purpose: 'Numerical computing' },
    ],
  },
  {
    id: 'requirements',
    title: 'Шаардлагууд',
    titleEn: 'Requirements',
    icon: CheckCircle,
    color: 'bg-[#06b6d4]',
    functional: [
      { id: 'FR-01', desc: 'Хэрэглэгч иргэний үнэмлэхийн урд болон арын зургийг оруулах боломжтой байх' },
      { id: 'FR-02', desc: 'Хэрэглэгч камераар селфи авах эсвэл файлаас сонгох сонголттой байх' },
      { id: 'FR-03', desc: 'Систем зураг дээр нүүрийн шалгалт хийж, match хувь болон шийдвэр буцаах' },
      { id: 'FR-04', desc: 'Liveness урсгалыг алхамчилсан даалгавраар харуулах' },
      { id: 'FR-05', desc: 'Алдааны нөхцөл бүрт Монгол хэл дээрх мессеж буцаах' },
    ],
    nonFunctional: [
      { id: 'NFR-01', title: 'Гүйцэтгэл', desc: 'Нэг verification хүсэлт 2-5 секундэд дуусах' },
      { id: 'NFR-02', title: 'Найдвартай байдал', desc: 'Алдаатай өгөгдөлд систем унтрахгүй' },
      { id: 'NFR-03', title: 'Аюулгүй байдал', desc: 'Файлын хэмжээ/төрөл шалгах' },
      { id: 'NFR-04', title: 'Responsive', desc: 'Мобайл дэлгэцэнд зохицсон байх' },
    ],
  },
  {
    id: 'architecture',
    title: 'Архитектур',
    titleEn: 'Architecture',
    icon: GitBranch,
    color: 'bg-[#8b5cf6]',
    layers: [
      { layer: 'Presentation Layer', tech: 'Next.js App Router, React components', description: 'Frontend' },
      { layer: 'Application Layer', tech: 'Next.js API Routes (proxy)', description: 'API Gateway' },
      { layer: 'Service Layer', tech: 'Python FastAPI, face_recognition', description: 'AI Backend' },
    ],
    flow: ['Landing Page', 'Verify Page', 'ID Upload', 'Liveness', 'Face Match', 'Result'],
  },
  {
    id: 'implementation',
    title: 'Хэрэгжүүлэлт',
    titleEn: 'Implementation',
    icon: Code2,
    color: 'bg-[#0ea5e9]',
    projectStructure: `
/NeuroVerify
├── app/
│   ├── api/verify/
│   │   ├── face-match/route.ts
│   │   ├── extract-document/route.ts
│   │   └── liveness-check/route.ts
│   ├── verify/page.tsx
│   └── page.tsx
├── components/
│   └── verification/
│       ├── id-verification-flow.tsx
│       ├── liveness-detection.tsx
│       ├── face-match.tsx
│       └── verification-success.tsx
├── lib/
│   └── verification-service.ts
└── scripts/backend/
    ├── app/main.py
    └── requirements.txt`,
  },
  {
    id: 'api',
    title: 'API Endpoints',
    titleEn: 'API Endpoints',
    icon: Server,
    color: 'bg-[#6366f1]',
    endpoints: [
      { path: '/', method: 'GET', description: 'API мэдээлэл буцаах' },
      { path: '/health', method: 'GET', description: 'Health check endpoint' },
      { path: '/verify/face-match', method: 'POST', description: 'Нүүр тулгалт (base64 images)' },
      { path: '/verify/extract-document', method: 'POST', description: 'Баримтаас мэдээлэл гаргах' },
    ],
  },
  {
    id: 'testing',
    title: 'Тестлэл',
    titleEn: 'Testing',
    icon: TestTube,
    color: 'bg-[#3b82f6]',
    testCases: [
      { case: 'Ижил хүн', expected: 'Match > 55%', actual: '87.3%', status: 'passed' },
      { case: 'Өөр хүн', expected: 'Match < 55%', actual: '23.1%', status: 'passed' },
      { case: 'Нүүр илрээгүй (ID)', expected: 'NO_FACE error', actual: 'NO_FACE error', status: 'passed' },
      { case: 'Олон нүүр', expected: 'MULTI error', actual: 'MULTI error', status: 'passed' },
      { case: 'Эвдэрсэн файл', expected: 'INVALID error', actual: 'INVALID error', status: 'passed' },
    ],
    performance: {
      avgResponseTime: '3.1 секунд',
      cpuLoad: '85-90%',
      memory: '~500MB',
    },
  },
  {
    id: 'conclusion',
    title: 'Дүгнэлт',
    titleEn: 'Conclusion',
    icon: CheckCircle,
    color: 'bg-[#06b6d4]',
    achievements: [
      'Full-stack систем: Next.js frontend + Python FastAPI backend',
      'AI Face Match: face_recognition + dlib ашиглан 128-dim embedding',
      '4-алхамт UX: ID Upload → Liveness → Face Match → Result',
      'Монгол интерфэйс: Хэрэглэгчдэд ойлгомжтой заавар',
      'Error handling: NO_FACE, MULTIPLE_FACES бүх алдааны боловсруулалт',
    ],
    improvements: [
      'Liveness detection - MediaPipe нэмэх',
      'OCR нэмж баримтаас мэдээлэл автомат уншиx',
      'Docker containerization',
      'Rate limiting, JWT authentication',
    ],
    futureWork: [
      'Video суурьтай liveness detection',
      'Document authenticity check (MRZ validation)',
      'Mobile app хувилбар (React Native)',
      'Admin dashboard',
    ],
  },
]

// Section Component
function SectionCard({ section, isExpanded, onToggle }: { 
  section: typeof sections[0]
  isExpanded: boolean
  onToggle: () => void 
}) {
  const Icon = section.icon
  
  return (
    <motion.div
      layout
      className={`${section.color} border-3 border-foreground shadow-[6px_6px_0px_var(--foreground)] overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 border-2 border-foreground flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              {section.title}
            </h3>
            <p className="text-white/70 text-sm font-medium">{section.titleEn}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-t-3 border-foreground"
          >
            <div className="p-6 space-y-6">
              {/* Main content */}
              {section.content && (
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              )}

              {/* Sub items */}
              {section.subItems && (
                <ul className="space-y-2">
                  {section.subItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-[#3b82f6] text-white text-sm font-bold flex items-center justify-center border-2 border-foreground flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Blocks */}
              {section.blocks && (
                <div className="grid gap-4">
                  {section.blocks.map((block, i) => (
                    <div key={i} className="p-4 bg-muted border-2 border-foreground">
                      <h4 className="font-bold text-foreground mb-2">{block.title}</h4>
                      <p className="text-muted-foreground text-sm">{block.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Steps */}
              {section.steps && (
                <div className="space-y-4">
                  {section.steps.map((step) => (
                    <div key={step.step} className="flex items-start gap-4">
                      <span className="w-10 h-10 bg-[#3b82f6] text-white font-black flex items-center justify-center border-2 border-foreground">
                        {step.step}
                      </span>
                      <div>
                        <h4 className="font-bold text-foreground">{step.title}</h4>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech details */}
              {section.techDetails && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {Object.entries(section.techDetails).map(([key, value]) => (
                    <div key={key} className="p-3 bg-[#3b82f6]/10 border-2 border-[#3b82f6]">
                      <p className="text-xs font-bold text-[#3b82f6] uppercase">{key}</p>
                      <p className="text-foreground font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Systems comparison */}
              {section.systems && (
                <div className="overflow-x-auto">
                  <table className="w-full border-2 border-foreground">
                    <thead className="bg-foreground text-white">
                      <tr>
                        <th className="p-3 text-left font-bold">Систем</th>
                        <th className="p-3 text-left font-bold">Онцлог</th>
                        <th className="p-3 text-left font-bold">Дүгнэлт</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.systems.map((sys, i) => (
                        <tr key={i} className={sys.highlight ? 'bg-[#3b82f6]/20' : i % 2 === 0 ? 'bg-white' : 'bg-muted'}>
                          <td className={`p-3 font-bold ${sys.highlight ? 'text-[#3b82f6]' : ''}`}>{sys.name}</td>
                          <td className="p-3 text-sm">{sys.features}</td>
                          <td className="p-3 text-sm">{sys.comparison}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tech stack */}
              {section.frontend && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-black text-foreground mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#3b82f6]" />
                      Frontend
                    </h4>
                    <div className="grid gap-2">
                      {section.frontend.map((tech, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted border-2 border-foreground">
                          <span className="font-bold">{tech.tech}</span>
                          <span className="text-sm text-muted-foreground">{tech.version}</span>
                          <span className="text-sm">{tech.purpose}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-foreground mb-3 flex items-center gap-2">
                      <Server className="w-5 h-5 text-[#8b5cf6]" />
                      Backend
                    </h4>
                    <div className="grid gap-2">
                      {section.backend?.map((tech, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted border-2 border-foreground">
                          <span className="font-bold">{tech.tech}</span>
                          <span className="text-sm text-muted-foreground">{tech.version}</span>
                          <span className="text-sm">{tech.purpose}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {section.functional && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-black text-foreground mb-3">Функционал шаардлага</h4>
                    <div className="space-y-2">
                      {section.functional.map((req) => (
                        <div key={req.id} className="flex items-start gap-3 p-3 bg-muted border-2 border-foreground">
                          <span className="px-2 py-1 bg-[#3b82f6] text-white text-xs font-bold">{req.id}</span>
                          <span className="text-sm">{req.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-foreground mb-3">Функционал бус шаардлага</h4>
                    <div className="space-y-2">
                      {section.nonFunctional?.map((req) => (
                        <div key={req.id} className="flex items-start gap-3 p-3 bg-muted border-2 border-foreground">
                          <span className="px-2 py-1 bg-[#8b5cf6] text-white text-xs font-bold">{req.id}</span>
                          <div>
                            <span className="font-bold">{req.title}: </span>
                            <span className="text-sm">{req.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Architecture */}
              {section.layers && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    {section.layers.map((layer, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-muted border-2 border-foreground">
                        <span className="w-10 h-10 bg-[#3b82f6] text-white font-black flex items-center justify-center border-2 border-foreground">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <h5 className="font-bold">{layer.layer}</h5>
                          <p className="text-sm text-muted-foreground">{layer.tech}</p>
                        </div>
                        <span className="px-3 py-1 bg-foreground text-white text-xs font-bold">
                          {layer.description}
                        </span>
                      </div>
                    ))}
                  </div>
                  {section.flow && (
                    <div>
                      <h4 className="font-black text-foreground mb-3">Verification Flow</h4>
                      <div className="flex flex-wrap items-center gap-2">
                        {section.flow.map((step, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="px-3 py-2 bg-[#06b6d4] text-white font-bold text-sm border-2 border-foreground">
                              {step}
                            </span>
                            {i < section.flow.length - 1 && (
                              <ChevronRight className="w-5 h-5 text-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Project structure */}
              {section.projectStructure && (
                <pre className="p-4 bg-foreground text-white font-mono text-sm overflow-x-auto border-2 border-foreground">
                  {section.projectStructure}
                </pre>
              )}

              {/* API endpoints */}
              {section.endpoints && (
                <div className="overflow-x-auto">
                  <table className="w-full border-2 border-foreground">
                    <thead className="bg-foreground text-white">
                      <tr>
                        <th className="p-3 text-left font-bold">Endpoint</th>
                        <th className="p-3 text-left font-bold">Method</th>
                        <th className="p-3 text-left font-bold">Тайлбар</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.endpoints.map((ep, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-muted'}>
                          <td className="p-3 font-mono text-[#3b82f6]">{ep.path}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs font-bold ${ep.method === 'GET' ? 'bg-[#06b6d4]' : 'bg-[#8b5cf6]'} text-white`}>
                              {ep.method}
                            </span>
                          </td>
                          <td className="p-3 text-sm">{ep.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Test cases */}
              {section.testCases && (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-2 border-foreground">
                      <thead className="bg-foreground text-white">
                        <tr>
                          <th className="p-3 text-left font-bold">Тест кейс</th>
                          <th className="p-3 text-left font-bold">Хүлээгдэж буй</th>
                          <th className="p-3 text-left font-bold">Бодит үр дүн</th>
                          <th className="p-3 text-left font-bold">Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.testCases.map((tc, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-muted'}>
                            <td className="p-3 font-medium">{tc.case}</td>
                            <td className="p-3 text-sm">{tc.expected}</td>
                            <td className="p-3 text-sm">{tc.actual}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 text-xs font-bold ${tc.status === 'passed' ? 'bg-green-500' : 'bg-red-500'} text-white uppercase`}>
                                {tc.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {section.performance && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-[#3b82f6] border-2 border-foreground text-center">
                        <Zap className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-white/70">Дундаж хариу</p>
                        <p className="text-xl font-black text-white">{section.performance.avgResponseTime}</p>
                      </div>
                      <div className="p-4 bg-[#8b5cf6] border-2 border-foreground text-center">
                        <Cpu className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-white/70">CPU ачаалал</p>
                        <p className="text-xl font-black text-white">{section.performance.cpuLoad}</p>
                      </div>
                      <div className="p-4 bg-[#06b6d4] border-2 border-foreground text-center">
                        <Database className="w-6 h-6 text-white mx-auto mb-2" />
                        <p className="text-xs text-white/70">Санах ой</p>
                        <p className="text-xl font-black text-white">{section.performance.memory}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Conclusion */}
              {section.achievements && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-black text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Хүрсэн үр дүн
                    </h4>
                    <ul className="space-y-2">
                      {section.achievements.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-green-50 border-2 border-green-500">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-black text-foreground mb-3 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#8b5cf6]" />
                      Сайжруулах зүйлс
                    </h4>
                    <ul className="space-y-2">
                      {section.improvements?.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-[#8b5cf6]/10 border-2 border-[#8b5cf6]">
                          <span className="w-5 h-5 bg-[#8b5cf6] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">!</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-black text-foreground mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#3b82f6]" />
                      Цаашдын хөгжүүлэлт
                    </h4>
                    <ul className="space-y-2">
                      {section.futureWork?.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-[#3b82f6]/10 border-2 border-[#3b82f6]">
                          <ChevronRight className="w-5 h-5 text-[#3b82f6] flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function DocumentationPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['introduction']))

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAll = () => {
    setExpandedSections(new Set(sections.map(s => s.id)))
  }

  const collapseAll = () => {
    setExpandedSections(new Set())
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground text-white py-8 px-4 border-b-4 border-[#3b82f6]">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Буцах</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#3b82f6] border-2 border-white flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                  DOCUMENTATION
                </h1>
                <p className="text-white/70 font-medium">
                  NeuroVerify - AI Identity Verification System
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="px-3 py-1 bg-[#3b82f6] text-white text-sm font-bold border-2 border-white">
                3-р баг
              </span>
              <span className="px-3 py-1 bg-[#06b6d4] text-white text-sm font-bold border-2 border-white">
                ICSI440
              </span>
              <span className="px-3 py-1 bg-[#8b5cf6] text-white text-sm font-bold border-2 border-white">
                2026
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Team info banner */}
      <div className="bg-[#3b82f6] py-4 px-4 border-b-4 border-foreground">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Users className="w-6 h-6 text-white" />
            <div className="text-white">
              <p className="font-bold">Гүйцэтгэсэн:</p>
              <p className="text-sm">Т. Анар, Бишрэлт, М. Анар, У. Түмэндэмбэрэл</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-white text-foreground font-bold text-sm border-2 border-foreground shadow-[3px_3px_0px_var(--foreground)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--foreground)] transition-all"
            >
              Бүгдийг нээх
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 bg-foreground text-white font-bold text-sm border-2 border-white shadow-[3px_3px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_white] transition-all"
            >
              Бүгдийг хаах
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Quick nav */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-muted border-3 border-foreground shadow-[4px_4px_0px_var(--foreground)]"
        >
          <h3 className="font-bold mb-3">Гарчиг</h3>
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setExpandedSections(prev => new Set([...prev, section.id]))
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-3 py-1 bg-white text-sm font-medium border-2 border-foreground hover:bg-[#3b82f6] hover:text-white transition-colors"
              >
                {section.title}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <SectionCard
                section={section}
                isExpanded={expandedSections.has(section.id)}
                onToggle={() => toggleSection(section.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-foreground text-white border-3 border-foreground text-center"
        >
          <p className="font-bold mb-2">Монгол Улсын Их Сургууль</p>
          <p className="text-white/70 text-sm">
            Мэдээллийн технологи инженерчлэлийн сургууль • Мэдээлэл, компьютерын ухааны тэнхим
          </p>
          <p className="text-white/50 text-sm mt-2">Улаанбаатар хот • 2026 он</p>
        </motion.footer>
      </main>
    </div>
  )
}

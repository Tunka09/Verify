'use client'

import { motion } from 'framer-motion'
import { Eye, Users, Shield, Zap, Lock, Brain } from 'lucide-react'

const features = [
  {
    icon: Eye,
    title: 'Биометрийн баталгаажуулалт',
    description: 'Бодит цагийн нүүрний анализ болон хуурамч үйлдлийг илрүүлэх цэргийн түвшний хамгаалалт.',
    color: 'from-primary to-accent',
  },
  {
    icon: Shield,
    title: 'KYC нийцэл',
    description: 'Бичиг баримтыг шууд таньж, голограмм болон бичил текстээр баталгаажуулна.',
    color: 'from-accent to-secondary',
  },
  {
    icon: Brain,
    title: 'Мэдрэлийн танилт',
    description: 'Хиймэл оюун ухаанд суурилсан 1:1 харьцуулалт болон хуурамч үйлдлээс хамгаалах систем.',
    color: 'from-secondary to-primary',
  },
  {
    icon: Users,
    title: 'Алдартнуудын мэдээллийн сан',
    description: 'Олон мянган алдартнууд болон бүлэг зураг дээрх хүмүүсийг бодит цагт таних.',
    color: 'from-primary to-secondary',
  },
  {
    icon: Zap,
    title: 'Шуурхай үр дүн',
    description: 'Кино шиг хөдөлгөөнт дүрслэл, голограмм UI бүхий хурдан боловсруулалт.',
    color: 'from-accent to-primary',
  },
  {
    icon: Lock,
    title: 'Нууцлал нэгдүгээрт',
    description: 'Төгсгөлөөс төгсгөл хүртэлх шифрлэлт, мэдээлэл хадгалахгүй байх зарчим.',
    color: 'from-secondary to-accent',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Дараагийн үеийн боломжууд
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Хамгийн сүүлийн үеийн мэдрэлийн сүлжээ болон квант алгоритмаар ажилладаг
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative glassmorphism-dark p-8 rounded-xl border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* Icon */}
                <div className="relative mb-4">
                  <div
                    className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} p-3 shadow-lg group-hover:shadow-2xl transition-all duration-300`}
                  >
                    <Icon className="w-full h-full text-background" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Glow Effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-br ${feature.color} rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300 -z-10`}
                ></div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

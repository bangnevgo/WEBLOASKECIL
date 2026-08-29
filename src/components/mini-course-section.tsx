'use client'

import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/translations'

const FEATURES = [
  {
    icon: '🎓',
    titleId: '5 Modul LMS Masterclass',
    titleEn: '5 LMS Masterclass Modules',
    descId: 'Belajar mandiri dari dasar asumsi hingga penguasaan state batin secara runtut & terstruktur.',
    descEn: 'Self-paced learning from fundamentals to mastering inner state systematically.',
  },
  {
    icon: '📚',
    titleId: '20 Ebook & 12 Rekaman Webinar',
    titleEn: '20 Ebooks & 12 Exclusive Webinars',
    descId: 'Koleksi 20 ebook panduan, 12 rekaman webinar eksklusif, dan audio meditasi.',
    descEn: 'Collection of 20 essential ebooks, 12 exclusive webinar recordings, and meditation audios.',
  },
  {
    icon: '🤖',
    titleId: 'Nevi AI Asisten 24/7',
    titleEn: '24/7 Nevi AI Assistant',
    descId: 'Konsultasi dan bedah asumsi kapan saja tanpa batas bersama asisten AI terlatih.',
    descEn: 'Consult and examine your assumptions anytime with trained AI assistance.',
  },
  {
    icon: '⚡',
    titleId: 'Akses Seumur Hidup',
    titleEn: 'Lifetime Full Access',
    descId: 'Akses seumur hidup untuk seluruh materi dan update kurikulum mendatang.',
    descEn: 'Lifetime access for all materials and future curriculum updates.',
  },
]

export default function MiniCourseSection() {
  const { language } = useTranslation()
  const isEn = language === 'en'

  return (
    <motion.section
      id="mini-course"
      className="nv-mini-course-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="nv-mini-course-glow" />
      <div className="nv-mini-course-content">
        {/* Badge */}
        <div className="nv-mini-course-badge-wrap">
          <span className="nv-pricing-cta-badge">
            ✦ {isEn ? 'FEATURED PROGRAM' : 'PROGRAM UNGGULAN'}
          </span>
        </div>

        {/* Headline */}
        <h2 className="nv-mini-course-headline">
          Asumsimu Itu Dahsyat
        </h2>

        {/* Subheadline / Body */}
        <p className="nv-mini-course-subheadline">
          {isEn
            ? 'Mini Course Law of Assumption for structured self-paced learning with 5 LMS modules, 20 ebooks, 12 webinar recordings, meditation audio, and 24/7 Nevi AI. Lifetime access.'
            : 'Mini Course Law of Assumption untuk belajar mandiri melalui 5 modul LMS, 20 ebook, 12 rekaman webinar, audio meditasi, dan Nevi AI 24/7. Akses seumur hidup.'}
        </p>

        {/* Features Grid */}
        <div className="nv-mini-course-cards">
          {FEATURES.map((item, idx) => (
            <motion.div
              key={idx}
              className="nv-mini-course-card nv-glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <span className="nv-mini-course-card-icon">{item.icon}</span>
              <h3 className="nv-mini-course-card-title">
                {isEn ? item.titleEn : item.titleId}
              </h3>
              <p className="nv-mini-course-card-desc">
                {isEn ? item.descEn : item.descId}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Wrap */}
        <div className="nv-mini-course-cta-wrap">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <motion.a
              href="https://course.nevgoinstitute.com/"
              data-cta-id="mini-course-loas-home-section"
              target="_blank"
              rel="noopener noreferrer"
              className="nv-cta-button nv-cta-pulse"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{ textDecoration: 'none' }}
            >
              <span className="nv-cta-icon">✦</span>
              {isEn ? 'Lihat Mini Course Asumsimu Itu Dahsyat' : 'Lihat Mini Course Asumsimu Itu Dahsyat'}
            </motion.a>

            <a
              href="https://cohort.nevgoinstitute.com"
              target="_blank"
              rel="noopener noreferrer"
              className="nv-mini-course-cohort-link"
            >
              {isEn ? 'Butuh feedback langsung? Lihat Cohort' : 'Butuh feedback langsung? Lihat Cohort'}
            </a>
          </div>

          <p className="nv-mini-course-cta-note">
            {isEn
              ? 'Sekali bayar · Akses instan ke LMS'
              : 'Sekali bayar · Akses instan ke LMS'}
          </p>
        </div>
      </div>
    </motion.section>
  )
}

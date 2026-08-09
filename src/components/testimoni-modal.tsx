'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

// 36 WA screenshot testimony images
const TESTIMONI_IMAGES = Array.from({ length: 36 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0')
  return `/testimoni/testimoni-${num}.jpeg`
})

export default function TestimoniModal({ isOpen, onClose, initialIndex = 0 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONI_IMAGES.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TESTIMONI_IMAGES.length - 1 ? 0 : prev + 1))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
        <motion.div
          className="relative w-full max-w-xl max-h-[90vh] bg-[#0d1612] border border-[#d4a053]/40 rounded-2xl p-4 flex flex-col items-center shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full pb-3 border-b border-[#d4a053]/20 mb-3">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-[#d4a053]" />
              <h3 className="text-sm font-bold text-white">
                Testimoni WA Murid ({currentIndex + 1} / {TESTIMONI_IMAGES.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Image Container */}
          <div className="relative w-full flex-1 flex items-center justify-center min-h-[350px] max-h-[65vh] overflow-hidden rounded-xl bg-black/50">
            <img
              src={TESTIMONI_IMAGES[currentIndex]}
              alt={`Testimoni WA Murid ${currentIndex + 1}`}
              className="max-h-[62vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
            />

            {/* Nav Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-2 p-2 rounded-full bg-black/60 text-white hover:bg-[#d4a053] hover:text-black transition-colors"
              aria-label="Testimoni Sebelumnya"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 p-2 rounded-full bg-black/60 text-white hover:bg-[#d4a053] hover:text-black transition-colors"
              aria-label="Testimoni Selanjutnya"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-between w-full pt-3 mt-3 border-t border-[#d4a053]/20">
            <p className="text-[11px] text-neutral-400">
              ✦ Screenshot asli percakapan hasil nyata mentoring murid
            </p>
            <a
              href="https://wa.me/628989221700?text=Halo%20Bang%20Nevgo,%20saya%20tertarik%20tanya%20program%20mentoring%20setelah%20melihat%20testimoni"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-bold text-black rounded-lg bg-gradient-to-r from-[#d4a053] to-[#b8862d] hover:opacity-90 transition-opacity"
            >
              Tanya Mentoring WA →
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

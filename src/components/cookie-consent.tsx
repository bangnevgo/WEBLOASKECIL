'use client'
 
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/translations'
 
const STORAGE_KEY = 'nv-cookie-consent'
 
export default function CookieConsent() {
  const { language } = useTranslation()
  const [visible, setVisible] = useState(false)
 
  useEffect(() => {
    // Sync with external system (localStorage) on mount — legitimate setState in effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(() => {
      try {
        return !localStorage.getItem(STORAGE_KEY)
      } catch {
        return true
      }
    })
  }, [])
 
  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {
      // localStorage might be unavailable
    }
    setVisible(false)
  }
 
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="nv-cookie-consent"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="nv-cookie-consent-inner">
            <div className="nv-cookie-consent-accent" />
            <p className="nv-cookie-consent-text">
              {language === 'en'
                ? 'This site uses cookies to save your preferences. By continuing, you agree to our use of cookies.'
                : 'Situs ini menggunakan cookie untuk menyimpan preferensi Anda. Dengan melanjutkan, Anda menyetujui penggunaan cookie.'
              }
            </p>
            <div className="nv-cookie-consent-actions">
              <button className="nv-cookie-consent-accept" onClick={handleAccept}>
                {language === 'en' ? 'Accept' : 'Terima'}
              </button>
              <a href="/#faq" className="nv-cookie-consent-learn">
                {language === 'en' ? 'Learn More' : 'Pelajari Lebih'}
              </a>
            </div>
          </div>
 
          <style jsx>{`
            .nv-cookie-consent {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              z-index: 999;
              padding: 0 16px 16px;
              pointer-events: none;
            }
 
            .nv-cookie-consent-inner {
              max-width: 720px;
              margin: 0 auto;
              display: flex;
              align-items: center;
              gap: 16px;
              padding: 16px 20px;
              background: rgba(17, 17, 20, 0.92);
              backdrop-filter: blur(16px);
              border: 1px solid rgba(212, 160, 83, 0.2);
              border-radius: 14px;
              pointer-events: auto;
              position: relative;
              overflow: hidden;
              flex-wrap: wrap;
            }
 
            .nv-cookie-consent-accent {
              position: absolute;
              top: 0;
              left: 0;
              width: 3px;
              height: 100%;
              background: linear-gradient(180deg, var(--nv-gold), var(--nv-gold-2));
              border-radius: 3px 0 0 3px;
            }
 
            .nv-cookie-consent-text {
              flex: 1;
              font-size: 13px;
              line-height: 1.6;
              color: var(--nv-muted);
              margin: 0;
              min-width: 200px;
            }
 
            .nv-cookie-consent-actions {
              display: flex;
              align-items: center;
              gap: 10px;
              flex-shrink: 0;
            }
 
            .nv-cookie-consent-accept {
              padding: 8px 20px;
              background: linear-gradient(135deg, var(--nv-gold), var(--nv-gold-2));
              color: var(--nv-bg);
              font-weight: 700;
              font-size: 13px;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-family: var(--font-geist-sans), system-ui, sans-serif;
              transition: box-shadow 0.2s;
            }
 
            .nv-cookie-consent-accept:hover {
              box-shadow: 0 4px 16px rgba(212, 160, 83, 0.35);
            }
 
            .nv-cookie-consent-learn {
              font-size: 13px;
              color: var(--nv-dim);
              text-decoration: none;
              transition: color 0.2s;
              white-space: nowrap;
            }
 
            .nv-cookie-consent-learn:hover {
              color: var(--nv-gold);
            }
 
            @media (max-width: 640px) {
              .nv-cookie-consent-inner {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
              }
 
              .nv-cookie-consent-actions {
                width: 100%;
                justify-content: flex-start;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

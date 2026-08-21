'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/translations'
import {
  Play,
  FileText,
  Music,
  Video,
  Download,
  ExternalLink,
  ChevronRight,
  X,
  Lock
} from 'lucide-react'
import { toast } from 'sonner'
import CustomAudioPlayer from '@/components/ui/audio-player'

// ── Types ──
interface KnowledgeItem {
  id: string
  title: string
  category: 'webinar' | 'tiktok' | 'pdf' | 'audio'
  description: string
  durationOrPages: string
  sourceUrl?: string
  coverImg?: string
  subpageUrl?: string
  isVip?: boolean
}

// ── Localized Mock Data ──
const KNOWLEDGE_ITEMS_ID: KnowledgeItem[] = [
  // Webinars
  {
    id: 'webinar-1',
    title: 'Dimana Manifestku? Sisi Gelap Manifestasi Yang Tabu',
    category: 'webinar',
    description: 'Bedah tuntas rintangan mental diet, asumsi tersembunyi yang melawan keinginan Anda 24 jam sehari, dan audit kebocoran batin.',
    durationOrPages: '2 jam 45 menit',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/f6aed327-9c7c-4dd3-a3a0-aebea506ec72',
    coverImg: '/images/illustrations/gemini-vision.png',
    isVip: true
  },
  {
    id: 'webinar-2',
    title: 'Masterclass: Reprogramming Inner Shadow & Self-Concept',
    category: 'webinar',
    description: 'Bagaimana mengintegrasikan limiting belief di level bayangan diri agar visualisasi SATS terwujud secara natural tanpa pertentangan.',
    durationOrPages: '1 jam 55 menit',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/4d551f5b-afd5-4d07-b58d-2f84a47117c0',
    coverImg: '/images/illustrations/meditation-imagination.webp',
    isVip: true
  },
  {
    id: 'webinar-3',
    title: 'Memulai Perjalanan: Fondasi Ajaran Neville Goddard',
    category: 'webinar',
    description: 'Deep-dive 60 menit mengenai konsep I AM, kesadaran sebagai satu-satunya realitas, dan bagaimana menggeser konsep diri secara sadar.',
    durationOrPages: '60 Menit',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/fb85d795-3365-444f-85c1-48d6a841b87e',
    coverImg: '/images/illustrations/manifestation-journal.webp',
    isVip: true
  },
  {
    id: 'webinar-4',
    title: 'SATS Masterclass: Teknik Visualisasi Lanjutan',
    category: 'webinar',
    description: 'Pelajari detail cara rileksasi mendalam masuk ke kondisi mengantuk (State Akin To Sleep) dan cara menyusun adegan imajinasi 3 dimensi yang natural.',
    durationOrPages: '90 Menit',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/f5f217b6-a6d5-4e2e-98e1-00d21abb2788',
    coverImg: '/images/illustrations/meditation-imagination.webp',
    isVip: true
  },
  {
    id: 'webinar-5',
    title: 'Teknik Revisi: Menulis Ulang Realitas & Menghapus Trauma',
    category: 'webinar',
    description: 'Workshop khusus mengupas teknik revisi Neville Goddard. Pelajari cara mengubah kejadian masa lalu dalam memori agar realitas masa depan bergeser.',
    durationOrPages: '45 Menit',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/f8f99303-f663-472e-ad80-6e07bc843ef0',
    coverImg: '/images/illustrations/consciousness-creates-world.png',
    isVip: true
  },
  {
    id: 'webinar-6',
    title: 'Imajinasi Menciptakan Realitas: Pembuktian Studi Kasus',
    category: 'webinar',
    description: 'Ulasan 5 studi kasus murid Neville Goddard beserta bedah mekanika mental yang terjadi di balik layar dari setiap keberhasilan.',
    durationOrPages: '60 Menit',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/189a0f56-09fd-4e63-bfb1-884ce6ad049d',
    coverImg: '/images/neville-profile.jpg',
    isVip: true
  },
  {
    id: 'webinar-7',
    title: 'Tanya Jawab Eksklusif: Mengatasi Kendala Praktik Harian',
    category: 'webinar',
    description: 'Rekaman sesi tanya jawab langsung membahas penundaan (*time lag*), cara membiarkan perasaan tanpa memaksakan kehendak, dan persistensi saat situasi luar berlawanan.',
    durationOrPages: '45 Menit',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/783dc9bc-af50-448a-a620-4f26221ffba4',
    coverImg: '/images/neville-goddard.png',
    isVip: true
  },
  // TikTok Live
  {
    id: 'tiktok-1',
    title: 'Tiktok Live: Teknik SATS vs Khayalan Siang Hari (Wishful Thinking)',
    category: 'tiktok',
    description: 'Sesi tanya jawab kilat membahas detail perasaan relief saat tidur dan bagaimana mengendalikan imajinasi di siang hari.',
    durationOrPages: '45 mnt',
    coverImg: '/images/illustrations/consciousness-creates-world.png',
    isVip: false
  },
  {
    id: 'tiktok-2',
    title: 'Tiktok Live: Kenapa Memanifestasikan Seseorang (SP) Sering Gagal?',
    category: 'tiktok',
    description: 'Membongkar konsep keterikatan (attachment), menempatkan orang di atas pedestal, dan cara merestorasi status batin bertahta.',
    durationOrPages: '60 mnt',
    coverImg: '/images/illustrations/manifestation-journal.webp',
    isVip: false
  },
  // Coming Soon — TikTok
  {
    id: 'tiktok-3',
    title: 'Tiktok Live: Mental Diet & Teknik Mengawasi Pikiran',
    category: 'tiktok',
    description: 'Cara praktis mengawasi dan menggeser pikiran otomatis negatif sehari-hari agar selaras dengan asumsi baru.',
    durationOrPages: '45 mnt',
    coverImg: '/images/illustrations/meditation-imagination.webp',
    isVip: false
  },
  // PDFs
  {
    id: 'pdf-1',
    title: 'Jurnal Harian Asumsi & Lembar SATS (Printable)',
    category: 'pdf',
    description: 'Template isian harian untuk melatih visualisasi malam dan audit batin di siang hari agar mental diet tetap selaras.',
    durationOrPages: '12 Halaman',
    isVip: false
  },
  {
    id: 'pdf-2',
    title: 'Workbook Digital 30 Hari Manifestasi',
    category: 'pdf',
    description: 'Workbook interaktif untuk memetakan, mengaudit, dan melacak pergeseran konsep diri Anda secara digital selama 30 hari.',
    durationOrPages: 'Interactive HTML',
    isVip: true
  },
  {
    id: 'pdf-3',
    title: 'Panduan Mengatasi Emosi Negatif',
    category: 'pdf',
    description: 'Teknik praktis menetralisir kecemasan, ketakutan, dan reaksi batin negatif saat menghadapi situasi fisik 3D yang berlawanan.',
    durationOrPages: 'Ebook',
    isVip: false
  },
  // Audios
  {
    id: 'audio-tubuh-masa-lalu',
    title: 'Audio Eksklusif: Tubuh Anda Ternyata Kecanduan Masa Lalu',
    category: 'audio',
    description: 'Bedah mendalam bagaimana memori biologis dan respon emosional otomatis tubuh memenjarakan Anda pada realitas lama, serta cara melepaskan kecanduan tersebut agar asumsi baru mewujud.',
    durationOrPages: '20 Menit',
    sourceUrl: '/audio/tubuh-anda-kecanduan-masa-lalu.mp3',
    subpageUrl: '/audio/tubuh-anda-kecanduan-masa-lalu',
    coverImg: '/images/illustrations/tubuh-kecanduan-masa-lalu.svg',
    isVip: false
  },
  {
    id: 'audio-1',
    title: 'Meditasi Theta: Induksi SATS Sebelum Tidur',
    category: 'audio',
    description: 'Frekuensi binaural dipadukan suara panduan batin untuk menenangkan gelombang otak Anda ke kondisi Theta yang reseptif.',
    durationOrPages: '15 mnt',
    isVip: false
  },
  {
    id: 'audio-2',
    title: 'Afirmasi Konsep Diri: Kesadaran Keberlimpahan (I AM)',
    category: 'audio',
    description: 'Afirmasi repetitif frekuensi tinggi untuk didengarkan saat tidur guna menanamkan perasaan kaya, aman, dan terpenuhi.',
    durationOrPages: '10 mnt',
    isVip: true
  },
  {
    id: 'audio-3',
    title: 'Audio Meditasi Rilis Hambatan Mental & Shadow Work',
    category: 'audio',
    description: 'Meditasi terpandu untuk melepaskan beban emosi lama dan memaafkan masa lalu demi kelancaran bridges of incidents.',
    durationOrPages: '20 mnt',
    isVip: true
  },
  // Coming Soon — PDF
  {
    id: 'pdf-4',
    title: 'Panduan Lengkap Law of Assumption: Dari A-Z',
    category: 'pdf',
    description: 'Ebook komprehensif yang merangkum seluruh ajaran Neville Goddard dari 1939–1972, dilengkapi latihan harian dan lembar audit mental.',
    durationOrPages: '100+ Halaman',
    isVip: false
  },
  // Coming Soon — Audio
  {
    id: 'audio-4',
    title: 'Afirmasi Tidur: Saya Adalah Kesuksesan',
    category: 'audio',
    description: 'Afirmasi malam hari untuk menanamkan identitas diri sebagai manusia yang sudah sukses, cukup, dan layak menerima keberlimpahan.',
    durationOrPages: '30 mnt',
    isVip: false
  }
]

const KNOWLEDGE_ITEMS_EN: KnowledgeItem[] = [
  // Webinars
  {
    id: 'webinar-1',
    title: 'Where is My Manifestation? The Taboo Dark Side of Manifestation',
    category: 'webinar',
    description: 'A thorough dissection of mental diet obstacles, hidden assumptions working against your desires 24 hours a day, and auditing inner leaks.',
    durationOrPages: '2 hours 45 minutes',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/f6aed327-9c7c-4dd3-a3a0-aebea506ec72',
    coverImg: '/images/illustrations/gemini-vision.png',
    isVip: true
  },
  {
    id: 'webinar-2',
    title: 'Masterclass: Reprogramming Inner Shadow & Self-Concept',
    category: 'webinar',
    description: 'How to integrate limiting beliefs at the self-shadow level so that SATS visualization manifests naturally without conflict.',
    durationOrPages: '1 hour 55 minutes',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/4d551f5b-afd5-4d07-b58d-2f84a47117c0',
    coverImg: '/images/illustrations/meditation-imagination.webp',
    isVip: true
  },
  {
    id: 'webinar-3',
    title: 'Beginning the Journey: Foundations of Neville Goddard\'s Teachings',
    category: 'webinar',
    description: 'A 60-minute deep-dive into the I AM concept, consciousness as the only reality, and how to consciously shift self-concept.',
    durationOrPages: '60 Minutes',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/fb85d795-3365-444f-85c1-48d6a841b87e',
    coverImg: '/images/illustrations/manifestation-journal.webp',
    isVip: true
  },
  {
    id: 'webinar-4',
    title: 'SATS Masterclass: Advanced Visualization Techniques',
    category: 'webinar',
    description: 'Learn in detail how to deeply relax into the state akin to sleep (SATS) and construct a natural 3-dimensional imaginary scene.',
    durationOrPages: '90 Minutes',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/f5f217b6-a6d5-4e2e-98e1-00d21abb2788',
    coverImg: '/images/illustrations/meditation-imagination.webp',
    isVip: true
  },
  {
    id: 'webinar-5',
    title: 'Revision Technique: Rewriting Reality & Clearing Trauma',
    category: 'webinar',
    description: 'A special workshop exploring Neville Goddard\'s revision technique. Learn how to change past events in memory to shift future reality.',
    durationOrPages: '45 Minutes',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/f8f99303-f663-472e-ad80-6e07bc843ef0',
    coverImg: '/images/illustrations/consciousness-creates-world.png',
    isVip: true
  },
  {
    id: 'webinar-6',
    title: 'Imagination Creates Reality: Case Study Proof',
    category: 'webinar',
    description: 'A review of 5 Neville Goddard student case studies, with a breakdown of the mental mechanics operating behind the scenes of each success.',
    durationOrPages: '60 Minutes',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/189a0f56-09fd-4e63-bfb1-884ce6ad049d',
    coverImg: '/images/neville-profile.jpg',
    isVip: true
  },
  {
    id: 'webinar-7',
    title: 'Exclusive Q&A: Overcoming Daily Practice Obstacles',
    category: 'webinar',
    description: 'A recording of a live Q&A session discussing time lag, how to assume the feeling without forcing, and persisting when the external environment contradicts.',
    durationOrPages: '45 Minutes',
    sourceUrl: 'https://iframe.mediadelivery.net/play/600939/783dc9bc-af50-448a-a620-4f26221ffba4',
    coverImg: '/images/neville-goddard.png',
    isVip: true
  },
  // TikTok Live
  {
    id: 'tiktok-1',
    title: 'Tiktok Live: SATS Technique vs Daydreaming (Wishful Thinking)',
    category: 'tiktok',
    description: 'A lightning Q&A session discussing the feeling of relief when falling asleep and how to control imagination during the day.',
    durationOrPages: '45 mins',
    coverImg: '/images/illustrations/consciousness-creates-world.png',
    isVip: false
  },
  {
    id: 'tiktok-2',
    title: 'Tiktok Live: Why Manifesting a Specific Person (SP) Often Fails?',
    category: 'tiktok',
    description: 'Unpacking the concept of attachment, putting people on a pedestal, and how to restore a sovereign inner state.',
    durationOrPages: '60 mins',
    coverImg: '/images/illustrations/manifestation-journal.webp',
    isVip: false
  },
  // Coming Soon — TikTok
  {
    id: 'tiktok-3',
    title: 'Tiktok Live: Mental Diet & Thought Monitoring Techniques',
    category: 'tiktok',
    description: 'Practical ways to observe and shift daily negative automatic thoughts to align with your new assumption.',
    durationOrPages: '45 mins',
    coverImg: '/images/illustrations/meditation-imagination.webp',
    isVip: false
  },
  // PDFs
  {
    id: 'pdf-1',
    title: 'Daily Assumption Journal & SATS Sheet (Printable)',
    category: 'pdf',
    description: 'A daily template for night visualization practice and daytime inner auditing to keep your mental diet aligned.',
    durationOrPages: '12 Pages',
    isVip: false
  },
  {
    id: 'pdf-2',
    title: '30-Day Manifestation Digital Workbook',
    category: 'pdf',
    description: 'An interactive workbook to map, audit, and track your self-concept shifts digitally for 30 days.',
    durationOrPages: 'Interactive HTML',
    isVip: true
  },
  {
    id: 'pdf-3',
    title: 'Guide to Overcoming Negative Emotions',
    category: 'pdf',
    description: 'Practical techniques to neutralize anxiety, fear, and negative inner reactions when facing a contradictory 3D physical situation.',
    durationOrPages: 'Ebook',
    isVip: false
  },
  // Audios
  {
    id: 'audio-tubuh-masa-lalu',
    title: 'Exclusive Audio: Your Body is Addicted to the Past',
    category: 'audio',
    description: 'An in-depth breakdown of how biological memory and automatic bodily emotional responses trap you in old realities, and how to release this addiction so new assumptions manifest.',
    durationOrPages: '20 Mins',
    sourceUrl: '/audio/tubuh-anda-kecanduan-masa-lalu.mp3',
    subpageUrl: '/audio/tubuh-anda-kecanduan-masa-lalu',
    coverImg: '/images/illustrations/tubuh-kecanduan-masa-lalu.svg',
    isVip: false
  },
  {
    id: 'audio-1',
    title: 'Theta Meditation: SATS Induction Before Sleep',
    category: 'audio',
    description: 'Binaural frequencies combined with guided inner voice to soothe your brainwaves into a receptive Theta state.',
    durationOrPages: '15 mins',
    isVip: false
  },
  {
    id: 'audio-2',
    title: 'Self-Concept Affirmations: Abundance Consciousness (I AM)',
    category: 'audio',
    description: 'High-frequency repetitive affirmations to listen to during sleep to plant feelings of wealth, security, and fulfillment.',
    durationOrPages: '10 mins',
    isVip: true
  },
  {
    id: 'audio-3',
    title: 'Guided Meditation: Releasing Mental Obstacles & Shadow Work',
    category: 'audio',
    description: 'A guided meditation to release old emotional burdens and forgive the past to pave the way for a smooth bridge of incidents.',
    durationOrPages: '20 mins',
    isVip: true
  },
  // Coming Soon — PDF
  {
    id: 'pdf-4',
    title: 'Complete Law of Assumption Guide: A-Z',
    category: 'pdf',
    description: 'A comprehensive ebook summarizing all of Neville Goddard\'s teachings from 1939–1972, complete with daily exercises and mental audit sheets.',
    durationOrPages: '100+ Pages',
    isVip: false
  },
  // Coming Soon — Audio
  {
    id: 'audio-4',
    title: 'Sleep Affirmations: I Am Success',
    category: 'audio',
    description: 'Nighttime affirmations to embed a self-identity as already successful, complete, and deserving of abundance.',
    durationOrPages: '30 mins',
    isVip: false
  }
]

// ── UI Translations ──
const UI_TRANSLATIONS = {
  id: {
    sectionTag: '🧠 BANK KNOWLEDGE',
    sectionTitle: 'Pusat Repositori Keilmuan Asumsi',
    sectionDesc: 'Koleksi rekaman pembelajaran, video diskusi live TikTok, eBook pendukung format PDF, serta meditasi/afirmasi audio batin terpandu dari Bang Nevgo.',
    tabAll: 'Semua Materi',
    tabWebinar: 'Rekaman Webinar',
    tabTiktok: 'TikTok Live',
    tabPdf: 'PDF Pendukung',
    tabAudio: 'Meditasi Audio',
    labelWebinar: '🎥 Webinar',
    labelTiktok: '📱 TikTok',
    labelPdf: '📄 PDF',
    labelAudio: '🎧 Audio',
    durationLabel: 'Durasi: ',
    btnOpenWorkbook: 'Buka Workbook',
    btnDownloadPdf: 'Unduh PDF',
    btnPlayAudio: 'Putar Audio',
    btnWatchVideo: 'Tonton Video',
    noFilesTitle: 'Belum ada file',
    noFilesDesc: 'Kategori materi ini sedang dalam proses penyusunan.',
    nowPlaying: 'Sedang Diputar (Bank Knowledge)',
    videoPlayer: 'Video Player (Bank Knowledge)',
    upgradeBtn: 'Upgrade Keanggotaan',
    backBtn: 'Kembali Menjelajah',
    downloadingToast: 'Mengunduh {title}...',
  },
  en: {
    sectionTag: '🧠 KNOWLEDGE BANK',
    sectionTitle: 'Repository Center of Assumption Teachings',
    sectionDesc: 'Collection of lecture recordings, TikTok Live discussion videos, supporting PDF eBooks, and guided inner audio meditations/affirmations by Bang Nevgo.',
    tabAll: 'All Materials',
    tabWebinar: 'Webinar Recordings',
    tabTiktok: 'TikTok Live',
    tabPdf: 'Supporting PDFs',
    tabAudio: 'Audio Meditations',
    labelWebinar: '🎥 Webinar',
    labelTiktok: '📱 TikTok',
    labelPdf: '📄 PDF',
    labelAudio: '🎧 Audio',
    durationLabel: 'Duration: ',
    btnOpenWorkbook: 'Open Workbook',
    btnDownloadPdf: 'Download PDF',
    btnPlayAudio: 'Play Audio',
    btnWatchVideo: 'Watch Video',
    noFilesTitle: 'No files yet',
    noFilesDesc: 'This category of material is currently being compiled.',
    nowPlaying: 'Now Playing (Knowledge Bank)',
    videoPlayer: 'Video Player (Knowledge Bank)',
    upgradeBtn: 'Upgrade Membership',
    backBtn: 'Keep Exploring',
    downloadingToast: 'Downloading {title}...',
  }
}

export default function KnowledgeBank({ isCommunityMode = false }: { isCommunityMode?: boolean }) {
  const { language } = useTranslation()

  // ── States ──
  const [activeTab, setActiveTab] = useState<'all' | 'webinar' | 'tiktok' | 'pdf' | 'audio'>('all')
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [activeAudioItem, setActiveAudioItem] = useState<KnowledgeItem | null>(null)

  const isIndo = language === 'id'
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.id
  const KNOWLEDGE_ITEMS = isIndo ? KNOWLEDGE_ITEMS_ID : KNOWLEDGE_ITEMS_EN

  // ── Access Checker ──
  const handleItemAction = (item: KnowledgeItem) => {
    // Coming soon / no file yet
    if (!item.sourceUrl) {
      if (isIndo) {
        toast.info('Materi ini sedang dipersiapkan. Nantikan segera! ✨')
      } else {
        toast.info('This material is being prepared. Coming soon! ✨')
      }
      return
    }

    if (item.category === 'webinar' || item.category === 'tiktok') {
      setActiveVideoId(item.sourceUrl)
    } else if (item.category === 'pdf') {
      const msg = t.downloadingToast.replace('{title}', item.title)
      toast.success(msg)
      window.open(item.sourceUrl, '_blank')
    } else if (item.category === 'audio') {
      setActiveAudioItem(item)
    }
  }

  const filteredItems = KNOWLEDGE_ITEMS.filter(item => {
    if (activeTab === 'all') return true
    return item.category === activeTab
  })

  return (
    <section 
      id="knowledge-bank" 
      className={`w-full ${isCommunityMode ? 'py-2' : 'py-20 bg-neutral-950/20 border-y border-neutral-900/60'}`}
    >
      <div className={isCommunityMode ? '' : 'max-w-[1200px] mx-auto px-6'}>
        
        {/* Header */}
        {!isCommunityMode && (
          <div className="text-center mb-12">
            <span className="px-3 py-1 bg-[#d4a053]/10 border border-[#d4a053]/20 text-[#d4a053] rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
              {t.sectionTag}
            </span>
            <h2 className="text-3xl font-bold font-outfit text-white mt-4 m-0 leading-tight">
              {t.sectionTitle}
            </h2>
            <p className="text-xs text-neutral-400 mt-2 max-w-lg mx-auto leading-relaxed">
              {t.sectionDesc}
            </p>
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none justify-start md:justify-center border-b border-neutral-900 mb-8">
          {[
            { id: 'all', label: t.tabAll, emoji: '📚' },
            { id: 'webinar', label: t.tabWebinar, emoji: '🎥' },
            { id: 'tiktok', label: t.tabTiktok, emoji: '📱' },
            { id: 'pdf', label: t.tabPdf, emoji: '📄' },
            { id: 'audio', label: t.tabAudio, emoji: '🎧' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition shrink-0 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#d4a053] text-[#0a0a0c] border-[#d4a053] shadow-md shadow-amber-500/10'
                  : 'bg-neutral-900/40 border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-800'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Grid List */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                className="nv-premium-glass p-5 border border-neutral-900 flex flex-col justify-between group hover:border-neutral-800/80 transition relative"
                layout
              >
                {/* Visual Cover for Video & Audio Categories */}
                {(item.category === 'webinar' || item.category === 'tiktok' || item.category === 'audio') && item.coverImg && (
                  <div 
                    className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-850 bg-neutral-950 mb-4 cursor-pointer"
                    onClick={() => handleItemAction(item)}
                  >
                    <img 
                      src={item.coverImg} 
                      alt={item.title} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-102 transition duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-[#d4a053] text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-108 transition">
                        {item.category === 'audio' ? <Music size={16} /> : <Play size={16} fill="currentColor" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Block */}
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[9px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      {item.category === 'webinar' ? t.labelWebinar : item.category === 'tiktok' ? t.labelTiktok : item.category === 'pdf' ? t.labelPdf : t.labelAudio}
                    </span>
                    {!item.sourceUrl ? (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                        {isIndo ? 'SEGERA ✨' : 'COMING SOON ✨'}
                      </span>
                    ) : item.isVip && (
                      <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                        <Lock size={8} /> VIP
                      </span>
                    )}
                  </div>
                  
                  <h3 
                    onClick={() => handleItemAction(item)}
                    className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-500 transition cursor-pointer m-0 leading-snug line-clamp-2"
                  >
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-2 m-0 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Footer Action Card */}
                <div className="border-t border-neutral-900/60 pt-3 mt-4 flex justify-between items-center">
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {item.category === 'pdf' ? `${item.durationOrPages}` : `${t.durationLabel}${item.durationOrPages}`}
                  </span>
                  
                  <button
                    onClick={() => handleItemAction(item)}
                    className="text-[11px] font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 bg-transparent border-none cursor-pointer"
                  >
                    <span>
                      {item.category === 'pdf' ? (item.id === 'pdf-2' ? t.btnOpenWorkbook : t.btnDownloadPdf) : item.category === 'audio' ? t.btnPlayAudio : t.btnWatchVideo}
                    </span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-neutral-900 rounded-2xl">
            <span className="text-4xl">📁</span>
            <h4 className="text-sm font-bold text-neutral-400 mt-2">{t.noFilesTitle}</h4>
            <p className="text-xs text-neutral-500 mt-1">{t.noFilesDesc}</p>
          </div>
        )}

        {/* ── Custom Audio Meditation Panel ── */}
        <AnimatePresence>
          {activeAudioItem && (
            <motion.div 
              className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-50 shadow-2xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="nv-premium-glass border border-amber-500/30 overflow-hidden">
                <div className="bg-neutral-950/80 px-4 py-2 border-b border-neutral-900 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1.5 uppercase font-mono">
                    <Music size={12} /> {t.nowPlaying}
                  </span>
                  <div className="flex items-center gap-2">
                    {activeAudioItem.subpageUrl && (
                      <a
                        href={activeAudioItem.subpageUrl}
                        className="text-[10px] font-semibold text-neutral-400 hover:text-[#d4a053] flex items-center gap-1 transition mr-2"
                        title="Buka halaman khusus audio ini"
                      >
                        <ExternalLink size={11} />
                        <span>Halaman Penuh</span>
                      </a>
                    )}
                    <button 
                      onClick={() => setActiveAudioItem(null)}
                      className="text-neutral-500 hover:text-white transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-1">
                  <CustomAudioPlayer 
                    audioSrc={activeAudioItem.sourceUrl || ''} 
                    title={activeAudioItem.title} 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Custom Video Player Modal ── */}
        <AnimatePresence>
          {activeVideoId && (
            <div className="nv-modal-overlay" onClick={() => setActiveVideoId(null)}>
              <motion.div
                className="nv-video-modal-container nv-premium-glass relative max-w-[850px] w-full"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-neutral-950/80 px-5 py-3 border-b border-neutral-900 flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                    🎥 {t.videoPlayer}
                  </span>
                  <button 
                    onClick={() => setActiveVideoId(null)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full border-none"
                    src={activeVideoId.startsWith('http') ? activeVideoId : `https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                    title="Knowledge Video Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useTranslation } from '@/lib/translations'
import { 
  MessageCircle, 
  Heart, 
  Users, 
  UserPlus, 
  BookOpen, 
  Shield, 
  Star, 
  Info, 
  Calendar as CalendarIcon, 
  Trophy, 
  Plus, 
  Send, 
  Search, 
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  X,
  Pin
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { ALL_PARTS } from '@/lib/curriculum-data'
import { ALL_PARTS_EN } from '@/lib/curriculum-data-en'
import KnowledgeBank from '@/components/knowledge-bank'

// ── Types ──
interface Post {
  id: number
  author: string
  initials: string
  colorIdx: number
  role: string
  time: string
  category: string
  title: string
  content: string
  likes: number
  likedByUser?: boolean
  commentsCount: number
  comments: Comment[]
}

interface Comment {
  id: number
  author: string
  initials: string
  colorIdx: number
  role: string
  time: string
  content: string
}

interface LeaderboardUser {
  rank: number
  name: string
  initials: string
  level: number
  points: number
  streak: number
  colorIdx: number
  isCurrentUser?: boolean
}

// ── Mock Data ──
const AVATAR_COLORS = [
  'linear-gradient(135deg, #d4a053, #c4883a)',
  'linear-gradient(135deg, #a78bfa, #8b5cf6)',
  'linear-gradient(135deg, #34d399, #10b981)',
  'linear-gradient(135deg, #f87171, #ef4444)',
  'linear-gradient(135deg, #60a5fa, #3b82f6)',
  'linear-gradient(135deg, #fbbf24, #f59e0b)',
  'linear-gradient(135deg, #f472b6, #ec4899)',
  'linear-gradient(135deg, #38bdf8, #0ea5e9)',
  'linear-gradient(135deg, #a3e635, #84cc16)',
  'linear-gradient(135deg, #fb923c, #f97316)',
]

const CATEGORIES_ID = [
  { id: 'all', label: 'Semua', emoji: '📋' },
  { id: 'wins', label: 'Kemenangan (Wins)', emoji: '🏆' },
  { id: 'qna', label: 'Tanya Jawab', emoji: '💬' },
  { id: 'discussions', label: 'Diskusi', emoji: '🧠' },
  { id: 'resources', label: 'Sumber Daya', emoji: '📚' },
]

const CATEGORIES_EN = [
  { id: 'all', label: 'All', emoji: '📋' },
  { id: 'wins', label: 'Wins', emoji: '🏆' },
  { id: 'qna', label: 'Q&A', emoji: '💬' },
  { id: 'discussions', label: 'Discussions', emoji: '🧠' },
  { id: 'resources', label: 'Resources', emoji: '📚' },
]

const INITIAL_POSTS_ID: Post[] = [
  {
    id: 1,
    author: 'Toni Martin',
    initials: 'TM',
    colorIdx: 0,
    role: 'Premium',
    time: '2 jam lalu',
    category: 'wins',
    title: 'Closed Project Rp 120 Juta! Bukti Nyata SATS',
    content: 'Baru saja closing kontrak project Rp 120 juta! Teknik SATS yang saya pelajari di bagian 1 benar-benar works. Saya memvisualisasikan tanda tangan kontrak setiap malam sebelum tidur selama 2 minggu, sampai saya merasakan relief nyata (seolah sudah beres). Tiba-tiba klien lama menghubungi dan deal tanpa nego panjang. Percaya sama imajinasimu!',
    likes: 48,
    commentsCount: 3,
    comments: [
      { id: 101, author: 'Budi Santoso', initials: 'BS', colorIdx: 2, role: 'Premium', time: '1 jam lalu', content: 'Gokil mas! Selamat ya, menginspirasi banget.' },
      { id: 102, author: 'Sarah Wijaya', initials: 'SW', colorIdx: 1, role: 'Master', time: '45 mnt lalu', content: 'Adegan visualisasi pas tanda tangan kerasa natural banget ya mas?' },
      { id: 103, author: 'Toni Martin', initials: 'TM', colorIdx: 0, role: 'Premium', time: '30 mnt lalu', content: 'Iya mbak, kerasa pulpennya dingin sama kertasnya agak bertekstur.' }
    ]
  },
  {
    id: 2,
    author: 'Sarah Wijaya',
    initials: 'SW',
    colorIdx: 1,
    role: 'Master',
    time: '5 jam lalu',
    category: 'discussions',
    title: 'Bagaimana Menghadapi "Bridge of Incidents" yang Penuh Rintangan?',
    content: 'Ada yang pernah mengalami fenomena "bridge of incidents" (jembatan peristiwa) setelah konsisten berasumsi, tapi jalan di tengahnya malah penuh drama? Saya sedang merevisi karir saya, tapi mendadak ada restrukturisasi divisi di kantor. Saya tahu ini bagian dari jembatan, tapi bagaimana kalian menjaga mental agar tetap berasumsi positif di situasi kacau?',
    likes: 36,
    commentsCount: 2,
    comments: [
      { id: 104, author: 'Dimas Pratama', initials: 'DP', colorIdx: 9, role: 'Master', time: '3 jam lalu', content: 'Anggap itu sebagai proses pembongkaran fondasi lama mbak. Neville bilang jangan campuri cara terwujudnya.' },
      { id: 105, author: 'Sarah Wijaya', initials: 'SW', colorIdx: 1, role: 'Master', time: '2 jam lalu', content: 'Terima kasih mas Dimas, pengingat yang sangat bagus.' }
    ]
  },
  {
    id: 3,
    author: 'Budi Santoso',
    initials: 'BS',
    colorIdx: 2,
    role: 'Premium',
    time: '1 hari lalu',
    category: 'qna',
    title: 'Bedanya "Merasa Puas" vs "Wishful Thinking" dalam Praktik?',
    content: 'Gimana caranya membedakan antara "feeling" (mengalami kepuasan batin) dan "wishful thinking" (sekadar berkhayal)? Kadang saya merasa sudah berasumsi, tapi kalau dipikir lagi saya masih mendamba-dambakan di siang hari. Apakah ada tips praktis?',
    likes: 29,
    commentsCount: 1,
    comments: [
      { id: 106, author: 'Toni Martin', initials: 'TM', colorIdx: 0, role: 'Premium', time: '18 jam lalu', content: 'Kalau kamu masih mendamba di siang hari, berarti asumsimu belum mengeras di bawah sadar. SATS malamnya perlu diperdalam lagi mas sampai kerasa rilis.' }
    ]
  },
  {
    id: 4,
    author: 'Maya Devi',
    initials: 'MD',
    colorIdx: 3,
    role: 'Premium',
    time: '2 hari lalu',
    category: 'wins',
    title: 'Manifestasi Hubungan Sehat & Harmonis',
    content: 'Setelah 6 bulan konsisten shadow work dan mengubah konsep diri (self-concept), akhirnya berhasil merestorasi hubungan saya dengan pasangan. Dari yang penuh drama cemburu dan dingin, sekarang dia berubah drastis menjadi sangat perhatian dan suportif. Benar kata Neville: "No one to change but self."',
    likes: 67,
    commentsCount: 0,
    comments: []
  }
]

const INITIAL_POSTS_EN: Post[] = [
  {
    id: 1,
    author: 'Toni Martin',
    initials: 'TM',
    colorIdx: 0,
    role: 'Premium',
    time: '2 hours ago',
    category: 'wins',
    title: 'Closed 120 Million IDR Project! Concrete Proof of SATS',
    content: 'Just closed a project contract for 120 Million IDR! The SATS technique I learned in Part 1 really works. I visualized signing the contract every night before bed for 2 weeks until I felt a real sense of relief (as if it was already done). Suddenly, an old client reached out and we sealed the deal without lengthy negotiations. Believe in your imagination!',
    likes: 48,
    commentsCount: 3,
    comments: [
      { id: 101, author: 'Budi Santoso', initials: 'BS', colorIdx: 2, role: 'Premium', time: '1 hour ago', content: 'Awesome, bro! Huge congratulations, so inspiring.' },
      { id: 102, author: 'Sarah Wijaya', initials: 'SW', colorIdx: 1, role: 'Master', time: '45 mins ago', content: 'Did the visualization of the contract signing feel very natural?' },
      { id: 103, author: 'Toni Martin', initials: 'TM', colorIdx: 0, role: 'Premium', time: '30 mins ago', content: 'Yes, Sarah. I could feel the cold pen and the slightly textured paper.' }
    ]
  },
  {
    id: 2,
    author: 'Sarah Wijaya',
    initials: 'SW',
    colorIdx: 1,
    role: 'Master',
    time: '5 hours ago',
    category: 'discussions',
    title: 'How to Handle an Obstacle-Filled "Bridge of Incidents"?',
    content: 'Has anyone experienced the "bridge of incidents" phenomenon after consistently assuming, but the path in the middle becomes full of drama? I am revising my career, but suddenly there is a division restructuring at work. I know this is part of the bridge, but how do you keep your mind in a positive assumption in a chaotic situation?',
    likes: 36,
    commentsCount: 2,
    comments: [
      { id: 104, author: 'Dimas Pratama', initials: 'DP', colorIdx: 9, role: 'Master', time: '3 hours ago', content: 'Think of it as the dismantling of the old foundation, Sarah. Neville said not to interfere with the way it manifests.' },
      { id: 105, author: 'Sarah Wijaya', initials: 'SW', colorIdx: 1, role: 'Master', time: '2 hours ago', content: 'Thank you, Dimas, that is a very good reminder.' }
    ]
  },
  {
    id: 3,
    author: 'Budi Santoso',
    initials: 'BS',
    colorIdx: 2,
    role: 'Premium',
    time: '1 day ago',
    category: 'qna',
    title: 'Difference Between "Feeling Satisfied" vs "Wishful Thinking" in Practice?',
    content: 'How do you distinguish between "feeling" (experiencing inner satisfaction) and "wishful thinking" (just daydreaming)? Sometimes I feel like I have assumed, but thinking back I still long for it during the day. Any practical tips?',
    likes: 29,
    commentsCount: 1,
    comments: [
      { id: 106, author: 'Toni Martin', initials: 'TM', colorIdx: 0, role: 'Premium', time: '18 hours ago', content: 'If you still long for it during the day, it means your assumption has not hardened in the subconscious. Your nightly SATS needs to be deepened until you feel relief.' }
    ]
  },
  {
    id: 4,
    author: 'Maya Devi',
    initials: 'MD',
    colorIdx: 3,
    role: 'Premium',
    time: '2 days ago',
    category: 'wins',
    title: 'Manifestation of a Healthy & Harmonious Relationship',
    content: 'After 6 months of consistent shadow work and changing self-concept, I finally succeeded in restoring my relationship with my partner. From being full of jealousy drama and coldness, now he changed drastically to be very attentive and supportive. Neville is right: "No one to change but self."',
    likes: 67,
    commentsCount: 0,
    comments: []
  }
]

const UPCOMING_EVENTS_ID = [
  {
    id: 1,
    title: 'Weekly Live Group Meditation & SATS',
    date: 'Setiap Kamis',
    time: '21:00 - 22:00 WIB',
    desc: 'Induksi kelompok masuk ke kondisi Theta dipandu langsung oleh Bang Nevgo. Kita memvisualisasikan keinginan masing-masing secara serentak.',
    link: 'https://zoom.us/j/meet-sats',
    type: 'Zoom Meeting'
  },
  {
    id: 2,
    title: 'Sesi Q&A & Bedah Kasus Asumsi',
    date: 'Sabtu, 30 Mei 2026',
    time: '16:00 - 17:30 WIB',
    desc: 'Ajukan rintangan praktik harian Anda. Kita bedah adegan imajinasi SATS dan cara melakukan revisi hari secara interaktif.',
    link: 'https://zoom.us/j/meet-qa',
    type: 'Zoom Meeting'
  },
  {
    id: 3,
    title: 'Masterclass: Reprogramming Inner Shadow',
    date: 'Minggu, 14 Juni 2026',
    time: '19:00 - 21:00 WIB',
    desc: 'Khusus tier Master. Mengurai limiting belief terdalam dan mengintegrasikan aspek bayangan diri agar manifestasi tidak terhambat.',
    link: 'https://zoom.us/j/meet-vip',
    type: 'VIP Zoom Masterclass'
  }
]

const UPCOMING_EVENTS_EN = [
  {
    id: 1,
    title: 'Weekly Live Group Meditation & SATS',
    date: 'Every Thursday',
    time: '21:00 - 22:00 WIB',
    desc: 'Group induction into Theta state guided directly by Bang Nevgo. We visualize our respective desires simultaneously.',
    link: 'https://zoom.us/j/meet-sats',
    type: 'Zoom Meeting'
  },
  {
    id: 2,
    title: 'Q&A Session & Assumption Case Study',
    date: 'Saturday, May 30, 2026',
    time: '16:00 - 17:30 WIB',
    desc: 'Submit your daily practice obstacles. We interactively analyze SATS imagination scenes and daily revision methods.',
    link: 'https://zoom.us/j/meet-qa',
    type: 'Zoom Meeting'
  },
  {
    id: 3,
    title: 'Masterclass: Reprogramming Inner Shadow',
    date: 'Sunday, June 14, 2026',
    time: '19:00 - 21:00 WIB',
    desc: 'Exclusive for Master tier. Unravel deepest limiting beliefs and integrate shadow aspects so manifestation is not hindered.',
    link: 'https://zoom.us/j/meet-vip',
    type: 'VIP Zoom Masterclass'
  }
]

const INITIAL_LEADERBOARD = [
  { rank: 1, name: 'Dimas Pratama', initials: 'DP', level: 6, points: 2450, streak: 12, colorIdx: 9 },
  { rank: 2, name: 'Sarah Wijaya', initials: 'SW', level: 5, points: 1840, streak: 8, colorIdx: 1 },
  { rank: 3, name: 'Toni Martin', initials: 'TM', level: 4, points: 1250, streak: 15, colorIdx: 0 },
  { rank: 4, name: 'Maya Devi', initials: 'MD', level: 4, points: 1100, streak: 5, colorIdx: 3 },
  { rank: 5, name: 'Budi Santoso', initials: 'BS', level: 3, points: 850, streak: 3, colorIdx: 2 },
  { rank: 6, name: 'Rina Kartika', initials: 'RK', level: 3, points: 720, streak: 0, colorIdx: 4 },
  { rank: 7, name: 'Fajar Nugroho', initials: 'FN', level: 2, points: 410, streak: 2, colorIdx: 7 }
]

const LEVEL_REWARDS_ID = [
  { level: 1, name: 'Pengembara Kesadaran', pointsReq: 0, reward: 'Akses 3 Pelajaran Dasar & Buku Panduan Gratis' },
  { level: 2, name: 'Asumtif Junior', pointsReq: 200, reward: 'Membuka Audio Meditasi SATS & Diagnosa Limiting Belief' },
  { level: 3, name: 'Penyelaras Perasaan', pointsReq: 600, reward: 'Membuka Meditasi Kemakmuran & Reprogramming Diri' },
  { level: 4, name: 'Guru Imajinasi', pointsReq: 1000, reward: 'Membuka Jurnal SATS PDF & Akses Shadow Work Diagnosa' },
  { level: 5, name: 'Master Manifestasi', pointsReq: 1500, reward: 'Membuka Sesi Tanya Jawab Privat & 2 Rekaman Webinar VIP' },
  { level: 6, name: 'Kesadaran Ilahi', pointsReq: 2200, reward: 'Membuka Seluruh Rekaman Webinar VIP & Prioritas Konsultasi' }
]

const LEVEL_REWARDS_EN = [
  { level: 1, name: 'Consciousness Wanderer', pointsReq: 0, reward: 'Access to 3 Basic Lessons & Free Guidebook' },
  { level: 2, name: 'Junior Assumer', pointsReq: 200, reward: 'Unlock SATS Meditation Audio & Limiting Belief Diagnosis' },
  { level: 3, name: 'Feeling Aligner', pointsReq: 600, reward: 'Unlock Prosperity Meditation & Self-Reprogramming' },
  { level: 4, name: 'Imagination Guru', pointsReq: 1000, reward: 'Unlock SATS Journal PDF & Shadow Work Diagnosis' },
  { level: 5, name: 'Manifestation Master', pointsReq: 1500, reward: 'Unlock Private Q&A Session & 2 VIP Webinar Recordings' },
  { level: 6, name: 'Divine Consciousness', pointsReq: 2200, reward: 'Unlock All VIP Webinar Recordings & Priority Consultation' }
]

export default function CommunityPage() {
  const { setView, hasCommunityAccess, userName, subscriptionTier } = useAppStore()
  const { t, language } = useTranslation()

  const activeCategories = language === 'en' ? CATEGORIES_EN : CATEGORIES_ID
  const activeEvents = language === 'en' ? UPCOMING_EVENTS_EN : UPCOMING_EVENTS_ID
  const activeLevelRewards = language === 'en' ? LEVEL_REWARDS_EN : LEVEL_REWARDS_ID
  
  // ── States ──
  const [activeTab, setActiveTab] = useState<'feed' | 'classroom' | 'calendar' | 'leaderboard' | 'knowledge' | 'about'>('feed')
  const [posts, setPosts] = useState<Post[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'active' | 'popular' | 'newest'>('newest')
  
  // Collapsible Pinned Welcome Video State
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(true)

  useEffect(() => {
    const isHidden = localStorage.getItem('nv-hide-welcome-video') === 'true'
    if (isHidden) {
      setShowWelcomeVideo(false)
    }
  }, [])

  // Sync posts when language changes (keeps user-created posts)
  useEffect(() => {
    setPosts(prev => {
      const targetMocks = language === 'en' ? INITIAL_POSTS_EN : INITIAL_POSTS_ID
      const sourceMocks = language === 'en' ? INITIAL_POSTS_ID : INITIAL_POSTS_EN
      if (prev.length === 0) {
        return targetMocks
      }
      return prev.map(p => {
        const mockMatch = sourceMocks.find(m => m.id === p.id)
        if (mockMatch) {
          return targetMocks.find(m => m.id === p.id) || p
        }
        return p
      })
    })
  }, [language])

  // Pricing/Upgrade modal state for non-premium users attempting interactions
  const [showPricingModal, setShowPricingModal] = useState(false)
  
  // Lightbox state for flyer preview zoom
  const [showFlyerLightbox, setShowFlyerLightbox] = useState(false)
  
  // Post Creator States
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newCategory, setNewCategory] = useState('discussions')

  // Comment Dialog State
  const [activePostComments, setActivePostComments] = useState<Post | null>(null)
  const [commentText, setCommentText] = useState('')
  
  const handleClose = () => setActivePostComments(null)

  // Simulated Current User Profile
  const [userPoints, setUserPoints] = useState(380)
  const [userLevel, setUserLevel] = useState(2)
  const [userStreak, setUserStreak] = useState(4)

  const isAccessAllowed = hasCommunityAccess()

  // ── Handlers ──
  const handleLikePost = (postId: number) => {
    if (!isAccessAllowed) {
      setShowPricingModal(true)
      return
    }
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const liked = !post.likedByUser
        return {
          ...post,
          likedByUser: liked,
          likes: liked ? post.likes + 1 : post.likes - 1
        }
      }
      return post
    }))
    // Gain points for interacting (simulate)
    setUserPoints(prev => prev + 5)
    toast(language === 'en' ? '✦ You received +5 Points!' : '✦ Anda mendapatkan +5 Poin!')
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newContent) {
      toast.error(language === 'en' ? 'Please complete the title and content' : 'Mohon lengkapi judul dan konten postingan')
      return
    }

    const newPost: Post = {
      id: Date.now(),
      author: userName || 'Pengguna Baru',
      initials: (userName || 'PB').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      colorIdx: Math.floor(Math.random() * AVATAR_COLORS.length),
      role: subscriptionTier.toUpperCase(),
      time: language === 'en' ? 'Just now' : 'Baru saja',
      category: newCategory,
      title: newTitle,
      content: newContent,
      likes: 0,
      commentsCount: 0,
      comments: []
    }

    setPosts(prev => [newPost, ...prev])
    setIsCreatingPost(false)
    setNewTitle('')
    setNewContent('')
    setUserPoints(prev => prev + 25)
    toast.success(language === 'en' ? 'Post published! You received +25 Points! 🏆' : 'Postingan diterbitkan! Anda mendapatkan +25 Poin! 🏆')
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !activePostComments) return

    const newComment: Comment = {
      id: Date.now(),
      author: userName || 'Pengguna Baru',
      initials: (userName || 'PB').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      colorIdx: 2,
      role: subscriptionTier.toUpperCase(),
      time: language === 'en' ? 'Just now' : 'Baru saja',
      content: commentText
    }

    setPosts(prev => prev.map(p => {
      if (p.id === activePostComments.id) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment]
        }
      }
      return p
    }))

    // Sync modal view
    setActivePostComments(prev => prev ? {
      ...prev,
      commentsCount: prev.commentsCount + 1,
      comments: [...prev.comments, newComment]
    } : null)

    setCommentText('')
    setUserPoints(prev => prev + 10)
    toast.success(language === 'en' ? 'Comment added! +10 Points!' : 'Komentar ditambahkan! +10 Poin!')
  }

  // ── Filters & Sorting ──
  const filteredPosts = posts
    .filter(p => activeCategory === 'all' ? true : p.category === activeCategory)
    .filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'popular') return b.likes - a.likes
      if (sortBy === 'active') return b.commentsCount - a.commentsCount
      return b.id - a.id // newest
    })

  // ── Gamification Calculations ──
  const currentLevelInfo = activeLevelRewards.find(l => l.level === userLevel) || activeLevelRewards[0]
  const nextLevelInfo = activeLevelRewards.find(l => l.level === userLevel + 1)
  
  // Auto-level up check
  if (nextLevelInfo && userPoints >= nextLevelInfo.pointsReq) {
    setUserLevel(userLevel + 1)
    toast.success(language === 'en' ? `🎉 LEVEL UP! Congratulations, you are now Level ${userLevel + 1}: ${nextLevelInfo.name}!` : `🎉 LEVEL UP! Selamat Anda sekarang Level ${userLevel + 1}: ${nextLevelInfo.name}!`)
  }

  const pointsProgress = nextLevelInfo 
    ? ((userPoints - currentLevelInfo.pointsReq) / (nextLevelInfo.pointsReq - currentLevelInfo.pointsReq)) * 100 
    : 100

  // Build simulated Leaderboard including current user
  const leaderboardData: LeaderboardUser[] = [
    ...INITIAL_LEADERBOARD,
    {
      rank: 0, // calculated dynamically below
      name: `${userName || (language === 'en' ? 'You' : 'Anda')} (${language === 'en' ? 'You' : 'Kamu'})`,
      initials: (userName || 'PB').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      level: userLevel,
      points: userPoints,
      streak: userStreak,
      colorIdx: 5,
      isCurrentUser: true
    }
  ]
  .sort((a, b) => b.points - a.points)
  .map((user, idx) => ({ ...user, rank: idx + 1 }))

  const currentUserRank = leaderboardData.find(u => u.isCurrentUser)?.rank || 8

  return (
    <div className="nv-page min-h-screen bg-[#0a0a0c] text-[#e8e4dc] pb-12">
      {/* Preview Mode Alert Banner */}
      {!isAccessAllowed && (
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-b border-amber-500/30 px-6 py-2.5 backdrop-blur-md">
          <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-amber-500 font-bold m-0 flex items-center gap-1.5">
              <span>{language === 'en' ? '🔒 You are in Preview Mode. Upgrade to discuss, unlock Classroom, and join Live Zoom.' : '🔒 Anda berada dalam Mode Pratinjau. Upgrade untuk berdiskusi, membuka Classroom, dan join Live Zoom.'}</span>
            </p>
            <button 
              onClick={() => setView('pricing')} 
              className="text-[10px] font-bold text-neutral-950 bg-amber-500 hover:bg-[#e2b36e] px-3 py-1.5 rounded-lg transition uppercase tracking-wider cursor-pointer"
            >
              {language === 'en' ? 'Unlock Premium Access' : 'Buka Akses Premium'}
            </button>
          </div>
        </div>
      )}
      {/* ── Sub Header / Banner ── */}
      <section className="nv-community-header">
        <button className="nv-community-back-btn" onClick={() => setView('dashboard')}>
          {language === 'en' ? '← Learning Dashboard' : '← Dasbor Pembelajaran'}
        </button>
        <div className="nv-community-header-glow" />
        <div className="nv-community-header-inner">
          <div className="nv-community-logo">
            <img src="/community-logo.jpg" alt="AKU ANAK LOAS Logo" />
          </div>
          <div className="nv-community-header-info">
            <h1 className="nv-community-header-name text-3xl sm:text-4xl md:text-5xl font-black tracking-wider uppercase bg-gradient-to-r from-[#d4a053] via-[#f5c67a] to-[#c4883a] bg-clip-text text-transparent drop-shadow-lg leading-tight">
              AKU ANAK LOAS
            </h1>
            <p className="nv-community-header-desc text-xs sm:text-sm text-neutral-300 tracking-wide mt-1.5 font-medium">
              {language === 'en'
                ? 'Co-Learning Community Forum for Neville Goddard’s Pure Teaching - Law of Assumption'
                : 'Forum Komunitas Belajar Bersama Pure Teaching Neville Goddard - Law of Assumption'
              }
            </p>
          </div>
        </div>
      </section>

      {/* ── Skool Tabs bar ── */}
      <nav className="nv-community-tabs bg-[#111114]/90 backdrop-blur-md sticky top-0 z-40 border-b border-neutral-900">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-14">
          <div className="flex flex-nowrap gap-1 h-full overflow-x-auto whitespace-nowrap scrollbar-none max-w-full">
            <button 
              className={`nv-tab-btn h-full border-b-2 rounded-none px-4 flex items-center gap-2 text-sm font-bold shrink-0 ${activeTab === 'feed' ? 'border-[#d4a053] text-[#d4a053]' : 'border-transparent text-neutral-400'}`}
              onClick={() => setActiveTab('feed')}
            >
              {language === 'en' ? '💬 Discussion' : '💬 Diskusi'}
            </button>
            <button 
              className={`nv-tab-btn h-full border-b-2 rounded-none px-4 flex items-center gap-2 text-sm font-bold shrink-0 ${activeTab === 'classroom' ? 'border-[#d4a053] text-[#d4a053]' : 'border-transparent text-neutral-400'}`}
              onClick={() => setActiveTab('classroom')}
            >
              {language === 'en' ? '📚 Classroom' : '📚 Classroom'}
            </button>
            <button 
              className={`nv-tab-btn h-full border-b-2 rounded-none px-4 flex items-center gap-2 text-sm font-bold shrink-0 ${activeTab === 'calendar' ? 'border-[#d4a053] text-[#d4a053]' : 'border-transparent text-neutral-400'}`}
              onClick={() => setActiveTab('calendar')}
            >
              {language === 'en' ? '📅 Calendar' : '📅 Kalender Sesi'}
            </button>
            <button 
              className={`nv-tab-btn h-full border-b-2 rounded-none px-4 flex items-center gap-2 text-sm font-bold shrink-0 ${activeTab === 'leaderboard' ? 'border-[#d4a053] text-[#d4a053]' : 'border-transparent text-neutral-400'}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              {language === 'en' ? '🏆 Leaderboard' : '🏆 Leaderboard'}
            </button>
            <button 
              className={`nv-tab-btn h-full border-b-2 rounded-none px-4 flex items-center gap-2 text-sm font-bold shrink-0 ${activeTab === 'knowledge' ? 'border-[#d4a053] text-[#d4a053]' : 'border-transparent text-neutral-400'}`}
              onClick={() => setActiveTab('knowledge')}
            >
              {language === 'en' ? '🧠 Knowledge Bank' : '🧠 Bank Knowledge'}
            </button>
            <button 
              className={`nv-tab-btn h-full border-b-2 rounded-none px-4 flex items-center gap-2 text-sm font-bold shrink-0 ${activeTab === 'about' ? 'border-[#d4a053] text-[#d4a053]' : 'border-transparent text-neutral-400'}`}
              onClick={() => setActiveTab('about')}
            >
              {language === 'en' ? 'ℹ️ About' : 'ℹ️ Tentang'}
            </button>
          </div>

          {/* Points Progress Mini Card (Top Right) */}
          <div className="hidden md:flex items-center gap-3 bg-neutral-900/60 border border-neutral-800/80 px-3 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
              <Award size={14} />
              <span>Lv. {userLevel}</span>
            </div>
            <div className="w-20 bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pointsProgress}%` }} />
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">{userPoints} pts</span>
            
            <div className="flex items-center gap-1 text-[#f87171] font-bold text-xs">
              <Flame size={14} className="fill-current" />
              <span>{language === 'en' ? `${userStreak} days` : `${userStreak} hari`}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main Community Layout ── */}
      <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: ACTIVE PAGE VIEW */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* 1. DISCUSSIONS / FEED VIEW */}
            {activeTab === 'feed' && (
              <motion.div
                key="feed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {/* Collapsible Welcome Pinned Video */}
                {showWelcomeVideo ? (
                  <motion.div 
                    className="nv-premium-glass border border-amber-500/20 p-5 rounded-2xl relative overflow-hidden flex flex-col gap-4 shadow-xl"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-[#d4a053] font-mono text-[9px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                          <Pin size={10} className="rotate-45" />
                          <span>{language === 'en' ? 'Pinned' : 'Tersemat'}</span>
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-white m-0">
                          {language === 'en'
                            ? 'Welcome & Inner Orientation Guide (Must Watch!) 🎬'
                            : 'Selamat Datang & Panduan Batin (Wajib Tonton!) 🎬'
                          }
                        </h3>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setShowWelcomeVideo(false)
                          localStorage.setItem('nv-hide-welcome-video', 'true')
                          toast.info(
                            language === 'en'
                              ? 'Orientation video hidden. You can show it again anytime.'
                              : 'Video panduan disembunyikan. Anda dapat membukanya kembali kapan saja.'
                          )
                        }}
                        className="text-neutral-500 hover:text-white p-1 rounded-lg bg-neutral-900/40 hover:bg-neutral-900 transition border border-neutral-800"
                        title={language === 'en' ? 'Hide Video' : 'Sembunyikan Video'}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-7">
                        <div className="relative w-full rounded-xl overflow-hidden border border-neutral-850 shadow-2xl bg-neutral-950" style={{ aspectRatio: '16/9' }}>
                          <iframe
                            className="absolute top-0 left-0 w-full h-full border-none"
                            src="https://www.youtube.com/embed/LrklTcrYYFw"
                            title="Panduan Neville Goddard Indonesia"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                      
                      <div className="md:col-span-5 flex flex-col gap-2">
                        <h4 className="text-[10px] font-bold text-amber-500 font-outfit uppercase tracking-wider m-0">
                          {language === 'en' ? 'MESSAGE FROM BANG NEVGO' : 'PESAN DARI BANG NEVGO'}
                        </h4>
                        <p className="text-[11px] text-neutral-400 leading-relaxed m-0">
                          {language === 'en'
                            ? 'This video summarizes the basics of practicing SATS (State Akin to Sleep), how to interactively revise your day, and how to participate actively to level up in the community leaderboard to unlock VIP material rewards.'
                            : 'Video ini merangkum dasar melatih SATS (State Allied to Sleep), cara merevisi hari secara interaktif, dan cara berpartisipasi aktif untuk naik peringkat di leaderboard komunitas demi membuka hadiah materi VIP.'
                          }
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button 
                            onClick={() => setActiveTab('classroom')} 
                            className="nv-activation-widget-btn py-1.5 px-3 rounded-lg text-[10px] w-auto font-bold flex items-center gap-1 shadow-md"
                          >
                            {language === 'en' ? 'Explore Classroom' : 'Jelajahi Classroom'}
                          </button>
                          <button 
                            onClick={() => setActiveTab('calendar')} 
                            className="bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 py-1.5 px-3 rounded-lg text-[10px] w-auto font-bold transition"
                          >
                            {language === 'en' ? 'Live Zoom Schedule' : 'Jadwal Live Zoom'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex justify-end">
                    <button 
                      onClick={() => {
                        setShowWelcomeVideo(true)
                        localStorage.removeItem('nv-hide-welcome-video')
                      }}
                      className="text-[10px] font-bold text-amber-500 hover:text-[#e2b36e] flex items-center gap-1.5 bg-[#d4a053]/10 border border-[#d4a053]/20 px-3 py-1.5 rounded-lg transition"
                    >
                      <Pin size={10} className="rotate-45" />
                      {language === 'en' ? 'Show Pinned Guide Video 🎬' : 'Tampilkan Video Panduan Pinned 🎬'}
                    </button>
                  </div>
                )}

                {/* Search and Sort Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-neutral-950/40 p-3 rounded-xl border border-neutral-900">
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      placeholder={language === 'en' ? 'Search posts...' : 'Cari postingan...'}
                      className="w-full bg-neutral-900/60 border border-neutral-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#e8e4dc] outline-none focus:border-amber-500/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
                    <SlidersHorizontal size={12} className="text-neutral-500" />
                    <button 
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${sortBy === 'newest' ? 'bg-[#d4a053]/15 text-[#d4a053]' : 'text-neutral-400 hover:text-white'}`}
                      onClick={() => setSortBy('newest')}
                    >
                      {language === 'en' ? 'Newest' : 'Terbaru'}
                    </button>
                    <button 
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${sortBy === 'popular' ? 'bg-[#d4a053]/15 text-[#d4a053]' : 'text-neutral-400 hover:text-white'}`}
                      onClick={() => setSortBy('popular')}
                    >
                      {language === 'en' ? 'Popular' : 'Populer'}
                    </button>
                    <button 
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${sortBy === 'active' ? 'bg-[#d4a053]/15 text-[#d4a053]' : 'text-neutral-400 hover:text-white'}`}
                      onClick={() => setSortBy('active')}
                    >
                      {language === 'en' ? 'Active' : 'Aktif'}
                    </button>
                  </div>
                </div>

                {/* Categories Scrollbar */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {activeCategories.map(cat => (
                    <button
                      key={cat.id}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition ${
                        activeCategory === cat.id 
                          ? 'bg-[#d4a053] text-[#0a0a0c] border-[#d4a053]' 
                          : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Write Something trigger */}
                {!isCreatingPost ? (
                  <div 
                    className="nv-premium-glass p-4 cursor-pointer flex items-center gap-3 border border-neutral-900 hover:border-amber-500/20 transition"
                    onClick={() => {
                      if (!isAccessAllowed) {
                        setShowPricingModal(true)
                      } else {
                        setIsCreatingPost(true)
                      }
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-xs">
                      {(userName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-neutral-500 flex-1">
                      {language === 'en' ? 'Share your assumption wins or ask a question...' : 'Bagikan kemenangan asumsi atau tanyakan sesuatu...'}
                    </span>
                    <Plus size={16} className="text-neutral-400" />
                  </div>
                ) : (
                  <motion.form 
                    onSubmit={handleCreatePost}
                    className="nv-premium-glass p-5 border border-amber-500/20 flex flex-col gap-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                      <span className="text-xs font-bold text-amber-500">
                        {language === 'en' ? 'WRITE NEW POST' : 'TULIS POSTINGAN BARU'}
                      </span>
                      <button 
                        type="button" 
                        className="text-neutral-500 hover:text-white text-xs"
                        onClick={() => setIsCreatingPost(false)}
                      >
                        {language === 'en' ? 'Cancel' : 'Batal'}
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder={language === 'en' ? 'Post title...' : 'Judul postingan...'}
                        required
                        className="w-full bg-transparent border-none text-sm font-bold text-white outline-none placeholder:text-neutral-600"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      
                      <textarea
                        placeholder={language === 'en' ? 'Write your experience or question in detail here...' : 'Tuliskan pengalaman atau pertanyaan Anda secara mendalam disini...'}
                        required
                        rows={5}
                        className="w-full bg-transparent border-none text-xs text-neutral-300 outline-none resize-none placeholder:text-neutral-600 leading-relaxed"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-neutral-900 pt-3 mt-2">
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-neutral-500 uppercase font-mono">
                          {language === 'en' ? 'CHOOSE CATEGORY:' : 'PILIH KATEGORI:'}
                        </span>
                        <select 
                          className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-[#e8e4dc] outline-none"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        >
                          <option value="discussions">{language === 'en' ? 'Discussion 🧠' : 'Diskusi 🧠'}</option>
                          <option value="wins">{language === 'en' ? 'Wins 🏆' : 'Kemenangan (Wins) 🏆'}</option>
                          <option value="qna">{language === 'en' ? 'Q&A 💬' : 'Tanya Jawab 💬'}</option>
                          <option value="resources">{language === 'en' ? 'Resources 📚' : 'Sumber Daya 📚'}</option>
                        </select>
                      </div>

                      <button type="submit" className="nv-auth-submit-btn py-2 px-6 w-auto flex gap-1.5 items-center">
                        <Send size={13} />
                        <span>{language === 'en' ? 'Submit Post' : 'Kirim Post'}</span>
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Posts Feed list */}
                {filteredPosts.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {filteredPosts.map((post, idx) => (
                      <motion.div
                        key={post.id}
                        className="nv-premium-glass p-5 flex flex-col gap-4 border border-neutral-900 hover:border-neutral-800/80 transition"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0a0c]"
                              style={{ background: AVATAR_COLORS[post.colorIdx] }}
                            >
                              {post.initials}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-neutral-200">{post.author}</span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold uppercase rounded">
                                  {post.role}
                                </span>
                              </div>
                              <span className="text-[10px] text-neutral-500 font-mono mt-0.5">{post.time}</span>
                            </div>
                          </div>
                          
                          <span className="text-xs bg-neutral-900/60 border border-neutral-800 px-2.5 py-0.5 rounded-full text-neutral-400 flex items-center gap-1 font-semibold">
                            {activeCategories.find(c => c.id === post.category)?.emoji} {activeCategories.find(c => c.id === post.category)?.label}
                          </span>
                        </div>

                        {/* Title & Content */}
                        <div className="flex flex-col gap-1">
                          <h3 className="text-sm sm:text-base font-bold text-[#e8e4dc] m-0 leading-snug">{post.title}</h3>
                          <p className="text-xs text-neutral-300 leading-relaxed m-0 mt-2 whitespace-pre-wrap">{post.content}</p>
                        </div>

                        {/* Actions footer bar */}
                        <div className="flex justify-between items-center border-t border-neutral-900/50 pt-3 mt-1">
                          <div className="flex items-center gap-4">
                            <button 
                              className={`flex items-center gap-1.5 text-xs bg-transparent border-none cursor-pointer transition ${post.likedByUser ? 'text-red-500 font-bold' : 'text-neutral-400 hover:text-white'}`}
                              onClick={() => handleLikePost(post.id)}
                            >
                              <Heart size={14} className={post.likedByUser ? 'fill-current' : ''} />
                              <span>{post.likes}</span>
                            </button>
                            
                            <button 
                              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-transparent border-none cursor-pointer"
                              onClick={() => {
                                if (!isAccessAllowed) {
                                  setShowPricingModal(true)
                                } else {
                                  setActivePostComments(post)
                                }
                              }}
                            >
                              <MessageCircle size={14} />
                              <span>{post.commentsCount} {language === 'en' ? 'Comments' : 'Komentar'}</span>
                            </button>
                          </div>
                          
                          <span className="text-[10px] text-neutral-600 font-mono">
                            {language === 'en' ? 'Earn +5 pts for liking posts' : 'Dapatkan +5 pts untuk menyukai postingan'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-neutral-900 rounded-xl">
                    <span className="text-4xl">📭</span>
                    <p className="text-sm font-bold text-neutral-400 mt-2">
                      {language === 'en' ? 'No discussions found' : 'Tidak ada diskusi ditemukan'}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                      {language === 'en'
                        ? 'Try searching with other keywords or choose a different category.'
                        : 'Coba cari dengan kata kunci lain atau pilih kategori yang sesuai.'
                      }
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. CLASSROOM VIEW (Nested structured 49 lessons catalog) */}
            {activeTab === 'classroom' && (
              <motion.div
                key="classroom"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-[#e8e4dc] leading-tight m-0">
                    {language === 'en' ? '📚 Classroom: Assumption Curriculum' : '📚 Classroom: Kurikulum Asumsi'}
                  </h2>
                  <p className="text-xs text-neutral-400 m-0 mt-1">
                    {language === 'en'
                      ? 'Use this tab to jump directly to the 10-part learning curriculum.'
                      : 'Gunakan tab ini untuk melompat langsung ke kurikulum pembelajaran 10 bagian.'
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(language === 'en' ? ALL_PARTS_EN : ALL_PARTS).map((part, idx) => (
                    <motion.div
                      key={part.id}
                      className="nv-pdf-card nv-premium-glass p-5 border border-neutral-900 hover:border-amber-500/20 transition flex flex-col justify-between"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if (!isAccessAllowed) {
                          setShowPricingModal(true)
                        } else {
                          setView('dashboard')
                        }
                      }}
                      whileHover={{ y: -2 }}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-amber-500 font-mono font-bold">{part.num}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {part.lessons.length} {language === 'en' ? 'Lessons' : 'Pelajaran'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#e8e4dc] m-0 mt-1 line-clamp-1">{part.title}</h3>
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed m-0 mt-1.5">{part.description}</p>
                      </div>
                      <span className="text-[11px] text-[#d4a053] font-semibold mt-4 flex items-center gap-1">
                        {language === 'en' ? 'Open in Dashboard' : 'Buka di Dasbor'} <ChevronRight size={12} />
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. CALENDAR SESSION EVENTS VIEW */}
            {activeTab === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-[#e8e4dc] leading-tight m-0">
                    {language === 'en' ? '📅 Live Community Sessions Schedule' : '📅 Jadwal Sesi Live Komunitas'}
                  </h2>
                  <p className="text-xs text-neutral-400 m-0 mt-1">
                    {language === 'en'
                      ? 'Don’t miss the simultaneous meditation sessions and interactive case studies with other practitioners.'
                      : 'Jangan lewatkan sesi meditasi serentak dan bedah kasus interaktif bersama praktisi lainnya.'
                    }
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {activeEvents.map(event => (
                    <div 
                      key={event.id} 
                      className="nv-pdf-card nv-premium-glass p-5 border border-neutral-900 flex flex-col md:flex-row justify-between md:items-center gap-4"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col items-center justify-center text-amber-500 shrink-0">
                          <CalendarIcon size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono px-2 py-0.5 rounded">
                              {event.type}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-mono">{event.date} • {event.time}</span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-[#e8e4dc] m-0 mt-1">{event.title}</h3>
                          <p className="text-xs text-neutral-400 leading-relaxed m-0 mt-1.5 max-w-xl">{event.desc}</p>
                        </div>
                      </div>
                      
                      {!isAccessAllowed ? (
                        <button 
                          onClick={() => setShowPricingModal(true)}
                          className="nv-pdf-download-btn flex gap-1.5 items-center justify-center text-center py-2 px-5 shrink-0 cursor-pointer"
                          style={{ height: 'max-content' }}
                        >
                          <span>{language === 'en' ? 'Join Session' : 'Join Sesi'}</span>
                          <ExternalLink size={12} />
                        </button>
                      ) : (
                        <a 
                          href={event.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="nv-pdf-download-btn flex gap-1.5 items-center justify-center text-center py-2 px-5 shrink-0"
                          style={{ height: 'max-content' }}
                        >
                          <span>{language === 'en' ? 'Join Session' : 'Join Sesi'}</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 4. LEADERBOARD / GAMIFICATION DETAILS VIEW */}
            {activeTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                {/* Current User rank banner */}
                <div className="nv-pricing-cta-section p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6 text-left" style={{ margin: 0 }}>
                  <div>
                    <h3 className="text-sm font-bold text-amber-500 m-0 uppercase font-mono tracking-wider flex items-center gap-1.5">
                      <Trophy size={14} /> {language === 'en' ? 'Your Leaderboard Rank' : 'Posisi Peringkat Anda'}
                    </h3>
                    <h2 className="text-xl font-black text-white m-0 mt-1">
                      {language === 'en' ? `Rank #${currentUserRank} of 885 Members` : `Peringkat #${currentUserRank} dari 885 Anggota`}
                    </h2>
                    <p className="text-xs text-neutral-300 leading-relaxed m-0 mt-1">
                      {language === 'en'
                        ? 'Earn points by sharing assumption wins (+25), commenting (+10), or getting liked (+5) by other members.'
                        : 'Kumpulkan poin dengan membagikan kemenangan asumsi (+25), berkomentar (+10), atau disukai (+5) oleh anggota lainnya.'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl px-5 py-3 flex flex-col items-center justify-center shrink-0 w-36 text-center">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                      {language === 'en' ? 'Current Level' : 'Level Saat Ini'}
                    </span>
                    <span className="text-3xl font-black text-amber-500 mt-1">{userLevel}</span>
                    <span className="text-[10px] text-neutral-400 font-semibold truncate w-full px-1">{currentLevelInfo.name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Top Members List */}
                  <div className="md:col-span-2 flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2 m-0">
                      {language === 'en' ? '🏆 LEADERBOARD RANKINGS (ALL TIME)' : '🏆 KELAS UTAMA PERINGKAT (ALL TIME)'}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {leaderboardData.map((user) => (
                        <div 
                          key={user.name}
                          className={`p-3 border rounded-xl flex items-center justify-between gap-3 ${
                            user.isCurrentUser 
                              ? 'border-amber-500/40 bg-amber-500/5' 
                              : 'border-neutral-900 bg-neutral-900/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 text-center font-mono font-bold text-xs ${user.rank <= 3 ? 'text-amber-500' : 'text-neutral-500'}`}>
                              {user.rank}
                            </span>
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0a0c]"
                              style={{ background: AVATAR_COLORS[user.colorIdx] }}
                            >
                              {user.initials}
                            </div>
                            <span className={`text-xs font-bold ${user.isCurrentUser ? 'text-amber-500' : 'text-neutral-200'}`}>
                              {user.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs font-semibold">
                            <span className="text-amber-500">Lv. {user.level}</span>
                            <span className="text-neutral-400 font-mono">{user.points} pts</span>
                            {user.streak > 0 && (
                              <span className="text-[#f87171] font-mono flex items-center gap-0.5">
                                <Flame size={12} className="fill-current" /> {user.streak}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Level Progression Rewards list */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2 m-0">
                      {language === 'en' ? '🎁 LEVEL UNLOCK REWARDS' : '🎁 UNLOCK REWARDS LEVEL'}
                    </h3>
                    <div className="flex flex-col gap-3">
                      {activeLevelRewards.map(reward => {
                        const isUnlocked = userLevel >= reward.level
                        return (
                          <div 
                            key={reward.level} 
                            className={`p-3 rounded-xl border flex flex-col gap-1 transition ${
                              isUnlocked 
                                ? 'bg-amber-500/5 border-amber-500/20' 
                                : 'border-neutral-900 bg-neutral-950/20 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className={isUnlocked ? 'text-amber-500' : 'text-neutral-400'}>
                                Lv. {reward.level} — {reward.name}
                              </span>
                              {isUnlocked ? (
                                <span className="text-[10px] text-green-500">
                                  ✓ {language === 'en' ? 'Unlocked' : 'Terbuka'}
                                </span>
                              ) : (
                                <span className="text-[10px] text-neutral-500 font-mono">{reward.pointsReq} pts</span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-400 leading-relaxed m-0 mt-1">
                              {reward.reward}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. KNOWLEDGE BANK VIEW */}
            {activeTab === 'knowledge' && (
              <motion.div
                key="knowledge"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-[#e8e4dc] leading-tight m-0">
                    {language === 'en' ? '🧠 Knowledge Bank: Learning Repository' : '🧠 Bank Knowledge: Repositori Keilmuan'}
                  </h2>
                  <p className="text-xs text-neutral-400 m-0 mt-1">
                    {language === 'en'
                      ? 'Full access to webinar recordings, live TikTok videos, supporting PDF documents, and meditation audios.'
                      : 'Akses lengkap rekaman webinar, video live TikTok, dokumen PDF pendukung, serta audio meditasi.'
                    }
                  </p>
                </div>
                <KnowledgeBank isCommunityMode={true} />
              </motion.div>
            )}

            {/* 5. ABOUT VIEW (Rules, guidelines, support) */}
            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                {/* Pinned Video in About */}
                <div className="nv-community-about-card nv-premium-glass p-6 border border-neutral-900 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2 m-0">
                    {language === 'en' ? '🎬 Guide Video & Community Orientation' : '🎬 Video Panduan & Orientasi Komunitas'}
                  </h3>
                  <div className="relative w-full rounded-xl overflow-hidden border border-neutral-850 shadow-2xl bg-neutral-950" style={{ aspectRatio: '16/9', maxWidth: '720px' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full border-none"
                      src="https://www.youtube.com/embed/LrklTcrYYFw"
                      title="Panduan Neville Goddard Indonesia"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed m-0">
                    {language === 'en'
                      ? 'Watch this orientation video to understand how to make the most of this platform. We cover how to study in the *Classroom* tab, interact in the *Discussion* forum, attend sessions in the *Calendar*, and have fun collecting points in the *Leaderboard*.'
                      : 'Tonton orientasi video ini untuk memahami bagaimana menggunakan platform ini secara maksimal. Kami membahas cara belajar di tab *Classroom*, berinteraksi di forum *Diskusi*, menghadiri sesi di *Kalender Sesi*, dan bersenang-senang mengumpulkan poin di *Leaderboard*.'
                    }
                  </p>
                </div>

                <div className="nv-community-about-card nv-premium-glass p-6 border border-neutral-900">
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2 m-0 mb-3">
                    <Info size={16} /> {language === 'en' ? 'About AKU ANAK LOAS Community' : 'Tentang Komunitas AKU ANAK LOAS'}
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed m-0">
                    {language === 'en'
                      ? 'This is an exclusive gathering place for practitioners of Neville Goddard’s Law of Assumption in Indonesia. Here, each member commits to stopping the search for instant methods outside and focusing on training the inner self into self-consciousness. This community integrates a gamified leaderboard to motivate high-quality interactions.'
                      : 'Ini adalah tempat berkumpul eksklusif bagi praktisi Hukum Asumsi Neville Goddard di Indonesia. Di sini, setiap anggota berkomitmen untuk menghentikan pencarian metode instan di luar dan berfokus melatih batin ke dalam kesadaran diri. Komunitas ini mengintegrasikan leaderboard gamifikasi untuk memotivasi interaksi berkualitas.'
                    }
                  </p>
                </div>
                
                <div className="nv-community-about-card nv-premium-glass p-6 border border-neutral-900">
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2 m-0 mb-3">
                    <Shield size={16} /> {language === 'en' ? 'Guidelines & Rules' : 'Panduan & Aturan Berlaku'}
                  </h3>
                  <ul className="list-none padding-0 margin-0 flex flex-col gap-3">
                    <li className="text-xs text-neutral-300 leading-relaxed flex gap-2">
                      <span className="text-amber-500">🤝</span>
                      <span>
                        {language === 'en'
                          ? 'Respect everyone’s inner journey. Rude debating or attacking other members’ beliefs is prohibited.'
                          : 'Hormati perjalanan batin setiap orang. Dilarang mendebat kasar atau menyerang keyakinan anggota lain.'
                        }
                      </span>
                    </li>
                    <li className="text-xs text-neutral-300 leading-relaxed flex gap-2">
                      <span className="text-amber-500">🔒</span>
                      <span>
                        {language === 'en'
                          ? 'Keep shared stories private. What is told in the internal forum stays in this forum.'
                          : 'Menjaga rahasia sharing. Apa yang diceritakan di forum internal tetap berada di forum ini.'
                        }
                      </span>
                    </li>
                    <li className="text-xs text-neutral-300 leading-relaxed flex gap-2">
                      <span className="text-amber-500">🧠</span>
                      <span>
                        {language === 'en'
                          ? 'All posts must be based on Neville Goddard’s Law of Assumption materials. Off-topic/promotional posts will be immediately deleted by moderators.'
                          : 'Semua postingan wajib berlandaskan pada materi Hukum Asumsi Neville Goddard. Postingan luar topik/iklan promosi akan langsung dihapus oleh moderator.'
                        }
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: USER PROFILE & STATS PANEL (Desktop only, 300px) */}
        <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-6">
          {/* User Skool Profile Card */}
          <div className="nv-premium-glass p-5 border border-neutral-900 text-center flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-[#d4a053] flex items-center justify-center text-amber-500 font-bold text-xl shadow-lg">
                {(userName || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 border border-neutral-950 rounded-full p-1.5 text-neutral-950">
                <Flame size={12} className="fill-current" />
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-[#e8e4dc] mt-3 m-0 leading-tight">
              {userName}
            </h3>
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-1">{subscriptionTier} MEMBER</span>
            
            <div className="w-full border-t border-neutral-900/60 my-4" />

            {/* Streak & Points display */}
            <div className="grid grid-cols-2 gap-4 w-full text-left mb-4">
              <div className="bg-neutral-950/40 p-3 rounded-lg border border-neutral-900/50">
                <span className="text-[9px] text-neutral-500 font-bold uppercase block">
                  {language === 'en' ? 'Active Streak' : 'Streak Aktif'}
                </span>
                <span className="text-sm font-bold text-[#f87171] mt-0.5 block flex items-center gap-1">
                  <Flame size={14} className="fill-current" /> {userStreak} {language === 'en' ? 'Days' : 'Hari'}
                </span>
              </div>
              <div className="bg-neutral-950/40 p-3 rounded-lg border border-neutral-900/50">
                <span className="text-[9px] text-neutral-500 font-bold uppercase block">
                  {language === 'en' ? 'Point Score' : 'Skor Poin'}
                </span>
                <span className="text-sm font-bold text-[#e8e4dc] mt-0.5 block font-mono">
                  {userPoints} Pts
                </span>
              </div>
            </div>

            {/* Progress to Next Level bar */}
            {nextLevelInfo && (
              <div className="w-full text-left">
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold mb-1">
                  <span>{language === 'en' ? `Level ${userLevel} Progress` : `Progress Level ${userLevel}`}</span>
                  <span>{userPoints} / {nextLevelInfo.pointsReq} Pts</span>
                </div>
                <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
                  <div className="bg-gradient-to-r from-amber-500 to-[#e2b36e] h-full rounded-full" style={{ width: `${pointsProgress}%` }} />
                </div>
                <p className="text-[9px] text-neutral-500 mt-1 leading-normal italic">
                  {language === 'en'
                    ? `Next: **${nextLevelInfo.name}** (Reward: ${nextLevelInfo.reward})`
                    : `Berikutnya: **${nextLevelInfo.name}** (Hadiah: ${nextLevelInfo.reward})`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Quick upcoming event countdown */}
          <div className="nv-premium-glass p-5 border border-neutral-900 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 border-b border-neutral-900 pb-2 m-0">
              {language === 'en' ? '📅 UPCOMING SESSION' : '📅 SESI TERDEKAT'}
            </h4>
            
            {/* Embedded Flyer Image with full-screen zoom handler */}
            <div 
              className="relative w-full rounded-lg overflow-hidden border border-neutral-800 shadow-md group cursor-zoom-in" 
              style={{ aspectRatio: '1/1.4' }}
              onClick={() => setShowFlyerLightbox(true)}
              title={language === 'en' ? 'Click to enlarge flyer' : 'Klik untuk memperbesar flyer'}
            >
              <img 
                src="/images/illustrations/webinar-flyer.jpg" 
                alt="Flyer Webinar Bang Nevgo" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute bottom-2 right-2 bg-neutral-950/70 border border-neutral-800 text-white rounded px-2 py-0.5 text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                🔍 Zoom
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono px-2 py-0.5 rounded w-max font-bold uppercase">
                {language === 'en' ? 'Special Webinar' : 'Webinar Spesial'}
              </div>
              <h5 className="text-xs font-bold text-neutral-200 m-0 leading-snug">
                {language === 'en' ? 'Where is My Manifestation? Why Has it Not Succeeded.' : 'Dimana Manifestku? Kenapa Belum Berhasil.'}
              </h5>
              <p className="text-[10px] text-neutral-500 font-mono m-0">
                {language === 'en' ? 'Sunday, April 26, 2026 • 18:00 WIB' : 'Minggu, 26 April 2026 • 18:00 WIB'}
              </p>
              
              {!isAccessAllowed ? (
                <button 
                  onClick={() => setShowPricingModal(true)} 
                  className="nv-pdf-download-btn py-1.5 mt-1 flex items-center justify-center gap-1.5 text-xs text-center cursor-pointer font-bold w-full"
                >
                  <span>{language === 'en' ? 'Register / Join Session' : 'Daftar / Join Sesi'}</span>
                  <ExternalLink size={10} />
                </button>
              ) : (
                <a 
                  href="https://zoom.us/j/meet-sats" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="nv-pdf-download-btn py-1.5 mt-1 flex items-center justify-center gap-1.5 text-xs text-center font-bold w-full"
                >
                  <span>{language === 'en' ? 'Join Zoom Session' : 'Join Sesi Zoom'}</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Knowledge Bank Shortcut widget */}
          <div className="nv-premium-glass p-5 border border-neutral-900 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1 border-b border-neutral-900 pb-2 m-0 flex items-center gap-1">
              <span>{language === 'en' ? '🧠 KNOWLEDGE BANK' : '🧠 BANK KNOWLEDGE'}</span>
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed m-0 mt-1.5">
              {language === 'en'
                ? 'Access additional materials: VIP webinar recordings, live TikTok videos, material PDFs, and guided audio meditations.'
                : 'Akses materi tambahan: rekaman webinar VIP, video live TikTok, PDF materi, dan meditasi audio terbimbing.'
              }
            </p>
            <button 
              onClick={() => setActiveTab('knowledge')} 
              className="nv-pdf-download-btn py-1.5 mt-2 flex items-center justify-center gap-1.5 text-xs text-center cursor-pointer font-bold w-full"
            >
              <span>{language === 'en' ? 'Open Knowledge Bank' : 'Buka Bank Knowledge'}</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </aside>

      </div>

      {/* ── Comments Modal / Overlay ── */}
      <AnimatePresence>
        {activePostComments && (
          <div className="nv-modal-overlay" onClick={handleClose}>
            <motion.div
              className="nv-modal-content nv-premium-glass"
              style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <span className="text-xs font-bold text-amber-500">
                  {language === 'en' ? 'POST COMMENTS' : 'KOMENTAR POSTINGAN'}
                </span>
                <button className="text-neutral-400 hover:text-white" onClick={handleClose}>
                  <X size={16} />
                </button>
              </div>

              {/* Main Post details */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-[#0a0a0c]"
                    style={{ background: AVATAR_COLORS[activePostComments.colorIdx] }}
                  >
                    {activePostComments.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-200 m-0">{activePostComments.author}</h4>
                    <span className="text-[9px] text-neutral-500 font-mono mt-0.5">{activePostComments.time}</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white m-0">{activePostComments.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed m-0 whitespace-pre-wrap">{activePostComments.content}</p>
              </div>

              <div className="border-t border-neutral-900/60 my-2" />

              {/* Comments scroll area */}
              <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2 nv-scroll-premium">
                {activePostComments.comments.length > 0 ? (
                  activePostComments.comments.map(comment => (
                    <div key={comment.id} className="bg-neutral-950/30 border border-neutral-900 p-3 rounded-lg flex flex-col gap-1">
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-[#0a0a0c]"
                            style={{ background: AVATAR_COLORS[comment.colorIdx] }}
                          >
                            {comment.initials}
                          </div>
                          <span className="text-xs font-bold text-neutral-300">{comment.author}</span>
                          <span className="text-[8px] font-mono px-1 bg-neutral-800 text-neutral-400 rounded uppercase">
                            {comment.role}
                          </span>
                        </div>
                        <span className="text-[9px] text-neutral-500 font-mono">{comment.time}</span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-normal m-0 pl-8">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-neutral-500 font-mono">
                    {language === 'en' ? 'No comments yet. Be the first to comment!' : 'Belum ada komentar. Jadilah yang pertama berkomentar!'}
                  </div>
                )}
              </div>

              {/* Comment submission form */}
              <form onSubmit={handleAddComment} className="flex gap-2 items-center mt-2 border-t border-neutral-900 pt-3">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Type your comment...' : 'Ketik komentar Anda...'}
                  required
                  className="flex-1 bg-neutral-900/60 border border-neutral-850 rounded-lg px-4 py-2 text-xs text-[#e8e4dc] outline-none focus:border-amber-500/40"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" className="nv-activation-widget-btn py-2 px-4 rounded-lg">
                  {language === 'en' ? 'Send' : 'Kirim'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Pricing / Upgrade Modal for Intercepted Actions ── */}
      <AnimatePresence>
        {showPricingModal && (
          <div className="nv-modal-overlay" onClick={() => setShowPricingModal(false)}>
            <motion.div
              className="nv-modal-content nv-premium-glass"
              style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid #d4a053' }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <span className="text-xs font-bold text-amber-500 tracking-wider flex items-center gap-1">
                  🔒 UNLOCK PREMIUM MEMBERSHIP
                </span>
                <button className="text-neutral-400 hover:text-white" onClick={() => setShowPricingModal(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className="text-center py-4 flex flex-col items-center gap-3">
                <div className="text-5xl drop-shadow-lg">👑</div>
                <h3 className="text-lg font-bold text-white font-outfit m-0">
                  {language === 'en' ? 'Premium Feature Locked' : 'Fitur Premium Terkunci'}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-sm m-0">
                  {language === 'en'
                    ? 'To like, comment, write new posts, open the Classroom curriculum, or join Live Zoom sessions, please upgrade your account to Premium.'
                    : 'Untuk menyukai, berkomentar, membuat postingan baru, membuka kurikulum Classroom, atau bergabung sesi Live Zoom, silakan tingkatkan akun Anda ke Premium.'
                  }
                </p>
              </div>

              <div className="bg-neutral-950/60 border border-neutral-900 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">{language === 'en' ? 'Premium Tier' : 'Tier Premium'}</span>
                    <span className="text-[10px] text-neutral-500">
                      {language === 'en' ? 'Access community, meditations, & 49 lessons' : 'Akses komunitas, meditasi, & 49 pelajaran'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-500 font-mono">Rp 149.000 / bln</span>
                </div>
                <div className="w-full border-t border-neutral-900" />
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#a78bfa]">{language === 'en' ? 'Master Tier (VIP)' : 'Tier Master (VIP)'}</span>
                    <span className="text-[10px] text-neutral-500">
                      {language === 'en' ? 'All Premium benefits + Exclusive Webinars' : 'Semua benefit Premium + Webinar Eksklusif'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#a78bfa] font-mono">Rp 299.000 / bln</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => {
                    setShowPricingModal(false)
                    setView('pricing')
                  }}
                  className="nv-cta-button nv-cta-pulse w-full py-2.5 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2"
                >
                  <UserPlus size={14} />
                  <span>{language === 'en' ? 'Upgrade & Unlock Access Now' : 'Upgrade & Buka Akses Sekarang'}</span>
                </button>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="bg-neutral-900 border border-neutral-800 text-neutral-450 hover:text-white py-2 rounded-lg text-xs font-semibold"
                >
                  {language === 'en' ? 'Go Back to Browsing (Preview)' : 'Kembali Menjelajah (Pratinjau)'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Flyer Lightbox Modal ── */}
      <AnimatePresence>
        {showFlyerLightbox && (
          <div className="nv-modal-overlay" style={{ zIndex: 999 }} onClick={() => setShowFlyerLightbox(false)}>
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh] overflow-hidden rounded-2xl border border-amber-500/30 shadow-2xl bg-neutral-950/95"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-white bg-neutral-950/80 hover:bg-neutral-900 p-2 rounded-full border border-neutral-800 transition z-10 cursor-pointer shadow-lg" 
                onClick={() => setShowFlyerLightbox(false)}
              >
                <X size={16} />
              </button>
              <img 
                src="/images/illustrations/webinar-flyer.jpg" 
                alt="Flyer Webinar Bang Nevgo" 
                className="max-w-full max-h-[85vh] object-contain block rounded-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

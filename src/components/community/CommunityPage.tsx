'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { MessageCircle, Heart, Users, UserPlus, BookOpen, Shield, Star, Info } from 'lucide-react'

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

const MOCK_CATEGORIES = [
  { id: 'all', label: 'All', emoji: '📋' },
  { id: 'wins', label: 'Wins', emoji: '🏆' },
  { id: 'qna', label: 'Q&A', emoji: '💬' },
  { id: 'discussions', label: 'Diskusi', emoji: '🧠' },
  { id: 'resources', label: 'Resources', emoji: '📚' },
]

const MOCK_POSTS = [
  {
    id: 1,
    author: 'Toni Martin',
    initials: 'TM',
    colorIdx: 0,
    role: 'Premium',
    time: '2 jam lalu',
    category: 'wins',
    content: 'Baru saja closed project £7.5k! Teknik SATS yang dipelajari di sini benar-benar works. Visualisasi setiap malam sebelum tidur, dan dalam 2 minggu hasilnya muncul. Percaya sama imajinasimu!',
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    author: 'Sarah Wijaya',
    initials: 'SW',
    colorIdx: 1,
    role: 'Master',
    time: '5 jam lalu',
    category: 'discussions',
    content: 'Ada yang pernah mengalami fenomena "bridge of incidents" setelah konsisten melakukan affirmasi? Ceritain dong pengalaman kamu gimana awalnya sampai akhirnya dapat tanda-tandanya.',
    likes: 18,
    comments: 15,
  },
  {
    id: 3,
    author: 'Budi Santoso',
    initials: 'BS',
    colorIdx: 2,
    role: 'Premium',
    time: '1 hari lalu',
    category: 'qna',
    content: 'Gimana caranya bedain antara intuition and wishful thinking? Kadang saya susah membedakan apakah ini "feeling" beneran atau cuma ekspektasi saya sendiri. Mohon pencerahan teman-teman.',
    likes: 31,
    comments: 22,
  },
  {
    id: 4,
    author: 'Maya Devi',
    initials: 'MD',
    colorIdx: 3,
    role: 'Premium',
    time: '2 hari lalu',
    category: 'wins',
    content: 'Setelah 6 bulan konsisten, akhirnya berhasil me-manifestasi hubungan yang sehat! Dari yang penuh drama, sekarang komunikasi lancar dan saling support. Semua berawal dari mengubah asumsi dalam diri sendiri.',
    likes: 56,
    comments: 12,
  },
  {
    id: 5,
    author: 'Dimas Pratama',
    initials: 'DP',
    colorIdx: 9,
    role: 'Master',
    time: '3 hari lalu',
    category: 'discussions',
    content: 'Diskusi tentang Neville Goddard — interpretasi "Feeling is the Secret" menurut pengalaman pribadi. Bukan sekadar merasakan emosi, tapi benar-benar hidup dalam keadaan terkabul. Siapa yang punya perspektif berbeda?',
    likes: 42,
    comments: 28,
  },
  {
    id: 6,
    author: 'Rina Kartika',
    initials: 'RK',
    colorIdx: 4,
    role: 'Premium',
    time: '4 hari lalu',
    category: 'resources',
    content: 'Bagi yang nyari daftar bacaan Neville Goddard terjemahan Bahasa Indonesia, saya buatin list lengkap PDF-nya. DM ya nanti saya kirim linknya. Gratis untuk anggota komunitas!',
    likes: 67,
    comments: 34,
  },
]

const MOCK_MEMBERS = [
  { name: 'Toni Martin', initials: 'TM', role: 'Premium', online: true, colorIdx: 0 },
  { name: 'Sarah Wijaya', initials: 'SW', role: 'Master', online: true, colorIdx: 1 },
  { name: 'Budi Santoso', initials: 'BS', role: 'Premium', online: true, colorIdx: 2 },
  { name: 'Maya Devi', initials: 'MD', role: 'Premium', online: false, colorIdx: 3 },
  { name: 'Dimas Pratama', initials: 'DP', role: 'Master', online: true, colorIdx: 9 },
  { name: 'Rina Kartika', initials: 'RK', role: 'Premium', online: false, colorIdx: 4 },
  { name: 'Agus Wijaya', initials: 'AW', role: 'Member', online: true, colorIdx: 5 },
  { name: 'Dewi Lestari', initials: 'DL', role: 'Member', online: false, colorIdx: 6 },
  { name: 'Fajar Nugroho', initials: 'FN', role: 'Premium', online: true, colorIdx: 7 },
  { name: 'Indah Permata', initials: 'IP', role: 'Member', online: false, colorIdx: 8 },
  { name: 'Joko Susilo', initials: 'JS', role: 'Master', online: true, colorIdx: 0 },
  { name: 'Lina Marlina', initials: 'LM', role: 'Premium', online: false, colorIdx: 1 },
]

const ABOUT_FEATURES = [
  { icon: <MessageCircle size={16} />, text: 'Diskusi eksklusif dengan sesama pencari kebenaran' },
  { icon: <Star size={16} />, text: 'Sesi live Q&A mingguan dengan mentor berpengalaman' },
  { icon: <Users size={16} />, text: 'Network dengan 885 anggota dari seluruh Indonesia' },
  { icon: <BookOpen size={16} />, text: 'Akses ke resources eksklusif dan study guide' },
  { icon: <Shield size={16} />, text: 'Lingkungan yang aman dan supportive tanpa judgment' },
]

const ABOUT_RULES = [
  { icon: '🤝', text: 'Hormati setiap anggota, tidak ada bullying atau toxic behavior' },
  { icon: '🔒', text: 'Jaga privasi anggota lain — apa yang dibahas di sini, stays here' },
  { icon: '📖', text: 'Fokus pada topik hukum asumsi dan manifestasi' },
  { icon: '🚫', text: 'Dilarang spam, promo, atau self-promotion tanpa izin' },
  { icon: '💡', text: 'Bagikan pengalaman dan insight — setiap perspektif berharga' },
]

// ── Components ──

function PostCard({ post, index }: { post: typeof MOCK_POSTS[0]; index: number }) {
  return (
    <motion.div
      className="nv-community-post-card nv-glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="nv-community-post-header">
        <div
          className="nv-community-post-avatar"
          style={{ background: AVATAR_COLORS[post.colorIdx] }}
        >
          {post.initials}
        </div>
        <div className="nv-community-post-author-info">
          <div className="nv-community-post-author-row">
            <span className="nv-community-post-author">{post.author}</span>
            <span className="nv-community-post-role">{post.role}</span>
          </div>
          <span className="nv-community-post-time">{post.time}</span>
        </div>
      </div>

      <div className="nv-community-post-category-badge">
        {MOCK_CATEGORIES.find(c => c.id === post.category)?.emoji}{' '}
        {MOCK_CATEGORIES.find(c => c.id === post.category)?.label}
      </div>

      <p className="nv-community-post-content">{post.content}</p>

      <div className="nv-community-post-actions">
        <button className="nv-community-post-action">
          <Heart size={16} />
          <span>{post.likes}</span>
        </button>
        <button className="nv-community-post-action">
          <MessageCircle size={16} />
          <span>{post.comments}</span>
        </button>
      </div>
    </motion.div>
  )
}

function MemberCard({ member, index }: { member: typeof MOCK_MEMBERS[0]; index: number }) {
  return (
    <motion.div
      className="nv-community-member-card nv-glass"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <div className="nv-community-member-avatar-wrap">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.initials}`}
          alt={member.name}
          className="nv-community-member-avatar-img"
          width={44}
          height={44}
        />
        {member.online && <div className="nv-community-member-online" />}
      </div>
      <div className="nv-community-member-info">
        <div className="nv-community-member-name">{member.name}</div>
        <div className="nv-community-member-role-text">{member.role}</div>
      </div>
    </motion.div>
  )
}

// ── Main Page ──

export default function CommunityPage() {
  const { setView, hasCommunityAccess } = useAppStore()
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'about'>('feed')
  const [activeCategory, setActiveCategory] = useState('all')
  const [memberSearch, setMemberSearch] = useState('')

  const isAccessAllowed = hasCommunityAccess()

  const filteredPosts = activeCategory === 'all'
    ? MOCK_POSTS
    : MOCK_POSTS.filter(p => p.category === activeCategory)

  const filteredMembers = memberSearch
    ? MOCK_MEMBERS.filter(m =>
        m.name.toLowerCase().includes(memberSearch.toLowerCase())
      )
    : MOCK_MEMBERS

  const onlineCount = MOCK_MEMBERS.filter(m => m.online).length
  const totalLikes = MOCK_POSTS.reduce((acc, p) => acc + p.likes, 0)

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  if (!isAccessAllowed) {
    return (
      <div className="nv-community-page">
        <div className="nv-community-header">
          <button className="nv-community-back-btn" onClick={() => setView('landing')}>
            ← Kembali
          </button>
          <div className="nv-community-header-glow" />
          <div className="nv-community-header-inner">
            <div className="nv-community-logo"><img src="/community-logo.jpg" alt="AKU ANAK LOAS" /></div>
            <div className="nv-community-header-info">
              <h1 className="nv-community-header-name">AKU ANAK LOAS</h1>
              <p className="nv-community-header-desc">Premium Member Area — akses komunitas eksklusif</p>
            </div>
          </div>
          <div className="nv-community-stats-bar">
            <div className="nv-community-stat-item">
              <Users size={16} className="nv-community-stat-icon" />
              <span className="nv-community-stat-value">885</span>
              <span>members</span>
            </div>
            <div className="nv-community-stat-item">
              <span className="nv-community-stat-dot" />
              <span className="nv-community-stat-value">{onlineCount}</span>
              <span>online sekarang</span>
            </div>
          </div>
        </div>

        <div className="nv-community-content" style={{ textAlign: 'center', paddingTop: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>🔒</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 8px' }}>
              AKU ANAK LOAS
            </h2>
            <p style={{ fontSize: 15, color: 'var(--nv-muted)', lineHeight: 1.7, margin: '0 0 24px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              Bergabung dengan 885 anggota dan dapatkan akses diskusi eksklusif, sesi live, dan network.
            </p>
            <motion.button
              className="nv-cta-button nv-cta-pulse"
              onClick={() => setView('pricing')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus size={18} /> Upgrade ke Premium — Rp 149K/bulan
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="nv-community-page">
      {/* ── Header ── */}
      <section className="nv-community-header">
        <button className="nv-community-back-btn" onClick={() => setView('landing')}>
          ← Kembali
        </button>
        <div className="nv-community-header-glow" />
        <div className="nv-community-header-inner">
          <div className="nv-community-logo"><img src="/community-logo.jpg" alt="AKU ANAK LOAS" /></div>
          <div className="nv-community-header-info">
            <h1 className="nv-community-header-name">AKU ANAK LOAS</h1>
            <p className="nv-community-header-desc">Ruang diskusi eksklusif untuk anggota komunitas</p>
          </div>
        </div>
        <div className="nv-community-stats-bar">
          <div className="nv-community-stat-item">
            <Users size={16} className="nv-community-stat-icon" />
            <span className="nv-community-stat-value">885</span>
            <span>members</span>
          </div>
          <div className="nv-community-stat-item">
            <span className="nv-community-stat-dot" />
            <span className="nv-community-stat-value">{onlineCount}</span>
            <span>online sekarang</span>
          </div>
          <div className="nv-community-stat-item">
            <MessageCircle size={16} className="nv-community-stat-icon" />
            <span className="nv-community-stat-value">{MOCK_POSTS.length}</span>
            <span>postingan hari ini</span>
          </div>
          <div className="nv-community-stat-item">
            <Heart size={16} className="nv-community-stat-icon" />
            <span className="nv-community-stat-value">{totalLikes}</span>
            <span>total likes</span>
          </div>
        </div>
      </section>

      {/* ── Tab Navigation (sticky) ── */}
      <nav className="nv-community-tabs">
        <div className="nv-community-tabs-inner">
          {(['feed', 'members', 'about'] as const).map(tab => (
            <button
              key={tab}
              className={`nv-community-tab ${activeTab === tab ? 'nv-community-tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'feed' && <span className="nv-community-tab-icon">📋</span>}
              {tab === 'members' && <Users size={16} />}
              {tab === 'about' && <Info size={16} />}
              {tab === 'feed' && 'Feed'}
              {tab === 'members' && 'Members'}
              {tab === 'about' && 'About'}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="nv-community-content">
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Category Filters */}
              <div className="nv-community-categories">
                {MOCK_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={`nv-community-chip ${activeCategory === cat.id ? 'nv-community-chip-active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>

              {/* Feed */}
              {filteredPosts.length > 0 ? (
                <div className="nv-community-feed">
                  {filteredPosts.map((post, idx) => (
                    <PostCard key={post.id} post={post} index={idx} />
                  ))}
                </div>
              ) : (
                <div className="nv-community-empty">
                  <span className="nv-community-empty-icon">📭</span>
                  <p className="nv-community-empty-text">Belum ada postingan</p>
                  <p className="nv-community-empty-sub">Tidak ada postingan di kategori ini. Coba kategori lain atau buat postingan baru!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <input
                className="nv-community-member-search"
                type="text"
                placeholder="Cari anggota..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
              />
              <div className="nv-community-member-grid">
                {filteredMembers.map((member, idx) => (
                  <MemberCard key={member.initials} member={member} index={idx} />
                ))}
              </div>
              {filteredMembers.length === 0 && (
                <div className="nv-community-empty">
                  <span className="nv-community-empty-icon">🔍</span>
                  <p className="nv-community-empty-text">Anggota tidak ditemukan</p>
                  <p className="nv-community-empty-sub">Coba kata kunci lain untuk mencari anggota</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              className="nv-community-about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="nv-community-about-card nv-glass">
                <h3 className="nv-community-about-card-title">
                  <Info size={18} className="nv-community-stat-icon" />
                  Tentang Komunitas
                </h3>
                <p className="nv-community-about-text">
                  Komunitas Hukum Asumsi adalah ruang eksklusif bagi para pejuang manifestasi yang ingin memperdalam
                  pemahaman tentang Neville Goddard&apos;s teachings. Di sini, kita saling support, berbagi pengalaman,
                  dan bertumbuh bersama dalam perjalanan menguasai hukum asumsi.
                </p>
              </div>

              <div className="nv-community-about-card nv-glass">
                <h3 className="nv-community-about-card-title">
                  <Star size={18} className="nv-community-stat-icon" />
                  Yang Kamu Dapatkan
                </h3>
                <ul className="nv-community-about-list">
                  {ABOUT_FEATURES.map((f, i) => (
                    <li key={i}>
                      <span className="nv-community-about-list-icon">{f.icon}</span>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="nv-community-about-card nv-glass">
                <h3 className="nv-community-about-card-title">
                  <Shield size={18} className="nv-community-stat-icon" />
                  Aturan Komunitas
                </h3>
                <ul className="nv-community-about-list">
                  {ABOUT_RULES.map((r, i) => (
                    <li key={i}>
                      <span className="nv-community-about-list-icon" style={{ fontSize: 16 }}>{r.icon}</span>
                      <span>{r.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

// ECharts Type declaration
declare global {
  interface Window {
    echarts?: any;
  }
}

// ── Categories matching websiteloas (1).html exactly ──
const CATEGORIES = [
  { name: 'Inti Ajaran',          color: '#f5c842', dim: 'rgba(245,200,66,0.25)' },      // Gold
  { name: 'Bagian 1: Kesadaran',  color: '#3b82f6', dim: 'rgba(59,130,246,0.22)' },     // Blue
  { name: 'Bagian 2: Asumsi',     color: '#ef4444', dim: 'rgba(239,68,68,0.22)' },      // Red
  { name: 'Bagian 3: Perasaan',   color: '#a855f7', dim: 'rgba(168,85,247,0.22)' },     // Purple
  { name: 'Bagian 4: Diam',       color: '#22c55e', dim: 'rgba(34,197,94,0.22)' },      // Green
  { name: 'Bagian 5: Kondisi',    color: '#f97316', dim: 'rgba(249,115,22,0.22)' },     // Orange
  { name: 'Bagian 6: Revisi',     color: '#ec4899', dim: 'rgba(236,72,153,0.22)' },     // Pink
  { name: 'Bagian 7: Imajinasi',  color: '#06b6d4', dim: 'rgba(6,182,212,0.22)' },      // Cyan
  { name: 'Bagian 8: Dimensi 4D', color: '#6366f1', dim: 'rgba(99,102,241,0.22)' },     // Indigo
  { name: 'Bagian 9: Mati Diri',  color: '#84cc16', dim: 'rgba(132,204,22,0.22)' },     // Lime
  { name: 'Bagian 10: Janji',     color: '#f59e0b', dim: 'rgba(245,158,11,0.22)' },     // Amber
  { name: 'Sumber Daya',          color: '#94a3b8', dim: 'rgba(148,163,184,0.22)' },    // Slate
];

const UI_TRANSLATIONS = {
  id: {
    title: 'Hukum Asumsi — Second Brain',
    subtitle: 'Graf pengetahuan kurikulum lengkap ajaran & praktik Neville Goddard — 10 Bagian, 49 Pelajaran.',
    instruction: 'Scroll untuk zoom · Drag untuk menggeser · Sorot node untuk eksplorasi koneksi',
  },
  en: {
    title: 'Hukum Asumsi — Second Brain',
    subtitle: 'Knowledge graph of the complete Neville Goddard curriculum — 10 Parts, 49 Lessons.',
    instruction: 'Scroll to zoom · Drag to pan · Hover node to explore connections',
  }
}

// ── Graph data builders ──
function makeNode(name: string, cat: number, size: number, opts: any = {}) {
  const c = CATEGORIES[cat];
  return {
    name,
    category: cat,
    symbolSize: size,
    itemStyle: opts.itemStyle || { color: c.dim, borderColor: c.color, borderWidth: 1.5 },
    label: opts.label || { fontSize: size > 30 ? 12 : size > 22 ? 10.5 : 9.5, color: '#d4caba' },
    ...(opts.extra || {}),
  };
}

function makeLink(src: string, tgt: string, w = 1) {
  return {
    source: src, target: tgt,
    lineStyle: { width: w, color: w > 1.5 ? 'rgba(212,180,140,0.3)' : 'rgba(180,160,130,0.1)', curveness: 0.12 },
  };
}

function buildGraphData() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes: any[] = [
    // === Inti Ajaran (cat 0) ===
    { name: 'Hukum Asumsi', category: 0, symbolSize: 78,
      itemStyle: { color: 'rgba(245,200,66,0.22)', borderColor: '#f5d76e', borderWidth: 3, shadowBlur: 24, shadowColor: 'rgba(245,200,66,0.3)' },
      label: { fontSize: 17, fontWeight: 'bold', color: '#fef9e7' } },
    { name: 'Neville Goddard', category: 0, symbolSize: 52,
      itemStyle: { color: 'rgba(245,200,66,0.16)', borderColor: '#f5c842', borderWidth: 2, shadowBlur: 14, shadowColor: 'rgba(245,200,66,0.2)' },
      label: { fontSize: 13, fontWeight: '600', color: '#fef9e7' } },
    { name: 'I AM', category: 0, symbolSize: 38,
      itemStyle: { color: 'rgba(245,200,66,0.14)', borderColor: '#f5c842', borderWidth: 2 },
      label: { fontSize: 13, fontWeight: '700', color: '#fef3c7' } },
    { name: 'Kesadaran', category: 0, symbolSize: 36,
      label: { fontSize: 12, fontWeight: '600', color: '#fef9e7' } },
    { name: 'Asumsi', category: 0, symbolSize: 36,
      label: { fontSize: 12, fontWeight: '600', color: '#fef9e7' } },
    { name: 'Perasaan', category: 0, symbolSize: 34,
      label: { fontSize: 12, fontWeight: '600', color: '#fef9e7' } },
    { name: 'Imajinasi', category: 0, symbolSize: 34,
      label: { fontSize: 12, fontWeight: '600', color: '#fef9e7' } },
    { name: 'Bawah Sadar', category: 0, symbolSize: 28,
      label: { fontSize: 11, color: '#d4caba' } },
    { name: 'Persistensi', category: 0, symbolSize: 24,
      label: { fontSize: 10, color: '#d4caba' } },
    { name: 'SATS', category: 0, symbolSize: 26,
      label: { fontSize: 10.5, color: '#d4caba' } },
    { name: 'Sabat', category: 0, symbolSize: 22,
      label: { fontSize: 10, color: '#d4caba' } },
    { name: 'Iman', category: 0, symbolSize: 22,
      label: { fontSize: 10, color: '#d4caba' } },

    // === BAGIAN 1: Kesadaran (cat 1) ===
    makeNode('Part 1: Kesadaran\nAdalah Realitas', 1, 42, {
      itemStyle: { color: 'rgba(59,130,246,0.25)', borderColor: '#3b82f6', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(59,130,246,0.25)' },
      label: { fontSize: 11, fontWeight: '600', color: '#93c5fd' },
    }),
    makeNode('1.1 I AM:\nPenyebab Pertama', 1, 22),
    makeNode('1.2 Kesadaran\nMenciptakan Dunia', 1, 20),
    makeNode('1.3 Dua Sisi\nPenciptaan', 1, 18),
    makeNode('1.4 Anda Sudah\nMenjadi Itu', 1, 20),
    makeNode('1.5 Mekanisme\nRealisasi', 1, 18),

    // === BAGIAN 2: Asumsi (cat 2) ===
    makeNode('Part 2: Hukum\nAsumsi', 2, 42, {
      itemStyle: { color: 'rgba(239,68,68,0.25)', borderColor: '#ef4444', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(239,68,68,0.25)' },
      label: { fontSize: 11, fontWeight: '600', color: '#fca5a5' },
    }),
    makeNode('2.1 Apa Itu Asumsi?', 2, 22),
    makeNode('2.2 Dunia Asumtif', 2, 20),
    makeNode('2.3 Asumsi Mengeras\nMenjadi Fakta', 2, 22),
    makeNode('2.4 Kekuatan\nPersistensi', 2, 20),
    makeNode('2.5 Importunity:\nKelancangan Berani', 2, 20),

    // === BAGIAN 3: Perasaan (cat 3) ===
    makeNode('Part 3: Perasaan\nAdalah Rahasia', 3, 42, {
      itemStyle: { color: 'rgba(168,85,247,0.25)', borderColor: '#a855f7', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(168,85,247,0.25)' },
      label: { fontSize: 11, fontWeight: '600', color: '#d8b4fe' },
    }),
    makeNode('3.1 Perasaan sebagai\nSatu-satunya Medium', 3, 22),
    makeNode('3.2 SAYA ADALAH vs\nSAYA AKAN MENJADI', 3, 20),
    makeNode('3.3 Iman Adalah\nPerasaan', 3, 20),
    makeNode('3.4 Perubahan Perasaan\n= Perubahan Nasib', 3, 20),
    makeNode('3.5 Menginduksi\nKondisi Perasaan', 3, 18),

    // === BAGIAN 4: Diam (cat 4) ===
    makeNode('Part 4: Diam dalam\nKeinginan Terwujud', 4, 42, {
      itemStyle: { color: 'rgba(34,197,94,0.25)', borderColor: '#22c55e', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(34,197,94,0.25)' },
      label: { fontSize: 11, fontWeight: '600', color: '#86efac' },
    }),
    makeNode('4.1 Diam dalam\nKeinginan Terwujud', 4, 22),
    makeNode('4.2 Berpikir DARI\nvs. Berpikir TENTANG', 4, 22),
    makeNode('4.3 Jadikan Tempat\nLain DI SINI', 4, 20),
    makeNode('4.4 Berani Mengasumsikan\nAnda Adalah Itu', 4, 20),
    makeNode('4.5 Pemeriksaan Diri', 4, 18),

    // === BAGIAN 5: Kondisi (cat 5) ===
    makeNode('Part 5: Kondisi-Kondisi\nKesadaran', 5, 42, {
      itemStyle: { color: 'rgba(249,115,22,0.25)', borderColor: '#f97316', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(249,115,22,0.25)' },
      label: { fontSize: 11, fontWeight: '600', color: '#fdba74' },
    }),
    makeNode('5.1 Apa Itu Kondisi\nKesadaran?', 5, 22),
    makeNode('5.2 Penghuni vs.\nNarapidana', 5, 20),
    makeNode('5.3 Memasuki\nKondisi Baru', 5, 20),
    makeNode('5.4 Tidak Ada yang\nDiubah Selain Diri', 5, 20),
    makeNode('5.5 Tetap dalam\nKondisi', 5, 18),

    // === BAGIAN 6: Revisi (cat 6) ===
    makeNode('Part 6: Revisi —\nMengubah Masa Lalu', 6, 42, {
      itemStyle: { color: 'rgba(236,72,153,0.25)', borderColor: '#ec4899', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(236,72,153,0.25)' },
      label: { fontSize: 11, fontWeight: '600', color: '#f9a8d4' },
    }),
    makeNode('6.1 Apa Itu Revisi?', 6, 22),
    makeNode('6.2 Gunting Pangkas\nRevisi', 6, 20),
    makeNode('6.3 Praktik Harian', 6, 20),
    makeNode('6.4 Pengampunan Adalah\nMengalami Kembali', 6, 20),
    makeNode('6.5 Revisi dan\nOrang Lain', 6, 18),

    // === BAGIAN 7: Imajinasi (cat 7) ===
    makeNode('Part 7: Imajinasi\nMenciptakan Realitas', 7, 42, {
      itemStyle: { color: 'rgba(6,182,212,0.25)', borderColor: '#06b6d4', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(6,182,212,0.25)' },
      label: { fontSize: 11, fontWeight: '600', color: '#67e8f9' },
    }),
    makeNode('7.1 Siapa Imajinasi\nAnda?', 7, 22),
    makeNode('7.2 Tubuh Abadi\nManusia', 7, 20),
    makeNode('7.3 Penciptaan\nTelah Selesai', 7, 20),
    makeNode('7.4 Membayangkan vs.\nMemvisualisasikan', 7, 22),
    makeNode('7.5 Imajinasi\nBerkelanjutan', 7, 18),

    // === BAGIAN 8: Dimensi Keempat (cat 8) ===
    makeNode('Part 8: Dimensi\nKeempat', 8, 42, {
      itemStyle: { color: 'rgba(99,102,241,0.25)', borderColor: '#6366f1', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(99,102,241,0.25)' },
      label: { fontSize: 11, fontWeight: '600', color: '#a5b4fc' },
    }),
    makeNode('8.1 Dimensi Keempat', 8, 22),
    makeNode('8.2 Waktu Bukanlah\nHambatan', 8, 20),
    makeNode('8.3 Memasuki Masa\nDepan Sekarang', 8, 20),
    makeNode('8.4 Dia yang Ada Telah\nDiinginkan Sampai Menjadi', 8, 18),

    // === BAGIAN 9: Mati kepada Diri Lama (cat 9) ===
    makeNode('Part 9: Mati kepada\nDiri Lama', 9, 42, {
      itemStyle: { color: 'rgba(132,204,22,0.25)', borderColor: '#84cc16', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(132,204,22,0.25)' },
      label: { fontSize: 11, fontWeight: '600', color: '#bef264' },
    }),
    makeNode('9.1 Mati kepada\nDiri Lama', 9, 22),
    makeNode('9.2 Sabat: Istirahat\ndalam Asumsi', 9, 20),
    makeNode('9.3 Penolakan terhadap\nKondisi Lama', 9, 20),
    makeNode('9.4 Tinggalkan Cermin,\nUbah Wajah Anda', 9, 20),
    makeNode('9.5 Kebenaran yang\nMembebaskan Anda', 9, 18),

    // === BAGIAN 10: Janji (cat 10) ===
    makeNode('Part 10: Janji', 10, 42, {
      itemStyle: { color: 'rgba(245,158,11,0.25)', borderColor: '#f59e0b', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(245,158,11,0.25)' },
      label: { fontSize: 11, fontWeight: '600', color: '#fcd34d' },
    }),
    makeNode('10.1 Hukum vs. Janji', 10, 22),
    makeNode('10.2 Kisah Nyata', 10, 20),
    makeNode('10.3 Teknik Lengkap', 10, 22),
    makeNode('10.4 Tanda-tanda Mengikuti,\nMereka Tidak Mendahului', 10, 20),
    makeNode('10.5 Saya dan Bapa\nSaya Adalah Satu', 10, 20),

    // === Sumber Daya (cat 11) ===
    makeNode('Sumber Daya\nPelengkap', 11, 32, {
      label: { fontSize: 11, fontWeight: '600', color: '#cbd5e1' },
    }),
    makeNode('7 Hari Mencapai\nKealamian Manifestasi', 11, 18),
    makeNode('Asumsimu Itu Dahsyat!', 11, 16),
    makeNode('Somatic Zero', 11, 16),
    makeNode('Meditasi Theta:\nInduksi SATS', 11, 16),
    makeNode('Jurnal Harian\nAsumsi & SATS', 11, 16),
    makeNode('Workbook 30 Hari\nManifestasi', 11, 16),
    makeNode('eBook Panduan\nManifestasi', 11, 16),
    makeNode('Webinar Masterclass\nSATS & Revisi', 11, 18),
    makeNode('Diagnosa Limiting\nBelief', 11, 16),
    makeNode('Diagnosa Shadow', 11, 16),
    makeNode('Komunitas Privat\n(2.4K+ Members)', 11, 20),
    makeNode('coolwisdombooks.com\n/neville', 11, 18),

    // Key source books
    makeNode('Feeling Is the Secret\n(1944)', 11, 20),
    makeNode('Five Lessons\n(1948)', 11, 20),
    makeNode('Awakened Imagination\n(1954)', 11, 20),
    makeNode('The Law and\nthe Promise (1961)', 11, 20),
    makeNode('Out of This World\n(1949)', 11, 18),
    makeNode('The Power of\nAwareness (1952)', 11, 18),
    makeNode('At Your Command\n(1939)', 11, 16),
    makeNode('Prayer: Art of\nBelieving (1945)', 11, 16),
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const links: any[] = [
    // Core connections
    makeLink('Hukum Asumsi', 'Neville Goddard', 3),
    makeLink('Hukum Asumsi', 'I AM', 2.5),
    makeLink('Hukum Asumsi', 'Kesadaran', 2.5),
    makeLink('Hukum Asumsi', 'Asumsi', 2.5),
    makeLink('Hukum Asumsi', 'Perasaan', 2.5),
    makeLink('Hukum Asumsi', 'Imajinasi', 2.5),
    makeLink('Hukum Asumsi', 'Bawah Sadar', 1.5),
    makeLink('Hukum Asumsi', 'Persistensi', 1.5),
    makeLink('Hukum Asumsi', 'SATS', 1.5),
    makeLink('Hukum Asumsi', 'Sabat', 1),
    makeLink('Hukum Asumsi', 'Iman', 1),

    // Core inter-connections
    makeLink('I AM', 'Kesadaran', 2),
    makeLink('Kesadaran', 'Asumsi', 1.5),
    makeLink('Asumsi', 'Perasaan', 2),
    makeLink('Asumsi', 'Persistensi', 1.5),
    makeLink('Perasaan', 'Bawah Sadar', 2),
    makeLink('Imajinasi', 'I AM', 1.5),
    makeLink('Imajinasi', 'Kesadaran', 1.5),
    makeLink('Iman', 'Perasaan', 1.5),
    makeLink('Iman', 'Persistensi', 1),
    makeLink('SATS', 'Perasaan', 1.5),
    makeLink('SATS', 'Bawah Sadar', 1.5),
    makeLink('SATS', 'Imajinasi', 1),
    makeLink('Sabat', 'Persistensi', 1),
    makeLink('Sabat', 'Asumsi', 1),

    // Part 1 -> Core
    makeLink('Part 1: Kesadaran\nAdalah Realitas', 'Hukum Asumsi', 2),
    makeLink('Part 1: Kesadaran\nAdalah Realitas', 'I AM', 2),
    makeLink('Part 1: Kesadaran\nAdalah Realitas', 'Kesadaran', 2),
    makeLink('1.1 I AM:\nPenyebab Pertama', 'Part 1: Kesadaran\nAdalah Realitas', 1.5),
    makeLink('1.2 Kesadaran\nMenciptakan Dunia', 'Part 1: Kesadaran\nAdalah Realitas', 1.5),
    makeLink('1.3 Dua Sisi\nPenciptaan', 'Part 1: Kesadaran\nAdalah Realitas', 1.5),
    makeLink('1.4 Anda Sudah\nMenjadi Itu', 'Part 1: Kesadaran\nAdalah Realitas', 1.5),
    makeLink('1.5 Mekanisme\nRealisasi', 'Part 1: Kesadaran\nAdalah Realitas', 1.5),
    makeLink('1.1 I AM:\nPenyebab Pertama', 'I AM', 1),
    makeLink('1.2 Kesadaran\nMenciptakan Dunia', 'Kesadaran', 1),
    makeLink('1.3 Dua Sisi\nPenciptaan', 'Bawah Sadar', 1),
    makeLink('1.4 Anda Sudah\nMenjadi Itu', 'Asumsi', 1),
    makeLink('1.5 Mekanisme\nRealisasi', 'SATS', 1),
    makeLink('1.5 Mekanisme\nRealisasi', 'Perasaan', 1),

    // Part 2 -> Core
    makeLink('Part 2: Hukum\nAsumsi', 'Hukum Asumsi', 2),
    makeLink('Part 2: Hukum\nAsumsi', 'Asumsi', 2),
    makeLink('Part 2: Hukum\nAsumsi', 'Persistensi', 1.5),
    makeLink('2.1 Apa Itu Asumsi?', 'Part 2: Hukum\nAsumsi', 1.5),
    makeLink('2.2 Dunia Asumtif', 'Part 2: Hukum\nAsumsi', 1.5),
    makeLink('2.3 Asumsi Mengeras\nMenjadi Fakta', 'Part 2: Hukum\nAsumsi', 1.5),
    makeLink('2.4 Kekuatan\nPersistensi', 'Part 2: Hukum\nAsumsi', 1.5),
    makeLink('2.5 Importunity:\nKelancangan Berani', 'Part 2: Hukum\nAsumsi', 1.5),
    makeLink('2.3 Asumsi Mengeras\nMenjadi Fakta', 'Asumsi', 1),
    makeLink('2.4 Kekuatan\nPersistensi', 'Persistensi', 1),
    makeLink('2.5 Importunity:\nKelancangan Berani', 'Persistensi', 1),
    makeLink('2.2 Dunia Asumtif', 'Kesadaran', 1),

    // Part 3 -> Core
    makeLink('Part 3: Perasaan\nAdalah Rahasia', 'Hukum Asumsi', 2),
    makeLink('Part 3: Perasaan\nAdalah Rahasia', 'Perasaan', 2),
    makeLink('Part 3: Perasaan\nAdalah Rahasia', 'Iman', 1.5),
    makeLink('3.1 Perasaan sebagai\nSatu-satunya Medium', 'Part 3: Perasaan\nAdalah Rahasia', 1.5),
    makeLink('3.2 SAYA ADALAH vs\nSAYA AKAN MENJADI', 'Part 3: Perasaan\nAdalah Rahasia', 1.5),
    makeLink('3.3 Iman Adalah\nPerasaan', 'Part 3: Perasaan\nAdalah Rahasia', 1.5),
    makeLink('3.4 Perubahan Perasaan\n= Perubahan Nasib', 'Part 3: Perasaan\nAdalah Rahasia', 1.5),
    makeLink('3.5 Menginduksi\nKondisi Perasaan', 'Part 3: Perasaan\nAdalah Rahasia', 1.5),
    makeLink('3.1 Perasaan sebagai\nSatu-satunya Medium', 'Bawah Sadar', 1),
    makeLink('3.2 SAYA ADALAH vs\nSAYA AKAN MENJADI', 'I AM', 1),
    makeLink('3.3 Iman Adalah\nPerasaan', 'Iman', 1),
    makeLink('3.5 Menginduksi\nKondisi Perasaan', 'SATS', 1),

    // Part 4 -> Core
    makeLink('Part 4: Diam dalam\nKeinginan Terwujud', 'Hukum Asumsi', 2),
    makeLink('Part 4: Diam dalam\nKeinginan Terwujud', 'SATS', 1.5),
    makeLink('4.1 Diam dalam\nKeinginan Terwujud', 'Part 4: Diam dalam\nKeinginan Terwujud', 1.5),
    makeLink('4.2 Berpikir DARI\nvs. Berpikir TENTANG', 'Part 4: Diam dalam\nKeinginan Terwujud', 1.5),
    makeLink('4.3 Jadikan Tempat\nLain DI SINI', 'Part 4: Diam dalam\nKeinginan Terwujud', 1.5),
    makeLink('4.4 Berani Mengasumsikan\nAnda Adalah Itu', 'Part 4: Diam dalam\nKeinginan Terwujud', 1.5),
    makeLink('4.5 Pemeriksaan Diri', 'Part 4: Diam dalam\nKeinginan Terwujud', 1.5),
    makeLink('4.2 Berpikir DARI\nvs. Berpikir TENTANG', 'Imajinasi', 1),
    makeLink('4.4 Berani Mengasumsikan\nAnda Adalah Itu', 'Asumsi', 1),
    makeLink('4.1 Diam dalam\nKeinginan Terwujud', 'Perasaan', 1),
    makeLink('4.3 Jadikan Tempat\nLain DI SINI', 'Kesadaran', 1),

    // Part 5 -> Core
    makeLink('Part 5: Kondisi-Kondisi\nKesadaran', 'Hukum Asumsi', 2),
    makeLink('Part 5: Kondisi-Kondisi\nKesadaran', 'Kesadaran', 1.5),
    makeLink('5.1 Apa Itu Kondisi\nKesadaran?', 'Part 5: Kondisi-Kondisi\nKesadaran', 1.5),
    makeLink('5.2 Penghuni vs.\nNarapidana', 'Part 5: Kondisi-Kondisi\nKesadaran', 1.5),
    makeLink('5.3 Memasuki\nKondisi Baru', 'Part 5: Kondisi-Kondisi\nKesadaran', 1.5),
    makeLink('5.4 Tidak Ada yang\nDiubah Selain Diri', 'Part 5: Kondisi-Kondisi\nKesadaran', 1.5),
    makeLink('5.5 Tetap dalam\nKondisi', 'Part 5: Kondisi-Kondisi\nKesadaran', 1.5),
    makeLink('5.3 Memasuki\nKondisi Baru', 'Imajinasi', 1),
    makeLink('5.5 Tetap dalam\nKondisi', 'Persistensi', 1),
    makeLink('5.1 Apa Itu Kondisi\nKesadaran?', 'Kesadaran', 1),

    // Part 6 -> Core
    makeLink('Part 6: Revisi —\nMengubah Masa Lalu', 'Hukum Asumsi', 2),
    makeLink('Part 6: Revisi —\nMengubah Masa Lalu', 'Imajinasi', 1.5),
    makeLink('6.1 Apa Itu Revisi?', 'Part 6: Revisi —\nMengubah Masa Lalu', 1.5),
    makeLink('6.2 Gunting Pangkas\nRevisi', 'Part 6: Revisi —\nMengubah Masa Lalu', 1.5),
    makeLink('6.3 Praktik Harian', 'Part 6: Revisi —\nMengubah Masa Lalu', 1.5),
    makeLink('6.4 Pengampunan Adalah\nMengalami Kembali', 'Part 6: Revisi —\nMengubah Masa Lalu', 1.5),
    makeLink('6.5 Revisi dan\nOrang Lain', 'Part 6: Revisi —\nMengubah Masa Lalu', 1.5),
    makeLink('6.1 Apa Itu Revisi?', 'Imajinasi', 1),
    makeLink('6.3 Praktik Harian', 'SATS', 1),
    makeLink('6.2 Gunting Pangkas\nRevisi', 'Iman', 1),

    // Part 7 -> Core
    makeLink('Part 7: Imajinasi\nMenciptakan Realitas', 'Hukum Asumsi', 2),
    makeLink('Part 7: Imajinasi\nMenciptakan Realitas', 'Imajinasi', 2),
    makeLink('7.1 Siapa Imajinasi\nAnda?', 'Part 7: Imajinasi\nMenciptakan Realitas', 1.5),
    makeLink('7.2 Tubuh Abadi\nManusia', 'Part 7: Imajinasi\nMenciptakan Realitas', 1.5),
    makeLink('7.3 Penciptaan\nTelah Selesai', 'Part 7: Imajinasi\nMenciptakan Realitas', 1.5),
    makeLink('7.4 Membayangkan vs.\nMemvisualisasikan', 'Part 7: Imajinasi\nMenciptakan Realitas', 1.5),
    makeLink('7.5 Imajinasi\nBerkelanjutan', 'Part 7: Imajinasi\nMenciptakan Realitas', 1.5),
    makeLink('7.1 Siapa Imajinasi\nAnda?', 'I AM', 1),
    makeLink('7.3 Penciptaan\nTelah Selesai', 'Kesadaran', 1),
    makeLink('7.4 Membayangkan vs.\nMemvisualisasikan', 'SATS', 1),
    makeLink('7.5 Imajinasi\nBerkelanjutan', 'Persistensi', 1),

    // Part 8 -> Core
    makeLink('Part 8: Dimensi\nKeempat', 'Hukum Asumsi', 2),
    makeLink('Part 8: Dimensi\nKeempat', 'Imajinasi', 1.5),
    makeLink('8.1 Dimensi Keempat', 'Part 8: Dimensi\nKeempat', 1.5),
    makeLink('8.2 Waktu Bukanlah\nHambatan', 'Part 8: Dimensi\nKeempat', 1.5),
    makeLink('8.3 Memasuki Masa\nDepan Sekarang', 'Part 8: Dimensi\nKeempat', 1.5),
    makeLink('8.4 Dia yang Ada Telah\nDiinginkan Sampai Menjadi', 'Part 8: Dimensi\nKeempat', 1.5),
    makeLink('8.3 Memasuki Masa\nDepan Sekarang', 'SATS', 1),
    makeLink('8.3 Memasuki Masa\nDepan Sekarang', 'Imajinasi', 1),
    makeLink('8.2 Waktu Bukanlah\nHambatan', 'Kesadaran', 1),
    makeLink('8.1 Dimensi Keempat', 'Asumsi', 1),

    // Part 9 -> Core
    makeLink('Part 9: Mati kepada\nDiri Lama', 'Hukum Asumsi', 2),
    makeLink('Part 9: Mati kepada\nDiri Lama', 'Sabat', 1.5),
    makeLink('9.1 Mati kepada\nDiri Lama', 'Part 9: Mati kepada\nDiri Lama', 1.5),
    makeLink('9.2 Sabat: Istirahat\ndalam Asumsi', 'Part 9: Mati kepada\nDiri Lama', 1.5),
    makeLink('9.3 Penolakan terhadap\nKondisi Lama', 'Part 9: Mati kepada\nDiri Lama', 1.5),
    makeLink('9.4 Tinggalkan Cermin,\nUbah Wajah Anda', 'Part 9: Mati kepada\nDiri Lama', 1.5),
    makeLink('9.5 Kebenaran yang\nMembebaskan Anda', 'Part 9: Mati kepada\nDiri Lama', 1.5),
    makeLink('9.2 Sabat: Istirahat\ndalam Asumsi', 'Sabat', 1),
    makeLink('9.2 Sabat: Istirahat\ndalam Asumsi', 'Asumsi', 1),
    makeLink('9.1 Mati kepada\nDiri Lama', 'Asumsi', 1),
    makeLink('9.5 Kebenaran yang\nMembebaskan Anda', 'I AM', 1),
    makeLink('9.3 Penolakan terhadap\nKondisi Lama', 'Kesadaran', 1),

    // Part 10 -> Core
    makeLink('Part 10: Janji', 'Hukum Asumsi', 2),
    makeLink('10.1 Hukum vs. Janji', 'Part 10: Janji', 1.5),
    makeLink('10.2 Kisah Nyata', 'Part 10: Janji', 1.5),
    makeLink('10.3 Teknik Lengkap', 'Part 10: Janji', 1.5),
    makeLink('10.4 Tanda-tanda Mengikuti,\nMereka Tidak Mendahului', 'Part 10: Janji', 1.5),
    makeLink('10.5 Saya dan Bapa\nSaya Adalah Satu', 'Part 10: Janji', 1.5),
    makeLink('10.3 Teknik Lengkap', 'SATS', 1),
    makeLink('10.3 Teknik Lengkap', 'Asumsi', 1),
    makeLink('10.3 Teknik Lengkap', 'Persistensi', 1),
    makeLink('10.1 Hukum vs. Janji', 'Asumsi', 1),
    makeLink('10.5 Saya dan Bapa\nSaya Adalah Satu', 'I AM', 1),

    // Cross-part connections (curriculum flow)
    makeLink('Part 1: Kesadaran\nAdalah Realitas', 'Part 2: Hukum\nAsumsi', 1.5),
    makeLink('Part 2: Hukum\nAsumsi', 'Part 3: Perasaan\nAdalah Rahasia', 1.5),
    makeLink('Part 3: Perasaan\nAdalah Rahasia', 'Part 4: Diam dalam\nKeinginan Terwujud', 1.5),
    makeLink('Part 4: Diam dalam\nKeinginan Terwujud', 'Part 5: Kondisi-Kondisi\nKesadaran', 1.5),
    makeLink('Part 5: Kondisi-Kondisi\nKesadaran', 'Part 6: Revisi —\nMengubah Masa Lalu', 1.5),
    makeLink('Part 6: Revisi —\nMengubah Masa Lalu', 'Part 7: Imajinasi\nMenciptakan Realitas', 1.5),
    makeLink('Part 7: Imajinasi\nMenciptakan Realitas', 'Part 8: Dimensi\nKeempat', 1.5),
    makeLink('Part 8: Dimensi\nKeempat', 'Part 9: Mati kepada\nDiri Lama', 1.5),
    makeLink('Part 9: Mati kepada\nDiri Lama', 'Part 10: Janji', 1.5),

    // Resources connections
    makeLink('Sumber Daya\nPelengkap', 'Hukum Asumsi', 1.5),
    makeLink('7 Hari Mencapai\nKealamian Manifestasi', 'Sumber Daya\nPelengkap'),
    makeLink('Asumsimu Itu Dahsyat!', 'Sumber Daya\nPelengkap'),
    makeLink('Somatic Zero', 'Sumber Daya\nPelengkap'),
    makeLink('Meditasi Theta:\nInduksi SATS', 'Sumber Daya\nPelengkap'),
    makeLink('Jurnal Harian\nAsumsi & SATS', 'Sumber Daya\nPelengkap'),
    makeLink('Workbook 30 Hari\nManifestasi', 'Sumber Daya\nPelengkap'),
    makeLink('eBook Panduan\nManifestasi', 'Sumber Daya\nPelengkap'),
    makeLink('Webinar Masterclass\nSATS & Revisi', 'Sumber Daya\nPelengkap'),
    makeLink('Diagnosa Limiting\nBelief', 'Sumber Daya\nPelengkap'),
    makeLink('Diagnosa Shadow', 'Sumber Daya\nPelengkap'),
    makeLink('Komunitas Privat\n(2.4K+ Members)', 'Sumber Daya\nPelengkap'),
    makeLink('coolwisdombooks.com\n/neville', 'Sumber Daya\nPelengkap'),
    makeLink('Meditasi Theta:\nInduksi SATS', 'SATS', 1),
    makeLink('Jurnal Harian\nAsumsi & SATS', 'SATS', 1),
    makeLink('Workbook 30 Hari\nManifestasi', 'Persistensi', 1),
    makeLink('Diagnosa Limiting\nBelief', 'Bawah Sadar', 1),
    makeLink('Diagnosa Shadow', 'Bawah Sadar', 1),

    // Source books -> Parts
    makeLink('Feeling Is the Secret\n(1944)', 'Part 3: Perasaan\nAdalah Rahasia', 1),
    makeLink('Five Lessons\n(1948)', 'Part 1: Kesadaran\nAdalah Realitas', 1),
    makeLink('Five Lessons\n(1948)', 'Part 2: Hukum\nAsumsi', 1),
    makeLink('Awakened Imagination\n(1954)', 'Part 7: Imajinasi\nMenciptakan Realitas', 1),
    makeLink('The Law and\nthe Promise (1961)', 'Part 6: Revisi —\nMengubah Masa Lalu', 1),
    makeLink('The Law and\nthe Promise (1961)', 'Part 10: Janji', 1),
    makeLink('Out of This World\n(1949)', 'Part 8: Dimensi\nKeempat', 1),
    makeLink('The Power of\nAwareness (1952)', 'Part 9: Mati kepada\nDiri Lama', 1),
    makeLink('At Your Command\n(1939)', 'Part 2: Hukum\nAsumsi', 1),
    makeLink('Prayer: Art of\nBelieving (1945)', 'Part 3: Perasaan\nAdalah Rahasia', 1),
    makeLink('Neville Goddard', 'coolwisdombooks.com\n/neville', 1.5),

    // Source books -> Neville
    makeLink('Feeling Is the Secret\n(1944)', 'Neville Goddard'),
    makeLink('Five Lessons\n(1948)', 'Neville Goddard'),
    makeLink('Awakened Imagination\n(1954)', 'Neville Goddard'),
    makeLink('The Law and\nthe Promise (1961)', 'Neville Goddard'),
    makeLink('Out of This World\n(1949)', 'Neville Goddard'),
    makeLink('The Power of\nAwareness (1952)', 'Neville Goddard'),
    makeLink('At Your Command\n(1939)', 'Neville Goddard'),
    makeLink('Prayer: Art of\nBelieving (1945)', 'Neville Goddard'),

    // More cross-part concept links
    makeLink('4.2 Berpikir DARI\nvs. Berpikir TENTANG', '7.4 Membayangkan vs.\nMemvisualisasikan', 1.5),
    makeLink('9.2 Sabat: Istirahat\ndalam Asumsi', '5.5 Tetap dalam\nKondisi', 1),
    makeLink('6.3 Praktik Harian', '1.5 Mekanisme\nRealisasi', 1),
    makeLink('3.5 Menginduksi\nKondisi Perasaan', '8.3 Memasuki Masa\nDepan Sekarang', 1),
    makeLink('10.3 Teknik Lengkap', '1.5 Mekanisme\nRealisasi', 1),
    makeLink('5.2 Penghuni vs.\nNarapidana', '9.1 Mati kepada\nDiri Lama', 1),
  ];

  // Fix link targets (typo fix)
  links.forEach((l: { target: string }) => {
    if (l.target === 'Part 5: Kondisi-Kondisi\nKesadaman') {
      l.target = 'Part 5: Kondisi-Kondisi\nKesadaran';
    }
  });

  // Apply label formatting
  nodes.forEach((n: { label?: { fontFamily?: string } }) => {
    if (!n.label) n.label = {};
    n.label = {
      ...n.label,
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    };
  });

  return { nodes, links };
}

export default function CurriculumGraphView() {
  const t = UI_TRANSLATIONS.id

  const chartRef = useRef<HTMLDivElement>(null)
  const [chartInstance, setChartInstance] = useState<any>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load Apache ECharts dynamically to support SSR
  useEffect(() => {
    if (window.echarts) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)
  }, [])

  const graphData = useMemo(() => buildGraphData(), [])

  // Render ECharts Instance
  useEffect(() => {
    if (!scriptLoaded || !chartRef.current || typeof window === 'undefined' || !window.echarts) return;

    if (chartInstance) {
      chartInstance.dispose();
    }

    const echarts = window.echarts;
    const myChart = echarts.init(chartRef.current, null, { renderer: 'canvas' });

    const option = {
      backgroundColor: '#0a0a0c',

      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(10,10,12,0.95)',
        borderColor: 'rgba(245,200,66,0.3)',
        borderWidth: 1,
        textStyle: { color: '#e8e4dc', fontSize: 12, fontFamily: "'Segoe UI', system-ui, sans-serif" },
        formatter: function(params: any) {
          if (params.dataType === 'node') {
            const cat = CATEGORIES[params.data.category];
            const name = params.name.replace(/\n/g, ' ');
            return `<span style="color:${cat.color};font-weight:600">${name}</span><br/><span style="color:#8a8275;font-size:11px">${cat.name}</span>`;
          }
          return '';
        }
      },

      series: [{
        type: 'graph',
        layout: 'force',

        force: {
          repulsion: 380,
          gravity: 0.07,
          edgeLength: [70, 240],
          layoutAnimation: true,
          friction: 0.6,
        },

        roam: true,
        draggable: true,

        data: graphData.nodes,
        links: graphData.links,
        categories: CATEGORIES.map((c, i) => ({ name: c.name, itemStyle: { color: c.color } })),

        label: {
          show: true,
          position: 'right',
          distance: 8,
          fontSize: 10,
          color: '#b8b0a2',
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        },

        lineStyle: {
          color: 'rgba(180,160,130,0.1)',
          width: 1,
          curveness: 0.12,
        },

        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 3, color: 'rgba(245,200,66,0.5)' },
          label: { fontSize: 14, fontWeight: 'bold', color: '#fef9e7' },
          itemStyle: { shadowBlur: 20, shadowColor: 'rgba(245,200,66,0.3)' },
        },

        blur: {
          itemStyle: { opacity: 0.1 },
          lineStyle: { opacity: 0.03 },
          label: { color: 'rgba(184,176,162,0.12)' },
        },

        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
      }],
    };

    myChart.setOption(option);

    setChartInstance(myChart);

    // Resize handler
    const handleResize = () => myChart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, [scriptLoaded, graphData]);

  // Zoom actions
  const handleZoom = (type: 'in' | 'out' | 'reset') => {
    if (!chartInstance) return;
    const option = chartInstance.getOption();
    const currentZoom = option.series[0].zoom || 1;
    let nextZoom = currentZoom;

    if (type === 'in') nextZoom = Math.min(2.5, currentZoom + 0.2);
    else if (type === 'out') nextZoom = Math.max(0.3, currentZoom - 0.2);
    else {
      chartInstance.setOption({
        series: [{
          zoom: 1,
          center: null
        }]
      });
      return;
    }

    chartInstance.setOption({
      series: [{
        zoom: nextZoom
      }]
    });
  };

  return (
    <section id="curriculum-graph" className="w-full py-16 bg-[#0a0a0c] border-y border-neutral-900 overflow-hidden relative select-none">
      <div className="max-w-[1400px] mx-auto px-6 relative">

        {/* Main Canvas Frame */}
        <div className="w-full h-[400px] md:h-[680px] bg-[#0a0a0c] border border-neutral-800 rounded-3xl overflow-hidden relative shadow-2xl">

          {/* Floating Info HUD (Top-Left) — responsive for mobile */}
          <div className="absolute top-3 left-3 right-3 md:top-6 md:left-6 md:right-auto z-20 w-auto md:w-80 bg-[#0a0a0c]/92 backdrop-blur border border-[rgba(245,200,66,0.2)] p-3 md:p-5 rounded-2xl shadow-xl pointer-events-auto max-h-[50%] md:max-h-none overflow-y-auto">
            <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-1.5">
              <div className="w-[22px] h-[22px] md:w-[28px] md:h-[28px] bg-[#f5c842] rounded-lg flex items-center justify-center text-[11px] md:text-[14px] text-[#1a1508] font-bold shrink-0">✦</div>
              <h2 className="text-[13px] md:text-[17px] font-bold text-[#e8e4dc] m-0 tracking-tight">{t.title}</h2>
            </div>
            <p className="text-[10px] md:text-[11.5px] text-[#8a8275] mb-2 md:mb-3 leading-relaxed m-0 hidden md:block">
              {t.subtitle}
            </p>

            <div className="flex gap-2 md:gap-4 mb-2 md:mb-3">
              <div className="text-center">
                <div className="text-[14px] md:text-[18px] font-bold text-[#f5c842]">10</div>
                <div className="text-[8px] md:text-[9.5px] text-[#5c574d] uppercase tracking-wider">Bagian</div>
              </div>
              <div className="text-center">
                <div className="text-[14px] md:text-[18px] font-bold text-[#f5c842]">49</div>
                <div className="text-[8px] md:text-[9.5px] text-[#5c574d] uppercase tracking-wider">Pelajaran</div>
              </div>
              <div className="text-center">
                <div className="text-[14px] md:text-[18px] font-bold text-[#f5c842]">15+</div>
                <div className="text-[8px] md:text-[9.5px] text-[#5c574d] uppercase tracking-wider">Buku</div>
              </div>
              <div className="text-center">
                <div className="text-[14px] md:text-[18px] font-bold text-[#f5c842]">200+</div>
                <div className="text-[8px] md:text-[9.5px] text-[#5c574d] uppercase tracking-wider">Kuliah</div>
              </div>
            </div>

            {/* Color coding Legend — scrollable on mobile */}
            <div className="flex flex-wrap gap-x-2 md:gap-x-3 gap-y-0.5 md:gap-y-1">
              {CATEGORIES.map((catInfo, i) => (
                <div key={i} className="flex items-center gap-1 md:gap-1.5">
                  <span className="w-[7px] h-[7px] md:w-[9px] md:h-[9px] rounded-full shrink-0" style={{ backgroundColor: catInfo.color }} />
                  <span className="text-[8px] md:text-[10.5px] text-[#b8b0a2] whitespace-nowrap">{catInfo.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart container */}
          <div ref={chartRef} className="w-full h-full" />

          {/* Navigation Scale Controls (Bottom-Right) */}
          <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={() => handleZoom('in')}
              className="w-9 h-9 rounded-xl bg-[#0a0a0c]/95 border border-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-neutral-800"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="w-9 h-9 rounded-xl bg-[#0a0a0c]/95 border border-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-neutral-800"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => handleZoom('reset')}
              className="w-9 h-9 rounded-xl bg-[#0a0a0c]/95 border border-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-neutral-800"
              title="Reset View"
            >
              <RotateCcw size={15} />
            </button>
          </div>

        </div>

        {/* Small subtext instruction */}
        <div className="text-center mt-3 text-[10.5px] text-[#5c574d] font-sans select-none">
          {t.instruction}
        </div>

      </div>
    </section>
  )
}

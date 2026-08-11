'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, User, Mail, Phone, Video, CheckCircle2, Sparkles, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  label: string;
  available: boolean;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Success State
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ meetLink: string; timeSlot: string; dateStr: string } | null>(null);

  // Generate 7 hari ke depan (mulai dari besok) untuk dipilih klien
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString('id-ID', { month: 'short' });

    return { dateStr, dayName, dayNum, monthName, isToday: false };
  });

  // Fetch slot ketersediaan dari Google Calendar API setiap kali tanggal berubah
  useEffect(() => {
    if (!isOpen) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot(null);
      try {
        const res = await fetch(`/api/booking/availability?date=${selectedDate}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.slots)) {
          setSlots(data.slots);
          // Auto select slot pertama yang tersedia
          const firstAvailable = data.slots.find((s: TimeSlot) => s.available);
          if (firstAvailable) setSelectedSlot(firstAvailable);
        } else {
          setSlots([]);
        }
      } catch (err) {
        console.error('Error fetching time slots:', err);
        toast.error('Gagal mengambil ketersediaan jadwal.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, isOpen]);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot) {
      toast.error('Pilih slot waktu konsultasi terlebih dahulu.');
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error('Nama, email, dan nomor WhatsApp wajib diisi.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Format email tidak valid.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          dateStr: selectedDate,
          startTimeStr: selectedSlot.startTime,
          endTimeStr: selectedSlot.endTime,
          timeSlotLabel: selectedSlot.label,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setBookingSuccess(true);
        setSuccessData({
          meetLink: data.data?.meetLink || '',
          timeSlot: selectedSlot.label,
          dateStr: selectedDate,
        });
        toast.success('✦ Booking konsultasi berhasil & email undangan terkirim!');
      } else {
        toast.error(data.error || 'Gagal membuat booking.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      toast.error('Terjadi kesalahan saat memproses booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyMeetLink = () => {
    if (successData?.meetLink) {
      navigator.clipboard.writeText(successData.meetLink);
      toast.success('Link Google Meet berhasil disalin!');
    }
  };

  const handleResetAndClose = () => {
    setBookingSuccess(false);
    setSuccessData(null);
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="nv-modal-overlay" onClick={handleResetAndClose} style={{ zIndex: 9999 }}>
          <motion.div
            className="nv-modal-content nv-glass"
            style={{ maxWidth: '520px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="nv-modal-close" onClick={handleResetAndClose}>
              <X size={18} />
            </button>

            {bookingSuccess && successData ? (
              /* SUKSES VIEW */
              <div className="text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={32} />
                </div>

                <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  ✦ TERINTEGRASI GOOGLE CALENDAR & MEET
                </span>

                <h3 className="text-xl font-extrabold text-[#e8e4dc] mt-3">
                  Jadwal Konsultasi Terkonfirmasi!
                </h3>
                <p className="text-xs text-neutral-300 mt-1 max-w-sm mx-auto leading-relaxed">
                  Undangan resmi & notifikasi kalender telah dikirim langsung ke <strong>{email}</strong>.
                </p>

                {/* Info Card */}
                <div className="mt-5 p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 text-left space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <CalendarIcon size={14} className="text-amber-400" /> Tanggal:
                    </span>
                    <span className="font-bold text-white">
                      {new Date(successData.dateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-neutral-800 pt-2.5">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <Clock size={14} className="text-amber-400" /> Waktu Sesi:
                    </span>
                    <span className="font-bold text-amber-400">{successData.timeSlot}</span>
                  </div>

                  {successData.meetLink ? (
                    <div className="border-t border-neutral-800 pt-3">
                      <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1 mb-1.5">
                        <Video size={13} className="text-emerald-400" /> Link Room Google Meet:
                      </span>
                      <div className="flex items-center gap-2 bg-black/60 p-2 rounded-lg border border-neutral-800">
                        <input
                          type="text"
                          readOnly
                          value={successData.meetLink}
                          className="bg-transparent text-xs text-emerald-400 font-mono flex-1 outline-none truncate"
                        />
                        <button
                          type="button"
                          onClick={copyMeetLink}
                          className="p-1.5 text-neutral-400 hover:text-white rounded bg-neutral-800"
                          title="Salin Link"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                      <a
                        href={successData.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg"
                      >
                        <span>Join Google Meet Sesi Ini</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  ) : (
                    <div className="border-t border-neutral-800 pt-2.5 text-[11px] text-amber-400/90 flex items-center gap-1.5">
                      <AlertCircle size={14} />
                      <span>Link Google Meet disertakan di undangan email Gmail Anda.</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="mt-5 w-full py-2.5 rounded-lg border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 transition"
                >
                  Selesai & Tutup
                </button>
              </div>
            ) : (
              /* FORM BOOKING VIEW */
              <>
                <div className="text-center">
                  <div className="nv-auth-logo-badge">
                    <Sparkles size={22} />
                  </div>
                  <h3 className="nv-modal-title mt-2 text-lg font-bold">
                    📅 Booking Konsultasi 1-on-1
                  </h3>
                  <p className="nv-modal-desc mt-1 text-xs text-neutral-400">
                    Pilih tanggal & slot waktu yang tersedia. Jadwal otomatis terhubung ke Google Calendar & Meet.
                  </p>
                </div>

                <form onSubmit={handleSubmitBooking} className="flex flex-col gap-4 mt-5">
                  {/* Step 1: Selector Tanggal */}
                  <div>
                    <label className="nv-modal-label flex items-center gap-1 mb-2 text-[11px]">
                      <CalendarIcon size={13} className="text-amber-400" /> 1. PILIH TANGGAL
                    </label>

                    <div className="flex gap-2 overflow-x-auto pb-2 nv-scroll-premium">
                      {availableDates.map((item) => {
                        const isSelected = item.dateStr === selectedDate;
                        return (
                          <button
                            key={item.dateStr}
                            type="button"
                            onClick={() => setSelectedDate(item.dateStr)}
                            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border min-w-[62px] transition ${
                              isSelected
                                ? 'bg-gradient-to-b from-[#d4a053] to-[#b8862d] text-black border-[#d4a053] font-bold shadow-lg scale-[1.03]'
                                : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                            }`}
                          >
                            <span className={`text-[10px] uppercase ${isSelected ? 'text-black/80 font-bold' : 'text-neutral-500'}`}>
                              {item.dayName}
                            </span>
                            <span className="text-base font-extrabold my-0.5">{item.dayNum}</span>
                            <span className={`text-[9px] uppercase ${isSelected ? 'text-black/70' : 'text-neutral-500'}`}>
                              {item.monthName}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Slot Jam */}
                  <div>
                    <label className="nv-modal-label flex items-center justify-between mb-2 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-amber-400" /> 2. PILIH WAKTU SESI (WIB)
                      </span>
                      {loadingSlots && <span className="text-[10px] text-amber-400 animate-pulse">Mengecek Google Calendar...</span>}
                    </label>

                    {loadingSlots ? (
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-10 rounded-lg bg-neutral-900/60 animate-pulse" />
                        ))}
                      </div>
                    ) : slots.length === 0 ? (
                      <p className="text-xs text-neutral-500 text-center py-3 bg-neutral-900/50 rounded-lg">
                        Tidak ada slot waktu tersedia pada tanggal ini.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {slots.map((slot) => {
                          const isSelected = selectedSlot?.startTime === slot.startTime;
                          const isAvailable = slot.available;

                          return (
                            <button
                              key={slot.startTime}
                              type="button"
                              disabled={!isAvailable}
                              onClick={() => setSelectedSlot(slot)}
                              className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-semibold transition ${
                                !isAvailable
                                  ? 'opacity-40 bg-neutral-950 border-neutral-900 text-neutral-600 cursor-not-allowed line-through'
                                  : isSelected
                                  ? 'bg-[#d4a053]/20 border-[#d4a053] text-[#e5b869] shadow-md'
                                  : 'bg-neutral-900/70 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                              }`}
                            >
                              <span>{slot.label}</span>
                              {isAvailable ? (
                                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400 shadow-[0_0_8px_#d4a053]' : 'bg-emerald-500'}`} />
                              ) : (
                                <span className="text-[10px] text-red-500 font-normal">Penuh</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Step 3: Form Data Diri */}
                  <div className="space-y-3 pt-2 border-t border-neutral-900">
                    <label className="nv-modal-label text-[11px] block mb-1">
                      3. DATA DIRI & CATATAN KONSULTASI
                    </label>

                    {/* Name */}
                    <div className="nv-auth-input-group">
                      <div className="nv-auth-input-wrapper">
                        <User size={15} className="nv-auth-input-icon" />
                        <input
                          type="text"
                          required
                          placeholder="Nama Lengkap Anda"
                          className="nv-auth-input text-xs"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="nv-auth-input-group">
                      <div className="nv-auth-input-wrapper">
                        <Mail size={15} className="nv-auth-input-icon" />
                        <input
                          type="email"
                          required
                          placeholder="Email Gmail Anda (untuk kirim undangan Google Calendar)"
                          className="nv-auth-input text-xs"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="nv-auth-input-group">
                      <div className="nv-auth-input-wrapper">
                        <Phone size={15} className="nv-auth-input-icon" />
                        <input
                          type="tel"
                          required
                          placeholder="No. WhatsApp (08xxxxxxxxxx)"
                          className="nv-auth-input text-xs"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <textarea
                      rows={2}
                      placeholder="Topik / Tantangan manifestasi yang ingin didiskusikan (opsional)"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 outline-none focus:border-amber-500/50"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting || !selectedSlot}
                    className="nv-auth-submit-btn mt-2 py-3 text-xs font-extrabold flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #d4a053, #b8862d)',
                      color: '#000',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {submitting ? (
                      <span>Menghubungkan ke Google Calendar...</span>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        <span>Konfirmasi Booking & Buat Google Meet Link →</span>
                      </>
                    )}
                  </motion.button>

                  <p className="text-[10px] text-neutral-500 text-center leading-relaxed">
                    ✦ Undangan otomatis & link Google Meet akan dikirim ke Gmail Anda.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

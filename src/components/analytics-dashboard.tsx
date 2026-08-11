'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Video, Clock, User, Mail, Phone, ExternalLink, RefreshCw, CheckCircle } from 'lucide-react';

interface GA4Data {
  status: string;
  data?: any[];
  totals?: any[];
  message?: string;
}

interface GSCData {
  status: string;
  data?: any[];
  message?: string;
  hint?: string;
}

interface BookingItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  timeSlot: string;
  status: string;
  googleMeetLink?: string;
  bookingDate: string;
}

export function AnalyticsDashboard() {
  const [ga4Data, setGa4Data] = useState<GA4Data | null>(null);
  const [gscData, setGscData] = useState<GSCData | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch('/api/booking/admin');
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchBookings();

        // Fetch GA4 data
        const ga4Response = await fetch('/api/analytics/ga4');
        const ga4Result = await ga4Response.json();
        setGa4Data(ga4Result);

        // Fetch GSC data
        const gscResponse = await fetch('/api/analytics/gsc');
        const gscResult = await gscResponse.json();
        setGscData(gscResult);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setGa4Data({ status: 'error', message: String(error) });
        setGscData({ status: 'error', message: String(error) });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading analytics & booking data...</div>;
  }

  return (
    <div className="space-y-6 p-8">
      {/* CARD 1: DAILY BOOKING CONSULTATION WIDGET */}
      <Card className="border-amber-500/30 bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-extrabold flex items-center gap-2 text-amber-400">
              <Calendar size={20} /> Jadwal Konsultasi Hari Ini & Terkini
            </CardTitle>
            <CardDescription>
              Terintegrasi langsung ke Google Calendar (bangnevgo@gmail.com) & Meet
            </CardDescription>
          </div>
          <button
            onClick={fetchBookings}
            disabled={loadingBookings}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-1.5 transition"
            title="Refresh Data Booking"
          >
            <RefreshCw size={13} className={loadingBookings ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </CardHeader>
        <CardContent>
          {loadingBookings ? (
            <div className="text-xs text-muted-foreground py-4 text-center">Memuat daftar booking...</div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-center bg-muted/40 rounded-xl border border-dashed">
              <p className="text-sm font-semibold text-muted-foreground">Belum ada booking konsultasi untuk hari ini.</p>
              <p className="text-xs text-muted-foreground mt-1">Form booking di website siap menerima pendaftar kapan saja.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold px-1">
                <span>TOTAL BOOKING TERKINI: {bookings.length} SESI</span>
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle size={12} /> Undangan & Meeting Link Otomatis Aktiv
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {bookings.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-muted/80 border border-border flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Clock size={13} /> {item.timeSlot}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-foreground flex items-center gap-1.5 mt-1">
                        <User size={14} className="text-muted-foreground" /> {item.name}
                      </h4>

                      <div className="text-xs text-muted-foreground space-y-0.5 pl-5">
                        <div className="flex items-center gap-1">
                          <Mail size={12} /> {item.email}
                        </div>
                        {item.phone && item.phone !== '-' && (
                          <div className="flex items-center gap-1">
                            <Phone size={12} /> {item.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    {item.googleMeetLink ? (
                      <a
                        href={item.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                      >
                        <Video size={14} />
                        <span>Join Google Meet</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <div className="text-[11px] text-muted-foreground italic text-center py-1">
                        Check event di Google Calendar Anda
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GA4 Card */}
      <Card>
        <CardHeader>
          <CardTitle>Google Analytics 4</CardTitle>
          <CardDescription>Last 30 days of website traffic</CardDescription>
        </CardHeader>
        <CardContent>
          {ga4Data?.status === 'success' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {ga4Data.totals?.map((total: any, idx: number) => (
                  <div key={idx} className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">
                      {total.values?.[0] || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Users / Views
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Top Pages</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {ga4Data.data?.slice(0, 5).map((row: any, idx: number) => (
                    <div key={idx} className="text-sm p-2 bg-muted rounded">
                      <div className="font-medium">{row.dimensionValues?.[0]?.value || 'Unknown'}</div>
                      <div className="text-xs text-muted-foreground">
                        Users: {row.metricValues?.[0]?.value} | Views: {row.metricValues?.[1]?.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-red-500">
              <p className="font-semibold">Error connecting to GA4</p>
              <p className="text-sm">{ga4Data?.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GSC Card */}
      <Card>
        <CardHeader>
          <CardTitle>Google Search Console</CardTitle>
          <CardDescription>Search performance data</CardDescription>
        </CardHeader>
        <CardContent>
          {gscData?.status === 'success' ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {gscData.data?.slice(0, 10).map((row: any, idx: number) => (
                <div key={idx} className="text-sm p-3 bg-muted rounded">
                  <div className="font-medium">
                    Query: {row.keys?.[0] || 'Unknown'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Clicks: {row.clicks} | Impressions: {row.impressions} | CTR: {(row.ctr * 100).toFixed(1)}% | Position: {row.position?.toFixed(1)}
                  </div>
                </div>
              ))}
              {!gscData.data?.length && (
                <p className="text-muted-foreground">No search data available yet</p>
              )}
            </div>
          ) : (
            <div className="text-yellow-600">
              <p className="font-semibold">Cannot connect to GSC</p>
              <p className="text-sm">{gscData?.message}</p>
              <p className="text-xs mt-2">{gscData?.hint}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

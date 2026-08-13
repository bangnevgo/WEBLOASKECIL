'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import Landing from '@/components/landing';

function ViewLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center p-6 text-[#e8e4dc]">
      <div className="relative w-12 h-12 flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
        <span className="text-amber-500 text-sm font-serif">✦</span>
      </div>
      <p className="text-xs uppercase tracking-widest text-neutral-400 font-mono animate-pulse">Memuat Modul...</p>
    </div>
  );
}

const Dashboard = dynamic(() => import('@/components/dashboard'), {
  loading: () => <ViewLoadingFallback />,
});
const LessonDetail = dynamic(() => import('@/components/lesson-detail'), {
  loading: () => <ViewLoadingFallback />,
});
const FreeLessonPage = dynamic(() => import('@/components/free-lesson-page'), {
  loading: () => <ViewLoadingFallback />,
});
const AiManifestation = dynamic(() => import('@/components/ai-manifestation'), {
  loading: () => <ViewLoadingFallback />,
});
const AiLimitingBelief = dynamic(() => import('@/components/ai-limiting-belief'), {
  loading: () => <ViewLoadingFallback />,
});
const AiShadow = dynamic(() => import('@/components/ai-shadow'), {
  loading: () => <ViewLoadingFallback />,
});
const AiPrivateSession = dynamic(() => import('@/components/ai-private-session'), {
  loading: () => <ViewLoadingFallback />,
});
const CommunityPage = dynamic(() => import('@/components/community/CommunityPage'), {
  loading: () => <ViewLoadingFallback />,
});

export default function HomeClient() {
  const { view, language } = useAppStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [view]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  switch (view) {
    case 'landing':
      return <Landing />;
    case 'dashboard':
      return <Dashboard />;
    case 'lesson':
      return <LessonDetail />;
    case 'free-lesson':
      return <FreeLessonPage />;
    case 'ai-manifestation':
      return <AiManifestation />;
    case 'ai-limiting-belief':
      return <AiLimitingBelief />;
    case 'ai-shadow':
      return <AiShadow />;
    case 'ai-private-session':
      return <AiPrivateSession />;
    case 'community':
      return <CommunityPage />;
    default:
      return <Landing />;
  }
}

'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Landing from '@/components/landing';
import Dashboard from '@/components/dashboard';
import LessonDetail from '@/components/lesson-detail';
import FreeLessonPage from '@/components/free-lesson-page';
import Pricing from '@/components/pricing';
import AiManifestation from '@/components/ai-manifestation';
import AiLimitingBelief from '@/components/ai-limiting-belief';
import AiShadow from '@/components/ai-shadow';
import AiPrivateSession from '@/components/ai-private-session';
import AdminPanel from '@/components/admin-panel';
import CommunityPage from '@/components/community/CommunityPage';

export default function HomeClient() {
  const { view } = useAppStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [view]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  switch (view) {
    case 'landing':
      return <Landing />;
    case 'dashboard':
      return <Dashboard />;
    case 'lesson':
      return <LessonDetail />;
    case 'free-lesson':
      return <FreeLessonPage />;
    case 'pricing':
      return <Pricing />;
    case 'ai-manifestation':
      return <AiManifestation />;
    case 'ai-limiting-belief':
      return <AiLimitingBelief />;
    case 'ai-shadow':
      return <AiShadow />;
    case 'ai-private-session':
      return <AiPrivateSession />;
    case 'admin':
      return <AdminPanel />;
    case 'community':
      return <CommunityPage />;
    default:
      return <Landing />;
  }
}

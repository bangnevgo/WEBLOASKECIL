'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Landing from '@/components/landing';
import Dashboard from '@/components/dashboard';
import LessonDetail from '@/components/lesson-detail';
import FreeLessonPage from '@/components/free-lesson-page';
import AiManifestation from '@/components/ai-manifestation';
import AiLimitingBelief from '@/components/ai-limiting-belief';
import AiShadow from '@/components/ai-shadow';
import AiPrivateSession from '@/components/ai-private-session';
import CommunityPage from '@/components/community/CommunityPage';

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

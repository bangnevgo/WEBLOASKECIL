import CommunityPage from '@/components/community/CommunityPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Komunitas Privat - Hukum Asumsi',
  description:
    'Bergabung dengan komunitas eksklusif Hukum Asumsi. Diskusi, support system, dan tersambung dengan sesama pencari kebenaran.',
}

export default function Community() {
  return <CommunityPage />
}
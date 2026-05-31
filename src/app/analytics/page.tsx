import { Metadata } from 'next';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';

export const metadata: Metadata = {
  title: 'Analytics Dashboard',
  robots: {
    index: false,
  },
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Real-time GA4 and Google Search Console data
        </p>
        <AnalyticsDashboard />
      </div>
    </div>
  );
}

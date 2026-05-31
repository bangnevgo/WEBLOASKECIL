'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

export function AnalyticsDashboard() {
  const [ga4Data, setGa4Data] = useState<GA4Data | null>(null);
  const [gscData, setGscData] = useState<GSCData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
    return <div className="p-8">Loading analytics data...</div>;
  }

  return (
    <div className="space-y-6 p-8">
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

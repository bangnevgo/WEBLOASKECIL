import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// GA4 property that covers BOTH loas.nevgoinstitute.com and cohort.nevgoinstitute.com
const PROPERTY_ID = '469650688';

function buildCredentials() {
  // Preferred: a single service-account JSON secret (same credential BOS uses).
  if (process.env.GA4_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.GA4_SERVICE_ACCOUNT_JSON);
    } catch {
      // fall through to individual env vars
    }
  }
  // Fallback: assemble from individual env vars.
  const pk = process.env.GA4_PRIVATE_KEY;
  return {
    type: 'service_account',
    project_id: process.env.GA4_PROJECT_ID,
    private_key_id: process.env.GA4_PRIVATE_KEY_ID,
    private_key: pk ? pk.replace(/\\n/g, '\n') : undefined,
    client_email: process.env.GA4_SERVICE_ACCOUNT_EMAIL,
    client_id: process.env.GA4_CLIENT_ID || '',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      process.env.GA4_CLIENT_X509_CERT_URL ||
      `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
        process.env.GA4_SERVICE_ACCOUNT_EMAIL || ''
      )}`,
  };
}

export async function GET(request: NextRequest) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: buildCredentials(),
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    const analyticsData = google.analyticsdata('v1beta');
    const response = await analyticsData.properties.runReport({
      auth,
      property: `properties/${PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
        dimensions: [{ name: 'pagePath' }],
        limit: 10,
      },
    });

    const totals = response.data.totals?.[0]?.metricValues || [];
    const activeUsers = parseInt(totals[0]?.value || '0', 10);
    const pageViews = parseInt(totals[1]?.value || '0', 10);

    const topPages = (response.data.rows || [])
      .map((row) => ({
        path: row.dimensionValues?.[0]?.value || '?',
        users: parseInt(row.metricValues?.[0]?.value || '0', 10),
        views: parseInt(row.metricValues?.[1]?.value || '0', 10),
      }))
      .sort((a, b) => b.views - a.views);

    return NextResponse.json({
      status: 'success',
      property: PROPERTY_ID,
      totals: [{ values: [activeUsers, pageViews] }],
      data: topPages,
    });
  } catch (error) {
    console.error('GA4 API Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
  try {
    const auth = new google.auth.GoogleAuth({
      projectId: process.env.GA4_PROJECT_ID,
      credentials: {
        type: 'service_account',
        project_id: process.env.GA4_PROJECT_ID,
        private_key_id: process.env.GA4_PRIVATE_KEY_ID,
        private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GA4_SERVICE_ACCOUNT_EMAIL,
        client_id: '',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      },
    });

    const analyticsData = google.analyticsdata('v1beta');

    const response = await analyticsData.properties.runReport({
      auth,
      property: `properties/469650688`,
      requestBody: {
        dateRanges: [
          {
            startDate: '30daysAgo',
            endDate: 'today',
          },
        ],
        metrics: [
          {
            name: 'activeUsers',
          },
          {
            name: 'screenPageViews',
          },
        ],
        dimensions: [
          {
            name: 'pagePath',
          },
        ],
      },
    });

    return NextResponse.json({
      status: 'success',
      data: response.data.rows,
      totals: response.data.totals,
    });
  } catch (error) {
    console.error('GA4 API Error:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

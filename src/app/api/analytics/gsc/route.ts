import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export async function GET(request: NextRequest) {
  try {
    const oauth2Client = new OAuth2Client(
      process.env.GSC_CLIENT_ID,
      process.env.GSC_CLIENT_SECRET,
      'http://localhost:3000/api/analytics/gsc/callback'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GSC_REFRESH_TOKEN,
    });

    const searchconsole = google.searchconsole('v1');

    const response = await searchconsole.searchanalytics.query({
      auth: oauth2Client,
      siteUrl: 'https://loas.nevgoinstitute.com/',
      requestBody: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        dimensions: ['query', 'page'],
        rowLimit: 25,
      },
    });

    return NextResponse.json({
      status: 'success',
      data: response.data.rows,
    });
  } catch (error) {
    console.error('GSC API Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Make sure GSC OAuth credentials are set and the site is verified in Search Console'
      },
      { status: 500 }
    );
  }
}

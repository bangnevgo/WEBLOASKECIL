import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse(
    'google-site-verification: google1f79236d2f8b2d3c.html',
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
}

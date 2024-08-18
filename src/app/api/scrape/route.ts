import { NextRequest, NextResponse } from 'next/server';
import { scrapeWebsite } from '@/lib/scraper';
import { analyzeContent } from '@/lib/aiAnalyzer';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  console.log('Received scrape request for URL:', url);

  try {
    const scrapedData = await scrapeWebsite(url);
    console.log('Scraped data:', scrapedData);

    const analysis = await analyzeContent(scrapedData);
    console.log('Analysis result:', analysis);

    return NextResponse.json({ scrapedData, analysis });
  } catch (error: unknown) {
    console.error('Error in scrape route:', error);
    let errorMessage = 'An unknown error occurred';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    console.error('Detailed error:', { errorMessage, errorDetails });
    
    return NextResponse.json({ error: errorMessage, details: errorDetails || 'No details available' }, { status: 500 });
  }
}
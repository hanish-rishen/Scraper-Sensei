import { NextRequest, NextResponse } from 'next/server';
import { scrapeWebsite } from '@/lib/scraper';
import { analyzeContent } from '@/lib/aiAnalyzer';

export async function POST(req: NextRequest) {
  console.log('POST request received at /api/scrape');
  try {
    const body = await req.json();
    const { url } = body;
    console.log('Received scrape request for URL:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const scrapedData = await scrapeWebsite(url);
    console.log('Scraped data:', scrapedData);

    const analysis = await analyzeContent(scrapedData);
    console.log('Analysis result:', analysis);

    return NextResponse.json({ scrapedData, analysis });
  } catch (error) {
    console.error('Error in scrape route:', error);
    return NextResponse.json(
      { error: 'Failed to scrape or analyze', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
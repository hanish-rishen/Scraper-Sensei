import axios from 'axios';
import { logger } from '@/lib/logger';
import { incrementScrapeCounter, observeScrapeLatency } from '@/lib/monitoring';

const API_KEY = process.env.OLOSTEP_API_KEY || '';
const OLOSTEP_API_URL = 'https://agent.olostep.com/olostep-p2p-incomingAPI';

export async function scrapeWebsite(url: string) {
  try {
    logger.info(`Attempting to scrape: ${url}`);
    const startTime = Date.now();
    incrementScrapeCounter();
    const response = await axios.get(OLOSTEP_API_URL, {
      params: {
        url_to_scrape: url,
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    logger.info(`Olostep API response received for ${url}`);

    if (!response.data.markdown_content) {
      throw new Error('Invalid response from Olostep API: Missing markdown_content');
    }

    observeScrapeLatency((Date.now() - startTime) / 1000);

    const cleanedText = cleanText(response.data.markdown_content);

    return {
      title: extractTitle(cleanedText),
      text: cleanedText,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(`Axios error: ${error.message}. Status: ${error.response?.status}. Data: ${JSON.stringify(error.response?.data)}`);
      throw new Error(`Axios error: ${error.message}. Status: ${error.response?.status}. Data: ${JSON.stringify(error.response?.data)}`);
    } else {
      logger.error(`Unknown error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
      throw new Error(`Unknown error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
  }
}

function cleanText(markdown: string): string {
  // Remove links
  const textWithoutLinks = markdown.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  // Remove special characters and extra whitespace
  return textWithoutLinks.replace(/[^a-zA-Z0-9.,!? ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractTitle(markdown: string): string {
  const titleMatch = markdown.match(/^#\s(.+)$/m);
  if (titleMatch) return titleMatch[1];
  
  const firstLine = markdown.split('\n')[0].trim();
  return firstLine || 'Untitled';
}
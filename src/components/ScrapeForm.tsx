'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrapeResult } from '@/types';
import ProgressBar from './ProgressBar';

interface ScrapeFormProps {
  onScrapeComplete: (data: ScrapeResult) => void;
}

export default function ScrapeForm({ onScrapeComplete }: ScrapeFormProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    try {
      console.log('Sending request to /api/scrape');
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value);
        result += chunk;
        console.log('Received chunk:', chunk);

        try {
          const parsedChunk = JSON.parse(chunk);
          if (parsedChunk.progress) {
            setProgress(parsedChunk.progress);
          }
        } catch (e) {
          // Ignore parsing errors for incomplete chunks
        }
      }

      console.log('Full response:', result);

      try {
        const data = JSON.parse(result);
        if ('scrapedData' in data && 'analysis' in data) {
          onScrapeComplete(data as ScrapeResult);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error parsing response:', error);
        alert('Error: Invalid response from server');
      }
    } catch (error: unknown) {
      console.error('Error scraping:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="flex gap-2 mb-4">
        <Input
          type="url"
          placeholder="Enter URL to scrape"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow bg-gray-800 text-gray-100 border-gray-700"
          required
        />
        <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
          {isLoading ? 'Scraping...' : 'Scrape'}
        </Button>
      </div>
      {isLoading && <ProgressBar progress={progress} />}
    </motion.form>
  );
}
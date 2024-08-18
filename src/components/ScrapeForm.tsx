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
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value);
        result += chunk;

        try {
          const lines = result.split('\n');
          for (const line of lines) {
            if (line.trim()) {
              const parsedChunk = JSON.parse(line);
              if (parsedChunk.progress) {
                setProgress(parsedChunk.progress);
              }
            }
          }
        } catch (e) {
          // Ignore parsing errors for incomplete chunks
        }
      }

      const data: ScrapeResult = JSON.parse(result.trim().split('\n').pop() || '{}');
      if (response.ok) {
        onScrapeComplete(data);
      } else {
        console.error('Error response:', data);
        alert(`Error: ${(data as any).error}\nDetails: ${(data as any).details}`);
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
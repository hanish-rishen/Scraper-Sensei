'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import StarryBackground from '@/components/StarryBackground';
import { ScrapedData, Analysis, ScrapeResult } from '@/types';
import ScrapeForm from '@/components/ScrapeForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import AIAnalysis from '@/components/AIAnalysis';

export default function ScraperPage() {
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const handleScrapeComplete = (data: ScrapeResult) => {
    setScrapedData(data.scrapedData);
    setAnalysis(data.analysis);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col items-center justify-start p-8 bg-black text-gray-100 relative overflow-hidden"
    >
      <StarryBackground />
      <div className="z-10 w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Scraper Sensei
        </h1>
        <ScrapeForm onScrapeComplete={handleScrapeComplete} />
        {scrapedData && <ResultsDisplay scrapedData={scrapedData} />}
        {analysis && <AIAnalysis analysis={analysis} />}
      </div>
    </motion.main>
  );
}
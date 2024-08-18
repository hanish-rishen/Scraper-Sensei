'use client';

import { motion } from 'framer-motion';

interface ScrapedData {
  text: string;
}

export default function ResultsDisplay({ scrapedData }: { scrapedData: ScrapedData | null }) {
  if (!scrapedData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 w-full max-w-2xl"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-200">Scraped Content</h2>
      <div className="bg-gray-800 p-4 rounded-md shadow-lg">
        <div className="mt-2 text-gray-300 max-h-96 overflow-y-auto overflow-x-hidden">
          {scrapedData.text.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-2 break-words whitespace-pre-wrap text-justify">{paragraph}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
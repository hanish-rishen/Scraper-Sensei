'use client';

import { motion } from 'framer-motion';
import { Analysis } from '@/types';

export default function AIAnalysis({ analysis }: { analysis: Analysis | null }) {
  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8 w-full max-w-2xl"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-200">AI Analysis</h2>
      <div className="bg-gray-800 p-4 rounded-md shadow-lg">
        <p className="mb-2"><strong className="text-purple-400">Title Sentiment:</strong> <span className="text-gray-300">{analysis.titleSentiment}</span></p>
        <p className="mb-2"><strong className="text-purple-400">Content Sentiment:</strong> <span className="text-gray-300">{analysis.textSentiment}</span></p>
        <p className="mb-2"><strong className="text-purple-400">Category:</strong> <span className="text-gray-300">{analysis.category}</span></p>
        <p className="mb-2"><strong className="text-purple-400">Analysis:</strong> <span className="text-gray-300">{analysis.analysis}</span></p>
      </div>
    </motion.div>
  );
}
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 relative">
      <motion.div
        className="bg-purple-600 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
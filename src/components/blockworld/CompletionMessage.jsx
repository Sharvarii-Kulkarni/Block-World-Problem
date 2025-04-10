
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CompletionMessage = ({ stepCount }) => {
  return (
    <motion.div 
      className="mb-8 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700 text-green-800 dark:text-green-300"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <h3 className="text-lg font-medium flex items-center gap-2">
        <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
        Goal State Reached!
      </h3>
      <p>Solution found in {stepCount} steps.</p>
    </motion.div>
  );
};

export default CompletionMessage;

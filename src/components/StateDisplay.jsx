
import React from 'react';
import BlockStack from './BlockStack';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const StateDisplay = ({ 
  state, 
  heuristic, 
  isBest = false,
  isGoal = false,
  className = '',
  label,
  correctBlocks,
  highlight
}) => {
  return (
    <motion.div 
      className={cn(
        "border rounded-lg p-4 transition-all flex flex-col items-center", 
        isBest ? "border-blockGreen border-2" : "border-gray-200",
        isGoal ? "bg-blockLightPurple" : "",
        className
      )}
      initial={isBest ? { scale: 0.95 } : {}}
      animate={isBest ? { 
        scale: 1,
        boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 10px rgba(16,185,129,0.5)", "0px 0px 0px rgba(0,0,0,0)"]
      } : {}}
      transition={{ duration: 0.5 }}
    >
      {label && <div className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">{label}</div>}
      <div className="flex gap-4">
        {state.map((stack, index) => (
          <BlockStack 
            key={index} 
            blocks={stack}
            isCorrect={correctBlocks?.[index]}
            stackIndex={index}
            highlight={highlight === index}
          />
        ))}
      </div>
      {heuristic !== undefined && (
        <motion.div 
          className={cn(
            "mt-3 font-medium text-sm",
            isBest ? "text-blockGreen" : "text-gray-600 dark:text-gray-400"
          )}
          animate={isBest ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          Heuristic: {heuristic}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StateDisplay;

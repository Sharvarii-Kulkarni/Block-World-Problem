import React from 'react';
import Block from './Block';
import { motion } from 'framer-motion';

const BlockStack = ({ 
  blocks, 
  className = '',
  highlight = false,
  isCorrect,
  onDragOver,
  onDrop,
  stackIndex
}) => {
  return (
    <motion.div 
      className={`flex flex-col-reverse items-center gap-1 p-2 rounded-lg min-h-32 border-2 border-dashed border-gray-200 dark:border-gray-700 ${highlight ? 'border-blockPurple dark:border-blockPurple' : ''} ${className}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      animate={highlight ? { 
        boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 10px rgba(155,135,245,0.5)", "0px 0px 0px rgba(0,0,0,0)"],
      } : {}}
      transition={{ duration: 1.5, repeat: highlight ? Infinity : 0 }}
    >
      {blocks.map((block, index) => (
        <Block 
          key={`${stackIndex}-${block}-${index}`} 
          letter={block} 
          layoutId={`block-${block}`}
          color={isCorrect && isCorrect[index] ? 'blockGreen' : 'blockPurple'} 
        />
      ))}
    </motion.div>
  );
};

export default BlockStack;

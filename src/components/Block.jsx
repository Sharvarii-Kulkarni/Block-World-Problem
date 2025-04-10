import React from 'react';
import { motion } from 'framer-motion';

const Block = ({ 
  letter, 
  color = 'blockPurple', 
  size = 'md',
  className = '',
  isDraggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  id,
  layoutId
}) => {
  const sizeClass = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  }[size];

  // Here we're separating the HTML5 drag & drop from Framer Motion animations
  return (
    <div
      id={id}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative ${isDraggable ? 'cursor-move' : ''}`}
    >
      <motion.div 
        layoutId={layoutId}
        initial={false}
        className={`block ${sizeClass} rounded-md ${className} flex items-center justify-center font-bold text-white shadow-md`}
        style={{ backgroundColor: `var(--${color}, #9b87f5)` }}
        whileHover={isDraggable ? { scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)" } : undefined}
        whileTap={isDraggable ? { scale: 0.95 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {letter}
      </motion.div>
    </div>
  );
};

export default Block;

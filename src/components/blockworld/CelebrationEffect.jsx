
import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CelebrationEffect = ({ isActive }) => {
  if (!isActive) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <motion.div 
        className="w-full h-full flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
              scale: Math.random() * 0.5 + 0.5,
              opacity: 1
            }}
            animate={{
              y: window.innerHeight + 20,
              opacity: 0,
              transition: {
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                repeatType: "loop",
                delay: Math.random() * 2
              }
            }}
          >
            <Sparkles className="text-blockPurple" size={Math.random() * 20 + 10} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CelebrationEffect;


import React from 'react';
import { motion } from 'framer-motion';
import StateDisplay from '../StateDisplay';

const NextMovesDisplay = ({ nextMoves }) => {
  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-medium mb-3">Possible Next Moves</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nextMoves.slice(0, 3).map((move, idx) => (
          <motion.div 
            key={idx} 
            className="relative group"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <StateDisplay 
              state={move.state}
              heuristic={move.heuristic}
              isBest={idx === 0}
              className="cursor-help transition-all"
            />
            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg transition-opacity duration-200">
              <div className="text-white text-center p-4">
                <div className="font-medium">{move.move}</div>
                <div className="text-sm mt-1">Heuristic: {move.heuristic}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NextMovesDisplay;

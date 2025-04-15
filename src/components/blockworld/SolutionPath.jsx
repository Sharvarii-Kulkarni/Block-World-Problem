
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import StateDisplay from '../StateDisplay';

const SolutionPath = ({ history }) => {
  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-medium mb-3">Solution Path</h3>
      <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 pt-2">
        {history.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="min-w-[120px] max-w-none pr-2">

              <StateDisplay 
                state={step.state}
                className="origin-top-left"
              />
              <div className="text-xs text-center mt-1">Step {idx}</div>
              {step.move && (
                <div className="text-xs text-center text-gray-500 mt-1 truncate px-1" title={step.move}>
                  {step.move}
                </div>
              )}
            </div>
            {idx < history.length - 1 && (
              <div className="flex items-center">
                <ArrowRight size={16} className="text-blockGray" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default SolutionPath;

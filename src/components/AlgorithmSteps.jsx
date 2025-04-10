import React from 'react';
import { ArrowDown } from 'lucide-react';

const AlgorithmSteps = () => {
  const steps = [
    { title: "1. Start with Initial State", description: "Begin with the blocks in their initial arrangement." },
    { title: "2. Evaluate Current State", description: "Calculate the heuristic value for the current state." },
    { title: "3. Generate Possible Moves", description: "Identify all possible next states by valid block movements." },
    { title: "4. Evaluate All Possible Moves", description: "Calculate heuristic values for each possible move." },
    { title: "5. Select Best Move", description: "Choose the move with the best (highest) heuristic value." },
    { title: "6. Move to New State", description: "Make the selected move and update the current state." },
    { title: "7. Check Goal State", description: "If goal is reached, stop. Otherwise, return to step 2." },
  ];

  return (
    <div className="flex flex-col">
      {steps.map((step, index) => (
        <div key={index} className="step-container">
          <div className="flowchart-box bg-blockLightPurple text-left p-4">
            <div>
              <div className="font-medium text-blockDarkPurple">{step.title}</div>
              <div className="text-sm text-gray-600">{step.description}</div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="flowchart-arrow flex justify-center py-2">
              <ArrowDown size={20} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlgorithmSteps;

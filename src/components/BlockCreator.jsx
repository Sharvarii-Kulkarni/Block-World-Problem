import React, { useState, useEffect } from 'react';
import Block from './Block';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';

const BlockCreator = ({ onStateCreate, stateLabel }) => {
  const [numBlocks, setNumBlocks] = useState(3);
  const [numStacks, setNumStacks] = useState(3);
  const [blocks, setBlocks] = useState([]);
  const [blockState, setBlockState] = useState([[], [], []]);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [draggedStackIndex, setDraggedStackIndex] = useState(null);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState(null);
  const [dragTargetStack, setDragTargetStack] = useState(null);

  // Generate blocks based on the number input
  const generateBlocks = () => {
    const blockLetters = Array.from({ length: numBlocks }, (_, i) => 
      String.fromCharCode(65 + i)  // ASCII code for 'A' is 65
    );
    setBlocks(blockLetters);
    setBlockState(Array.from({ length: numStacks }, () => []));
  };

  // Initialize blocks on component mount and when numBlocks or numStacks change
  useEffect(() => {
    generateBlocks();
  }, [numBlocks, numStacks]);
  
  // Submit the created state to parent when blockState changes
  useEffect(() => {
    // Only notify parent if blocks have been actually placed in stacks
    const totalPlacedBlocks = blockState.reduce((sum, stack) => sum + stack.length, 0);
    if (totalPlacedBlocks > 0) {
      onStateCreate(blockState);
    }
  }, [blockState]);

  // Handle drag start
  const handleDragStart = (block, stackIndex, blockIndex) => (e) => {
    setDraggedBlock(block);
    setDraggedStackIndex(stackIndex);
    setDraggedBlockIndex(blockIndex);
    e.dataTransfer.setData('text/plain', block);
  };

  // Handle drag over
  const handleDragOver = (stackIndex) => (e) => {
    e.preventDefault();
    setDragTargetStack(stackIndex);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragTargetStack(null);
  };

  // Handle drop on a stack
  const handleDrop = (stackIndex) => (e) => {
    e.preventDefault();
    if (draggedBlock === null) return;
    
    // If the block is already in a stack, remove it
    if (draggedStackIndex !== null && draggedBlockIndex !== null) {
      const newState = [...blockState];
      newState[draggedStackIndex] = newState[draggedStackIndex].filter((_, i) => i !== draggedBlockIndex);
      // Add to the new stack
      newState[stackIndex] = [...newState[stackIndex], draggedBlock];
      setBlockState(newState);
    } else {
      // Block is from the available blocks list
      const newState = [...blockState];
      newState[stackIndex] = [...newState[stackIndex], draggedBlock];
      setBlockState(newState);
      // Remove from available blocks
      setBlocks(blocks.filter(b => b !== draggedBlock));
    }
    
    setDraggedBlock(null);
    setDraggedStackIndex(null);
    setDraggedBlockIndex(null);
    setDragTargetStack(null);
  };

  // Reset all states
  const handleReset = () => {
    generateBlocks();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-medium mb-4 text-gray-900 dark:text-gray-100">{stateLabel} Configuration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Blocks
              </Label>
              <span className="text-sm font-medium text-blockPurple">{numBlocks}</span>
            </div>
            <Slider
              value={[numBlocks]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setNumBlocks(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Stacks
              </Label>
              <span className="text-sm font-medium text-blockPurple">{numStacks}</span>
            </div>
            <Slider
              value={[numStacks]}
              min={2}
              max={5}
              step={1}
              onValueChange={(value) => setNumStacks(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={generateBlocks}
            className="w-full mb-4"
          >
            Generate Blocks
          </Button>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Available Blocks</h4>
          <div className="flex flex-wrap gap-2 mb-4 min-h-14 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
            {blocks.map((block) => (
              <Block 
                key={block} 
                letter={block} 
                isDraggable={true}
                onDragStart={handleDragStart(block, null, null)}
                size="sm"
                layoutId={`available-${block}`}
              />
            ))}
          </div>
          
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stacks</h4>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {blockState.map((stack, stackIndex) => (
              <motion.div 
                key={stackIndex}
                className={`flex flex-col-reverse items-center gap-1 min-h-28 p-2 rounded-md ${
                  dragTargetStack === stackIndex 
                    ? 'bg-blockLightPurple dark:bg-gray-600 border-2 border-dashed border-blockPurple' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
                onDragOver={handleDragOver(stackIndex)}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop(stackIndex)}
                animate={dragTargetStack === stackIndex ? { scale: 1.05 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {stack.map((block, blockIndex) => (
                  <Block 
                    key={`${stackIndex}-${blockIndex}`} 
                    letter={block} 
                    isDraggable={true}
                    onDragStart={handleDragStart(block, stackIndex, blockIndex)}
                    size="sm"
                    layoutId={`stack-${stackIndex}-${block}-${blockIndex}`}
                  />
                ))}
                {stack.length === 0 && (
                  <div className="text-xs text-gray-400 italic">Drop blocks here</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={() => onStateCreate(blockState)} className="bg-blockPurple hover:bg-blockDarkPurple">
          Set {stateLabel} State
        </Button>
      </div>
    </div>
  );
};

export default BlockCreator;

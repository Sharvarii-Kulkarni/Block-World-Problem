
import React, { useState, useEffect } from 'react';
import StateDisplay from '../StateDisplay';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import NextMovesDisplay from './NextMovesDisplay';
import SolutionPath from './SolutionPath';
import CompletionMessage from './CompletionMessage';
import CelebrationEffect from './CelebrationEffect';
import { 
  hillClimbStep, 
  calculateHeuristic, 
  checkCorrectPlacement,
  areStatesEqual
} from '@/lib/blockworld';

const BlockWorldVisualizer = ({ 
  initialState, 
  goalState,
  className = ''
}) => {
  
  const [currentState, setCurrentState] = useState(initialState);
  const [history, setHistory] = useState([]);
  const [nextMoves, setNextMoves] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [stepMode, setStepMode] = useState('manual');
  const [currentHeuristic, setCurrentHeuristic] = useState(
    calculateHeuristic(initialState, goalState)
  );
  const [highlightedStack, setHighlightedStack] = useState(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const { toast } = useToast();
  
  // Calculate correctness of block placement
  const correctPlacements = checkCorrectPlacement(currentState, goalState);
  const goalCorrectPlacements = checkCorrectPlacement(goalState, goalState);
  
  // Check if we've reached the goal state
  useEffect(() => {
    if (areStatesEqual(currentState, goalState)) {
      setIsComplete(true);
      setIsRunning(false);
      setIsCelebrating(true);
      toast({
        title: "Goal Reached! 🎉",
        description: `Successfully solved in ${stepCount} steps!`,
        variant: "default",
      });
      
      // Turn off celebration after 5 seconds
      const timer = setTimeout(() => {
        setIsCelebrating(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [currentState, goalState, stepCount, toast]);
  
  // Start the solving process
  const handleStart = () => {
    setIsRunning(true);
    setHistory([{ 
      state: initialState, 
      heuristic: calculateHeuristic(initialState, goalState) 
    }]);
    const initialMoves = hillClimbStep(initialState, goalState);
    setNextMoves(initialMoves);
    setStepCount(0);
    setCurrentState(initialState);
    setCurrentHeuristic(calculateHeuristic(initialState, goalState));
    setIsComplete(false);
    setIsCelebrating(false);
    
    // If no moves available or we're already at the goal
    if (initialMoves.length === 0 || areStatesEqual(initialState, goalState)) {
      if (areStatesEqual(initialState, goalState)) {
        setIsComplete(true);
        toast({
          title: "Already at Goal State",
          description: "The initial state is already the goal state!",
          variant: "default",
        });
      } else {
        toast({
          title: "No Possible Moves",
          description: "There are no valid moves from the initial state.",
          variant: "destructive",
        });
      }
      setIsRunning(false);
    }
  };
  
  // Reset to initial state
  const handleReset = () => {
    setIsRunning(false);
    setHistory([]);
    setNextMoves([]);
    setCurrentState(initialState);
    setCurrentHeuristic(calculateHeuristic(initialState, goalState));
    setStepCount(0);
    setIsComplete(false);
    setIsCelebrating(false);
    setHighlightedStack(null);
  };
  
  // Take the next best step
  const handleNextStep = () => {
    if (nextMoves.length === 0 || isComplete) return;
    
    // Get the next best move
    const bestMove = nextMoves[0];
    
    // Highlight the source stack first
    setHighlightedStack(bestMove.fromStack);
    
    // After a short delay, highlight the destination stack
    setTimeout(() => {
      setHighlightedStack(bestMove.toStack);
      
      // Update current state
      setCurrentState(bestMove.state);
      setCurrentHeuristic(bestMove.heuristic);
      
      // Add to history
      setHistory(prev => [...prev, bestMove]);
      
      // Generate next possible moves
      const newMoves = hillClimbStep(bestMove.state, goalState);
      setNextMoves(newMoves);
      
      // Increment step count
      setStepCount(prev => prev + 1);
      
      // If no more moves available and not at goal state
      if (newMoves.length === 0 && !areStatesEqual(bestMove.state, goalState)) {
        toast({
          title: "Local Maximum Reached",
          description: "No better moves available. Algorithm has reached a local maximum.",
          variant: "destructive",
        });
        setIsRunning(false);
      }
      
      // Reset highlight after the animation
      setTimeout(() => {
        setHighlightedStack(null);
      }, 500);
      
    }, 1000);
  };
  
  // Auto-step with a delay when in auto mode
  useEffect(() => {
    if (isRunning && stepMode === 'auto' && !isComplete && nextMoves.length > 0) {
      const timer = setTimeout(() => {
        handleNextStep();
      }, 2000); // Longer delay to better see the animations
      return () => clearTimeout(timer);
    }
  }, [isRunning, stepMode, nextMoves, isComplete, stepCount]);
  
  return (
    <div className={`${className} relative`}>
      <CelebrationEffect isActive={isCelebrating} />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Block World Visualizer</h2>
        <div className="flex gap-3">
          {!isRunning ? (
            <Button 
              onClick={handleStart} 
              className="bg-blockPurple hover:bg-blockDarkPurple"
              disabled={isComplete}
            >
              Start Solving
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => setStepMode(stepMode === 'auto' ? 'manual' : 'auto')}
                variant="outline"
              >
                {stepMode === 'auto' ? 'Switch to Manual' : 'Switch to Auto'}
              </Button>
              {stepMode === 'manual' && (
                <Button 
                  onClick={handleNextStep}
                  disabled={isComplete || nextMoves.length === 0}
                  className="bg-blockPurple hover:bg-blockDarkPurple"
                >
                  Next Step
                </Button>
              )}
              <Button onClick={handleReset} variant="outline">Reset</Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-medium mb-3">Current State</h3>
          <StateDisplay 
            state={currentState}
            heuristic={currentHeuristic}
            label={`Step ${stepCount}`}
            correctBlocks={correctPlacements}
            highlight={highlightedStack}
          />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-3">Goal State</h3>
          <StateDisplay 
            state={goalState}
            heuristic={calculateHeuristic(goalState, goalState)}
            isGoal={true}
            correctBlocks={goalCorrectPlacements}
          />
        </div>
      </div>
      
      <AnimatePresence>
        {isRunning && !isComplete && nextMoves.length > 0 && (
          <NextMovesDisplay nextMoves={nextMoves} />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isComplete && <CompletionMessage stepCount={stepCount} />}
      </AnimatePresence>
      
      <AnimatePresence>
        {isRunning && history.length > 0 && <SolutionPath history={history} />}
      </AnimatePresence>
    </div>
  );
};

export default BlockWorldVisualizer;

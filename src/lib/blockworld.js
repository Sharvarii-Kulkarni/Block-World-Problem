
// Block state is represented as an array of stacks (arrays), each containing blocks (strings)

// Calculate heuristic: +1 for each block in the correct position, -1 for incorrect
export const calculateHeuristic = (state, goal) => {
  let score = 0;
  
  // Compare each stack
  for (let stackIdx = 0; stackIdx < Math.max(state.length, goal.length); stackIdx++) {
    const stateStack = state[stackIdx] || [];
    const goalStack = goal[stackIdx] || [];
    
    // Compare blocks from bottom to top, stop at the first mismatch
    for (let blockIdx = 0; blockIdx < Math.max(stateStack.length, goalStack.length); blockIdx++) {
      const stateBlock = stateStack[blockIdx];
      const goalBlock = goalStack[blockIdx];
      
      if (stateBlock === goalBlock && stateBlock !== undefined) {
        // Block is in correct position
        score += 1;
      } else {
        // Either block is wrong or one is missing
        if (stateBlock !== undefined && goalBlock !== undefined) {
          score -= 1;
        }
        // Stop checking this stack after a mismatch
        break;
      }
    }
  }
  
  return score;
};

// Check if a block is correctly placed compared to the goal state
export const checkCorrectPlacement = (state, goal) => {
  const result = [];
  
  for (let stackIdx = 0; stackIdx < state.length; stackIdx++) {
    result[stackIdx] = [];
    const stateStack = state[stackIdx];
    const goalStack = goal[stackIdx] || [];
    
    let matchingSoFar = true;
    
    for (let blockIdx = 0; blockIdx < stateStack.length; blockIdx++) {
      const block = stateStack[blockIdx];
      
      // A block is correct if all blocks below it are correct AND it matches the goal
      const isCorrect = matchingSoFar && blockIdx < goalStack.length && goalStack[blockIdx] === block;
      result[stackIdx][blockIdx] = isCorrect;
      
      // If this block doesn't match, all blocks above won't match either
      if (!isCorrect) {
        matchingSoFar = false;
      }
    }
  }
  
  return result;
};

// Generate all possible next states by moving one block at a time
export const generateSuccessors = (state) => {
  const successors = [];
  
  // For each stack
  for (let fromStackIdx = 0; fromStackIdx < state.length; fromStackIdx++) {
    const fromStack = state[fromStackIdx];
    
    // Skip empty stacks
    if (fromStack.length === 0) continue;
    
    // Get the top block
    const topBlockIdx = fromStack.length - 1;
    const blockToMove = fromStack[topBlockIdx];
    
    // Try moving this block to each other stack
    for (let toStackIdx = 0; toStackIdx < state.length; toStackIdx++) {
      // Don't move to the same stack
      if (fromStackIdx === toStackIdx) continue;
      
      // Create a new state with the move applied
      const newState = JSON.parse(JSON.stringify(state));
      
      // Remove the block from its original stack
      newState[fromStackIdx].pop();
      
      // Add it to the new stack
      newState[toStackIdx].push(blockToMove);
      
      successors.push({
        state: newState,
        move: `Move block ${blockToMove} from stack ${fromStackIdx + 1} to stack ${toStackIdx + 1}`,
        fromStack: fromStackIdx,
        toStack: toStackIdx
      });
    }
  }
  
  return successors;
};

// Perform one step of the hill climbing algorithm
export const hillClimbStep = (currentState, goalState) => {
  // Generate all possible next states
  const successors = generateSuccessors(currentState);
  
  // Evaluate each successor
  const evaluatedSuccessors = successors.map(({ state, move, fromStack, toStack }) => ({
    state,
    move,
    fromStack,
    toStack,
    heuristic: calculateHeuristic(state, goalState)
  }));
  
  // Sort by heuristic value (descending)
  evaluatedSuccessors.sort((a, b) => b.heuristic - a.heuristic);
  
  // Filter out moves that don't improve the current state
  const currentHeuristic = calculateHeuristic(currentState, goalState);
  const betterMoves = evaluatedSuccessors.filter(move => move.heuristic >= currentHeuristic);
  
  // Return all valid successor moves, sorted by best first
  return betterMoves.length > 0 ? betterMoves : [];
};

// Helper function to check if two states are equal
export const areStatesEqual = (state1, state2) => {
  if (state1.length !== state2.length) return false;
  
  for (let i = 0; i < state1.length; i++) {
    if (state1[i].length !== state2[i].length) return false;
    
    for (let j = 0; j < state1[i].length; j++) {
      if (state1[i][j] !== state2[i][j]) return false;
    }
  }
  
  return true;
};

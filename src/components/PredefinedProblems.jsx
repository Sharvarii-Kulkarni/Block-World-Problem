
import React from 'react';
import { calculateHeuristic } from '@/lib/blockworld';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StateDisplay from './StateDisplay';
import { motion } from 'framer-motion';

const PredefinedProblems = ({ onSelectProblem }) => {
  // Predefined problems
  const problems = [
    {
      id: "simple",
      name: "Simple Stacking",
      description: "A simple 3-block problem to understand the basics",
      initialState: [["A"], ["B", "C"], []],
      goalState: [["A", "B", "C"], [], []],
      difficulty: 'easy'
    },
    {
      id: "reverse",
      name: "Reverse Order",
      description: "Stack blocks in reverse order",
      initialState: [["A", "B", "C"], [], []],
      goalState: [["C", "B", "A"], [], []],
      difficulty: 'medium'
    },
    {
      id: "medium",
      name: "Split Stack",
      description: "Move blocks from one stack to two different stacks",
      initialState: [["B"], ["C", "D"], ["A"]],
      goalState: [["A", "B"], ["C"], ["D"]],
      difficulty: 'medium'
    },
    {
      id: "complex",
      name: "Complex Rearrangement",
      description: "A challenging 4-block problem with blocks on different stacks",
      initialState: [[], ["B", "C", "D", "A"], []],
      goalState: [["A", "B"], ["C", "D"], []],
      difficulty: 'hard'
    },
    {
      id: "alphabet",
      name: "3 stack Order",
      description: "Arrange blocks in alphabetical order from bottom to top",
      initialState: [["C", "A"], ["E", "D"], ["B"]],
      goalState: [["E"], ["D","B"], ["A","C"]],
      difficulty: 'hard'
    },
    {
      id: "sussman",
      name: "Sussman Anomaly",
      description: "A classic AI planning problem",
      initialState: [["C"], ["A"], ["B"]],
      goalState: [["A", "B", "C"], [], []],
      difficulty: 'easy'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">Predefined Problems</h3>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {problems.map((problem) => (
          <motion.div key={problem.id} variants={item}>
            <Card className="overflow-hidden transition-all hover:shadow-lg h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{problem.name}</CardTitle>
                    <CardDescription>{problem.description}</CardDescription>
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded ${
                    problem.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {problem.difficulty}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Initial State</h4>
                    <StateDisplay 
                      state={problem.initialState}
                      heuristic={calculateHeuristic(problem.initialState, problem.goalState)}
                      className="transform scale-75 origin-top-left"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Goal State</h4>
                    <StateDisplay 
                      state={problem.goalState} 
                      heuristic={calculateHeuristic(problem.goalState, problem.goalState)}
                      className="transform scale-75 origin-top-left"
                      isGoal={true}
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => onSelectProblem(problem.initialState, problem.goalState)}
                  className="w-full bg-blockPurple hover:bg-blockDarkPurple"
                >
                  Select This Problem
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PredefinedProblems;

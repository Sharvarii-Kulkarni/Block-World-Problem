import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BlockWorldVisualizer from '@/components/BlockWorldVisualizer';
import AlgorithmSteps from '@/components/AlgorithmSteps';
import Block from '@/components/Block';
import BlockCreator from '@/components/BlockCreator';
import PredefinedProblems from '@/components/PredefinedProblems';
import ThemeToggle from '@/components/ThemeToggle';
import { ArrowDown, MoveUpRight, Code, BookOpen, Blocks, BrainCircuit, Plus, ArrowRight } from 'lucide-react';
import { calculateHeuristic } from '@/lib/blockworld';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  // State for problem configuration
  const [initialState, setInitialState] = useState([["A"], ["B", "C"], []]);
  const [goalState, setGoalState] = useState([["A", "B", "C"], [], []]);
  const [problemConfigured, setProblemConfigured] = useState(false);
  const [activeTab, setActiveTab] = useState("introduction");
  
  // References for scrolling
  const visualizationRef = useRef(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      checkProblemConfigured(initialState, goalState);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  const handleSetInitialState = (state) => {
    setInitialState(state);
    checkProblemConfigured(state, goalState);
  };
  
  const handleSetGoalState = (state) => {
    setGoalState(state);
    checkProblemConfigured(initialState, state);
  };
  
  const checkProblemConfigured = (initial, goal) => {
    const initialHasBlocks = initial.some(stack => stack.length > 0);
    const goalHasBlocks = goal.some(stack => stack.length > 0);
    setProblemConfigured(initialHasBlocks && goalHasBlocks);
  };
  
  const handleSelectProblem = (initial, goal) => {
    setInitialState(initial);
    setGoalState(goal);
    setProblemConfigured(true);
  };
  
  const handleStartSolving = () => {
    setActiveTab("visualization");
    setTimeout(() => {
      visualizationRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 transition-colors dark:bg-gray-900">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-blockDarkPurple dark:text-blockLightPurple">
          Understanding the Block World Problem
        </h1>
        <ThemeToggle />
      </div>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-12">
        Exploring AI problem solving with the Steepest Ascent Hill Climbing Algorithm
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="introduction">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="introduction">Introduction</TabsTrigger>
          <TabsTrigger value="algorithm">The Algorithm</TabsTrigger>
          <TabsTrigger value="configure">Configure Problem</TabsTrigger>
          <TabsTrigger value="visualization">Interactive Visualization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="introduction">
          <div className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Blocks className="text-blockPurple" />
                  What is the Block World Problem?
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  The Block World problem is a classic AI planning problem where we have a set of blocks
                  that need to be arranged in a specific order.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg mb-6">
                  <h3 className="font-medium mb-2 dark:text-gray-200">Key Components:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>A set of blocks (labeled with letters)</li>
                    <li>Stacks where blocks can be placed</li>
                    <li>An initial configuration of blocks</li>
                    <li>A goal configuration to be achieved</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg dark:text-gray-200">Heuristic Function</CardTitle>
                    <CardDescription className="dark:text-gray-400">How we evaluate states</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <code className="bg-gray-100 dark:bg-gray-700 p-1 rounded">h(state) = +1</code> for each correctly placed block
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Button 
              onClick={() => setActiveTab("configure")}
              className="mt-8 mx-auto block bg-blockPurple hover:bg-blockDarkPurple dark:bg-blockDarkPurple dark:hover:bg-blockPurple"
            >
              Configure Your Problem
              <Plus className="ml-2" size={16} />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="algorithm">
          <div className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Code className="text-blockPurple" />
                  Steepest Ascent Hill Climbing
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  The Steepest Ascent Hill Climbing algorithm is a local search algorithm that
                  continuously moves toward states with better heuristic values.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 dark:text-gray-200">Algorithm Steps</h3>
                <AlgorithmSteps />
              </div>
            </div>
            
            <Button 
              onClick={() => setActiveTab("configure")}
              className="mt-8 mx-auto block bg-blockPurple hover:bg-blockDarkPurple dark:bg-blockDarkPurple dark:hover:bg-blockPurple"
            >
              Configure Your Problem
              <Plus className="ml-2" size={16} />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="configure">
          <div className="pt-6 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BlockCreator 
                onStateCreate={handleSetInitialState}
                stateLabel="Initial"
              />
              <BlockCreator 
                onStateCreate={handleSetGoalState}
                stateLabel="Goal"
              />
            </div>
            
            <div className="flex flex-col items-center mt-8 space-y-4">
              <Button 
                onClick={handleStartSolving} 
                className="text-lg px-8 py-6 bg-blockPurple hover:bg-blockDarkPurple dark:bg-blockDarkPurple dark:hover:bg-blockPurple"
                disabled={!problemConfigured}
              >
                Start Solving
                <BrainCircuit className="ml-2" size={20} />
              </Button>
              {!problemConfigured && (
                <p className="text-red-500 text-sm">
                  Please configure both initial and goal states before proceeding.
                </p>
              )}
            </div>
            
            <div className="mt-10">
              <Separator className="my-6" />
              <PredefinedProblems onSelectProblem={handleSelectProblem} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="visualization">
          <div className="pt-6" ref={visualizationRef}>
            <BlockWorldVisualizer 
              initialState={initialState}
              goalState={goalState}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index; 
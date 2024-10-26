import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Check,
  Scale,
  Dumbbell,
  TrendingUp,
  Target,
  Info
} from 'lucide-react';
import type { GoalSelectProps } from '@/types/types';

const goals = [
  {
    value: 'Weight Loss',
    title: 'Weight Loss',
    description: 'Reduce body fat and get leaner',
    icon: Scale,
    gradient: 'from-red-500 to-orange-500',
    bgGradient: 'from-red-500/10 to-orange-500/10',
    detail: 'Focus on caloric deficit with high protein intake'
  },
  {
    value: 'Muscle Building',
    title: 'Build Muscle',
    description: 'Gain muscle mass and strength',
    icon: Dumbbell,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    detail: 'Progressive overload with caloric surplus'
  },
  {
    value: 'Weight Gain',
    title: 'Healthy Gain',
    description: 'Increase weight sustainably',
    icon: TrendingUp,
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-500/10 to-emerald-500/10',
    detail: 'Balanced nutrition with caloric surplus'
  },
  {
    value: 'Maintenance',
    title: 'Maintain',
    description: 'Keep current fitness level',
    icon: Target,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
    detail: 'Balanced approach to nutrition and training'
  }
] as const;

export const GoalSelect: React.FC<GoalSelectProps> = ({ value, onChange }) => {
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Goals Grid */}
      <div className="grid grid-cols-2 gap-4">
        {goals.map((goal) => (
          <motion.button
            key={goal.value}
            onClick={() => onChange(goal.value)}
            onHoverStart={() => setHoveredGoal(goal.value)}
            onHoverEnd={() => setHoveredGoal(null)}
            className={cn(
              "relative overflow-hidden rounded-2xl p-6 border transition-all duration-300",
              value === goal.value 
                ? `border-transparent ring-2 ring-offset-2 ring-${goal.gradient.split('-')[1]}`
                : "border-gray-200 dark:border-gray-700"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Gradient */}
            <motion.div
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300",
                `bg-gradient-to-br ${goal.bgGradient}`
              )}
              animate={{
                opacity: value === goal.value || hoveredGoal === goal.value ? 1 : 0
              }}
            />

            {/* Content */}
            <div className="relative space-y-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                `bg-gradient-to-br ${goal.gradient}`
              )}>
                <goal.icon className="w-6 h-6 text-white" />
              </div>

              <div>
                <h3 className="font-semibold text-lg">{goal.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {goal.description}
                </p>
              </div>

              {value === goal.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    `bg-gradient-to-br ${goal.gradient}`
                  )}>
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selected Goal Detail */}
      <AnimatePresence mode="wait">
        {value && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "p-4 rounded-xl",
              `bg-gradient-to-br ${goals.find(g => g.value === value)?.bgGradient}`
            )}
          >
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {goals.find(g => g.value === value)?.detail}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
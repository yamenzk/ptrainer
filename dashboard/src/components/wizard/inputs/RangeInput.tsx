// src/components/wizard/inputs/RangeInput.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Minus,
  Plus,
  Clock,
  ActivitySquare
} from 'lucide-react';
import type { RangeInputProps } from '@/types/types';

const descriptions: Record<'meals' | 'workouts', Record<number, string>> = {
  meals: {
    3: 'Standard frequency, suitable for most people',
    4: 'Balanced approach with regular meals',
    5: 'Higher frequency for better nutrient timing',
    6: 'Advanced meal timing for specific goals'
  },
  workouts: {
    3: 'Good for beginners and maintenance',
    4: 'Balanced approach for steady progress',
    5: 'Advanced frequency for faster results',
    6: 'High frequency for experienced trainers'
  }
};

export const RangeInput: React.FC<RangeInputProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  label,
  type = 'meals' // Add type prop to determine if it's for meals or workouts
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;
  const stops = Array.from(
    { length: ((max - min) / step) + 1 },
    (_, i) => min + (i * step)
  );

  const descriptions_ = type === 'meals' ? descriptions.meals : descriptions.workouts;
  
  return (
    <div className="space-y-8">
      {/* Current Value Display */}
      <div className="relative flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "relative w-32 h-32 rounded-full",
            "bg-gradient-to-br from-blue-500 to-purple-500",
            isDragging && "ring-4 ring-blue-500/20"
          )}
        >
          <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-900" />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <motion.span 
              className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
              key={value}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {value}
            </motion.span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {type === 'meals' ? 'meals/day' : 'workouts/week'}
            </span>
          </div>
        </motion.div>

        {/* Floating Icons */}
        <AnimatePresence>
          {type === 'meals' ? (
            [...Array(value)].map((_, i) => (
              <motion.div
                key={`meal-${i}`}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  transition: { delay: i * 0.1 } 
                }}
                exit={{ scale: 0, rotate: 30 }}
                className="absolute -top-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
                style={{
                  left: `${(i * 20) + 40}%`,
                }}
              >
                <Clock className="w-4 h-4 text-blue-500" />
              </motion.div>
            ))
          ) : (
            [...Array(value)].map((_, i) => (
              <motion.div
                key={`workout-${i}`}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  transition: { delay: i * 0.1 } 
                }}
                exit={{ scale: 0, rotate: 30 }}
                className="absolute -top-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
                style={{
                  left: `${(i * 20) + 40}%`,
                }}
              >
                <ActivitySquare className="w-4 h-4 text-purple-500" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Description */}
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-gray-500 dark:text-gray-400"
      >
        {descriptions_[value as keyof typeof descriptions_]}
      </motion.div>

      {/* Range Slider */}
      <div className="relative pt-6 px-3">
        {/* Track */}
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          {/* Filled Track */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{ width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />

          {/* Stop Markers */}
          {stops.map((stop) => {
            const stopPercentage = ((stop - min) / (max - min)) * 100;
            const isActive = stop <= value;
            
            return (
              <motion.div
                key={stop}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
                  "w-4 h-4 rounded-full border-2 border-white dark:border-gray-900",
                  "transition-colors duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500"
                    : "bg-gray-200 dark:bg-gray-700"
                )}
                style={{ left: `${stopPercentage}%` }}
                whileHover={{ scale: 1.2 }}
                onClick={() => onChange(stop)}
              />
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => value > min && onChange(value - step)}
            className={cn(
              "p-3 rounded-xl",
              "bg-gray-100 dark:bg-gray-800",
              "text-gray-500 dark:text-gray-400",
              "hover:bg-gray-200 dark:hover:bg-gray-700",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={value <= min}
          >
            <Minus className="w-5 h-5" />
          </motion.button>

          {/* Value Label */}
          <div className="flex-1 text-center">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {label(value)}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => value < max && onChange(value + step)}
            className={cn(
              "p-3 rounded-xl",
              "bg-gray-100 dark:bg-gray-800",
              "text-gray-500 dark:text-gray-400",
              "hover:bg-gray-200 dark:hover:bg-gray-700",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={value >= max}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Quick Select Chips */}
      <div className="grid grid-cols-4 gap-2">
        {stops.map((stop) => (
          <motion.button
            key={stop}
            onClick={() => onChange(stop)}
            className={cn(
              "py-2 px-4 rounded-lg text-sm font-medium",
              "transition-colors duration-200",
              value === stop
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
              "hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {stop}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import { ExercisePerformanceInputProps } from '@/types/types';
import { motion } from 'framer-motion';
import { Dumbbell, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ExercisePerformanceInput: React.FC<ExercisePerformanceInputProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-6">
      {/* Weight Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Weight (kg)
        </label>
        <motion.input
          type="number"
          value={value?.weight ?? ''}
          onChange={(e) => onChange({ 
            weight: Number(e.target.value), 
            reps: value?.reps ?? 0 
          })}
          className={cn(
            "w-full p-6 text-lg rounded-2xl outline-none transition-all duration-200",
            "border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          )}
          placeholder="Enter weight in kg"
          whileFocus={{ scale: 1.02 }}
        />
        <div className="flex items-center text-sm text-gray-500">
          <Scale className="w-4 h-4 mr-1" />
          <span>Enter the weight used for this exercise</span>
        </div>
      </div>

      {/* Reps Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Repetitions
        </label>
        <motion.input
          type="number"
          value={value?.reps ?? ''}
          onChange={(e) => onChange({
            weight: value?.weight ?? 0,
            reps: Number(e.target.value)
          })}
          className={cn(
            "w-full p-6 text-lg rounded-2xl outline-none transition-all duration-200",
            "border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          )}
          placeholder="Enter number of reps"
          whileFocus={{ scale: 1.02 }}
        />
        <div className="flex items-center text-sm text-gray-500">
          <Dumbbell className="w-4 h-4 mr-1" />
          <span>Enter how many repetitions you completed</span>
        </div>
      </div>

      {/* Summary Card */}
      {value && value.weight > 0 && value.reps > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-blue-600 dark:text-blue-400">Performance Summary</p>
              <p className="font-medium">
                {value.weight}kg × {value.reps} reps
              </p>
            </div>
            <Dumbbell className="w-6 h-6 text-blue-500" />
          </div>
        </motion.div>
      )}
    </div>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Coffee,
  Footprints,
  Activity,
  Rabbit,
  Dumbbell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityLevelSelectProps } from '@/types/types';

const levels = [
  {
    value: 'Sedentary' as const,
    title: 'Sedentary',
    description: 'Little to no exercise',
    details: 'Desk job, minimal movement',
    icon: Coffee,
    color: 'blue',
    gradient: 'from-gray-500 to-slate-500',
    examples: 'Office work',
  },
  {
    value: 'Light' as const,
    title: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
    details: 'Some walking, light activities',
    icon: Footprints,
    color: 'green',
    gradient: 'from-blue-400 to-cyan-400',
    examples: 'Walking',
  },
  {
    value: 'Moderate' as const,
    title: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
    details: 'Regular physical activity',
    icon: Rabbit,
    color: 'orange',
    gradient: 'from-green-500 to-emerald-500',
    examples: 'Jogging',
  },
  {
    value: 'Very Active' as const,
    title: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    details: 'Intense daily workouts',
    icon: Activity,
    color: 'purple',
    gradient: 'from-orange-500 to-amber-500',
    examples: 'Team sports',
  },
  {
    value: 'Extra Active' as const,
    title: 'Extra Active',
    description: 'Very hard exercise & physical job',
    details: 'Athletic or demanding physical work',
    icon: Dumbbell,
    color: 'red',
    gradient: 'from-red-500 to-rose-500',
    examples: 'Professional athlete',
  }
];

export const ActivityLevelSelect: React.FC<ActivityLevelSelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      {levels.map((level) => (
        <motion.button
          key={level.value}
          onClick={() => onChange(level.value)}
          className={cn(
            "w-full p-4 rounded-xl border transition-colors",
            value === level.value 
              ? `bg-${level.color}-50 border-${level.color}-500 dark:bg-${level.color}-900/20`
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start">
            <div className={`w-10 h-10 rounded-lg bg-${level.color}-100 dark:bg-${level.color}-900/30 flex items-center justify-center`}>
              <level.icon className={`w-5 h-5 text-${level.color}-500`} />
            </div>
            
            <div className="ml-4 flex-1 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{level.title}</h3>
                <span className="text-sm text-gray-500">{level.examples}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {level.description}
              </p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
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

const activityLevels = [
  {
    value: 'Sedentary' as const,
    title: 'Sedentary',
    description: 'Little to no exercise',
    details: 'Desk job, minimal movement',
    icon: Coffee,
    gradient: 'from-gray-500 to-slate-500',
    examples: ['Office work', 'Driving', 'Watching TV']
  },
  {
    value: 'Light' as const,
    title: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
    details: 'Some walking, light activities',
    icon: Footprints,
    gradient: 'from-blue-400 to-cyan-400',
    examples: ['Walking', 'Light yoga', 'Easy cycling']
  },
  {
    value: 'Moderate' as const,
    title: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
    details: 'Regular physical activity',
    icon: Rabbit,
    gradient: 'from-green-500 to-emerald-500',
    examples: ['Jogging', 'Dancing', 'Swimming']
  },
  {
    value: 'Very Active' as const,
    title: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    details: 'Intense daily workouts',
    icon: Activity,
    gradient: 'from-orange-500 to-amber-500',
    examples: ['High-intensity training', 'Team sports', 'CrossFit']
  },
  {
    value: 'Extra Active' as const,
    title: 'Extra Active',
    description: 'Very hard exercise & physical job',
    details: 'Athletic or demanding physical work',
    icon: Dumbbell,
    gradient: 'from-red-500 to-rose-500',
    examples: ['Professional athlete', 'Construction work', 'Manual labor']
  }
];

export const ActivityLevelSelect: React.FC<ActivityLevelSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col space-y-4 max-h-[60vh] overflow-y-auto pb-16">
      {activityLevels.map((level) => (
        <motion.button
          key={level.value}
          onClick={() => onChange(level.value)}
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl border transition-all duration-300",
            value === level.value 
              ? `border-transparent ring-2 ring-offset-2 ring-${level.gradient.split('-')[1]}`
              : "border-gray-200 dark:border-gray-700"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background */}
          <motion.div
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-300",
              `bg-gradient-to-r ${level.gradient.replace(/500/g, '500/10')}`
            )}
            animate={{
              opacity: value === level.value ? 1 : 0
            }}
          />

          <div className="relative p-6">
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center",
                `bg-gradient-to-br ${level.gradient}`
              )}>
                <level.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold">{level.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {level.description}
                </p>
              </div>

              {/* Selected Indicator */}
              {value === level.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    `bg-gradient-to-br ${level.gradient}`
                  )}
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </div>

            {/* Expandable Details */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: value === level.value ? 'auto' : 0,
                opacity: value === level.value ? 1 : 0
              }}
              className="overflow-hidden bg-white/50 dark:bg-gray-800/50 rounded-xl mt-4"
            >
              <div className="p-4 space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {level.details}
                </p>
                <div className="flex flex-wrap gap-2">
                  {level.examples.map((example, index) => (
                    <span
                      key={index}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-full",
                        "bg-gray-100 dark:bg-gray-700",
                        "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
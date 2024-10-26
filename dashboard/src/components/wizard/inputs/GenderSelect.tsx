import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Check,
  PersonStanding,
  Triangle,
} from 'lucide-react';
import type { GenderSelectProps } from '@/types/types';

const genderOptions = [
  {
    value: 'Male' as const,
    label: 'Male',
    icon: PersonStanding,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10'
  },
  {
    value: 'Female' as const,
    label: 'Female',
    icon: Triangle,
    gradient: 'from-pink-500 to-purple-500',
    bgGradient: 'from-pink-500/10 to-purple-500/10'
  }
] as const;

export const GenderSelect: React.FC<GenderSelectProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {genderOptions.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative overflow-hidden rounded-2xl p-8 border transition-all duration-300",
            value === option.value 
              ? `border-transparent ring-2 ring-offset-2 ring-${option.gradient.split('-')[1]}`
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Background Effect */}
          <div className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-300",
            `bg-gradient-to-br ${option.bgGradient}`,
            value === option.value && "opacity-100"
          )} />

          {/* Content */}
          <div className="relative space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center",
              `bg-gradient-to-br ${option.gradient}`
            )}>
              <option.icon className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">{option.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                I identify as {option.label.toLowerCase()}
              </p>
            </div>

            {value === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn(
                  "absolute top-4 right-4 w-8 h-8 rounded-full",
                  `bg-gradient-to-br ${option.gradient}`,
                  "flex items-center justify-center"
                )}
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
};
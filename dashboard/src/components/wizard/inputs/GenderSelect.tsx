import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Check,
  PersonStanding,
  User,
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
    <div className="space-y-4">
      {(['Male', 'Female'] as const).map((gender) => (
        <motion.button
          key={gender}
          onClick={() => onChange(gender)}
          className={cn(
            "w-full p-6 relative overflow-hidden rounded-xl border transition-all duration-300",
            value === gender 
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-gray-700"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br from-blue-500 to-purple-500"
            )}>
              {gender === 'Male' ? (
                <PersonStanding className="w-6 h-6 text-white" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <span className="text-lg font-medium">{gender}</span>
            {value === gender && (
              <Check className="w-5 h-5 text-blue-500 ml-auto" />
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
};
// src/components/wizard/inputs/WorkoutLocationSelect.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Home,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
export interface InputProps {
    value: any;
    onChange: (value: any) => void;
  }

export const WorkoutLocationSelect: React.FC<InputProps> = ({ value, onChange }) => {
    const locations = [
      {
        value: 'Home',
        title: 'Home Workout',
        description: 'Train with minimal equipment',
        features: ['Bodyweight exercises', 'Basic equipment', 'Flexible schedule'],
        icon: Home,
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        value: 'Gym',
        title: 'Gym Access',
        description: 'Train at a fully equipped gym',
        features: ['Professional equipment', 'Trainer support', 'Full amenities'],
        icon: Building2,
        gradient: 'from-purple-500 to-blue-500'
      }
    ];
  
    return (
      <div className="space-y-4">
        {locations.map((location) => (
          <motion.button
            key={location.value}
            onClick={() => onChange(location.value)}
            className={cn(
              "relative w-full overflow-hidden rounded-2xl border transition-all duration-300",
              value === location.value 
                ? `border-transparent ring-2 ring-offset-2 ring-${location.gradient.split('-')[1]}`
                : "border-gray-200 dark:border-gray-700"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background */}
            <motion.div
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300",
                `bg-gradient-to-br ${location.gradient.replace('500', '500/10')}`
              )}
              animate={{
                opacity: value === location.value ? 1 : 0
              }}
            />
  
            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center",
                  `bg-gradient-to-br ${location.gradient}`
                )}>
                  <location.icon className="w-8 h-8 text-white" />
                </div>
  
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-semibold">{location.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {location.description}
                  </p>
  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {location.features.map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <Check className="w-4 h-4" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
  
                {value === location.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full",
                      `bg-gradient-to-br ${location.gradient}`,
                      "flex items-center justify-center"
                    )}
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    );
  };
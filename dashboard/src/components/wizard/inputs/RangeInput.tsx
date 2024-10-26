import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { RangeInputProps } from '@/types/types';

export const RangeInput: React.FC<RangeInputProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  label,
  icon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const currentValue = value ?? min;

  const calculateNewValue = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = percentage * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(Math.max(min, steppedValue), max);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newValue = calculateNewValue(e.clientX);
    if (newValue !== undefined) onChange(newValue);
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newValue = calculateNewValue(e.clientX);
    if (newValue !== undefined) onChange(newValue);
  };

  return (
    <div className="space-y-10">
      {/* Value Display */}
      <motion.div 
        className="text-center"
        animate={{ 
          scale: isDragging ? 1.1 : 1,
          y: isDragging ? -10 : 0
        }}
      >
        <div className="relative inline-block">
          <motion.div
            className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: isDragging ? ["0% 0%", "100% 100%"] : "0% 0%"
            }}
            transition={{
              duration: 2,
              repeat: isDragging ? Infinity : 0
            }}
          >
            {currentValue}
          </motion.div>
          {icon && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {label(currentValue)}
        </p>
      </motion.div>

      {/* Range Slider */}
      <div className="relative py-4 px-2" ref={trackRef}>
        {/* Background Track */}
        <div 
          className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
          onClick={handleTrackClick}
          onMouseMove={handleDrag}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          {/* Filled Track */}
          <motion.div
            className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            animate={{
              width: `${((currentValue - min) / (max - min)) * 100}%`
            }}
            transition={{ type: "spring", bounce: 0.2 }}
          />
        </div>

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -mt-2.5 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-blue-500 cursor-grab active:cursor-grabbing"
          style={{
            left: `${((currentValue - min) / (max - min)) * 100}%`,
            x: '-50%',
            y: '-50%'
          }}
          animate={{
            scale: isDragging ? 1.2 : 1,
            boxShadow: isDragging 
              ? "0 0 0 8px rgba(59, 130, 246, 0.2)" 
              : "0 0 0 0px rgba(59, 130, 246, 0)"
          }}
          whileHover={{ scale: 1.1 }}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        />

        {/* Step Markers */}
        <div className="absolute w-full flex justify-between px-4 mt-6">
          {Array.from({ length: ((max - min) / step) + 1 }).map((_, idx) => {
            const markerValue = min + (idx * step);
            const isActive = currentValue >= markerValue;
            return (
              <motion.button
                key={idx}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => onChange(markerValue)}
                animate={{
                  scale: markerValue === currentValue ? 1.2 : 1,
                  opacity: isActive ? 1 : 0.5
                }}
              >
                <div className={cn(
                  "w-1 h-2 rounded-full",
                  isActive ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                )} />
                <span className="text-xs text-gray-500 mt-1">
                  {markerValue}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
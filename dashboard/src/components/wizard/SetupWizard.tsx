// src/components/wizard/SetupWizard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getAllSteps, getStepsForMode } from './steps';
import type { Step, WizardMode, FormFields } from '@/types/types';
import type { Client } from '@/types/api';

interface SetupWizardProps {
  mode: WizardMode;
  exercise?: string;
  onClose?: () => void;
}

// Create a wrapper component
const SetupWizardWrapper: React.FC<SetupWizardProps> = (props) => {
  const client = useAuthStore(state => state.client);
  const refreshData = useAuthStore(state => state.refreshData);

  if (!client) return null;

  return <SetupWizardContent {...props} client={client} refreshData={refreshData} />;
};

// Background Elements Component
const BackgroundElements = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    <motion.div
      className="absolute top-0 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
      animate={{
        x: [0, 120, 0],
        y: [0, 100, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
    <motion.div
      className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
      animate={{
        x: [60, -60, 60],
        y: [0, -100, 0],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
    <motion.div
      className="absolute top-60 -right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
      animate={{
        x: [0, -100, 0],
        y: [0, 120, 0],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  </div>
);

// Step Transition Component
const StepTransition: React.FC<{
  children: React.ReactNode;
  direction: number;
}> = ({ children, direction }) => (
  <AnimatePresence mode="wait" initial={false}>
    <motion.div
      key={`step-${direction}`}
      custom={direction}
      initial={{ x: direction > 0 ? 200 : -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction < 0 ? 200 : -200, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

interface SetupWizardContentProps extends SetupWizardProps {
  client: Client;
  refreshData: () => Promise<void>;
}
const SetupWizardContent: React.FC<SetupWizardContentProps> = ({
  mode,
  exercise,
  onClose,
  client,
  refreshData
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormFields>({});
  const [steps, setSteps] = useState<Step[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showExitAnimation, setShowExitAnimation] = useState(false);

  // In SetupWizardContent component
useEffect(() => {
  const availableSteps = getStepsForMode(mode, exercise, client);
  setSteps(availableSteps);
}, [mode, exercise, client]);

  const validateStep = (step: Step): boolean => {
    const value = formData[step.field];
    
    if (!value || (typeof value === 'string' && !value.trim())) {
      setValidationErrors(prev => ({
        ...prev,
        [step.field]: 'This field is required'
      }));
      return false;
    }

    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[step.field];
      return newErrors;
    });

    return true;
  };

  const handleNext = async () => {
    if (!validateStep(steps[currentStep])) {
      toast.error("Please complete this step before continuing");
      return;
    }

    if (currentStep === steps.length - 1) {
      setIsSubmitting(true);
      try {
        await submitChanges();
        await refreshData();
        setShowExitAnimation(true);
        toast.success("Profile updated successfully!");
        
        if (onClose) {
          await new Promise(resolve => setTimeout(resolve, 800));
          onClose();
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to update profile");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
  };

  const formatDateForSubmission = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  const submitChanges = async () => {
    if (!client?.name) return;
  
    const params = new URLSearchParams();
    params.append('client_id', client.name);
  
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined) {
        // Format date if it's the date_of_birth field
        if (key === 'date_of_birth') {
          params.append(key, formatDateForSubmission(value as string));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`/api/v2/method/ptrainer.ptrainer_methods.update_client?${params.toString()}&request_weight=0`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update client');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: showExitAnimation ? 0 : 1,
        scale: showExitAnimation ? 0.95 : 1 
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-white dark:bg-gray-900 z-50"
    >
      <BackgroundElements />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Steps Indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.field}
              className={cn(
                "w-2 h-2 rounded-full",
                index === currentStep 
                  ? "bg-blue-500" 
                  : index < currentStep 
                    ? "bg-gray-300 dark:bg-gray-700" 
                    : "bg-gray-200 dark:bg-gray-800"
              )}
              animate={{
                scale: index === currentStep ? 1.5 : 1
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="h-full flex flex-col pt-20">
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <StepTransition direction={direction}>
              {steps[currentStep] && (
                <div className="space-y-8">
                  {/* Step Header */}
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      {React.createElement(steps[currentStep].icon, {
                        className: "w-8 h-8 text-blue-500"
                      })}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      {steps[currentStep].description}
                    </p>
                  </motion.div>

                  {/* Step Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {React.createElement(steps[currentStep].component, {
                      value: formData[steps[currentStep].field],
                      onChange: (value: any) => {
                        setFormData(prev => ({
                          ...prev,
                          [steps[currentStep].field]: value
                        }));
                        validateStep(steps[currentStep]);
                      }
                    })}

                    {/* Validation Error */}
                    {validationErrors[steps[currentStep].field] && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-500"
                      >
                        {validationErrors[steps[currentStep].field]}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
              )}
            </StepTransition>
          </div>
        </main>

        {/* Navigation */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <motion.button
              onClick={handleBack}
              className={cn(
                "p-4 rounded-xl flex items-center space-x-2 text-gray-500",
                currentStep === 0 
                  ? "opacity-0 pointer-events-none" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={currentStep === 0 || isSubmitting}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </motion.button>

            <motion.button
              onClick={handleNext}
              className={cn(
                "px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500",
                "text-white rounded-xl flex items-center space-x-2",
                "relative overflow-hidden",
                isSubmitting && "cursor-not-allowed"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              {/* Button Background Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                initial={false}
                animate={{
                  x: isSubmitting ? "100%" : "0%"
                }}
                transition={{
                  duration: 1,
                  repeat: isSubmitting ? Infinity : 0,
                  repeatType: "loop"
                }}
              />

              {/* Button Content */}
              <div className="relative flex items-center space-x-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
                    </span>
                    {currentStep === steps.length - 1 ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </>
                )}
              </div>
            </motion.button>
          </div>
        </div>

        {/* Optional close button for dismissible modes */}
        {onClose && mode !== 'onboarding' && (
          <motion.button
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export { SetupWizardWrapper as SetupWizard };
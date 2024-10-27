// src/providers/WizardProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SetupWizard } from '@/components/wizard/SetupWizard';
import type { WizardMode, WizardContextType, ExerciseData } from '@/types/types';
import { useAuthStore } from '@/stores/authStore';

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<WizardMode | null>(null);
  const [exerciseData, setExerciseData] = useState<ExerciseData | null>(null);
  
  const requiresOnboarding = useAuthStore(state => state.requiresOnboarding);
  const requiresWeightUpdate = useAuthStore(state => state.requiresWeightUpdate);
  const setRequiresOnboarding = useAuthStore(state => state.setRequiresOnboarding);
  const setRequiresWeightUpdate = useAuthStore(state => state.setRequiresWeightUpdate);

  useEffect(() => {
    if (requiresOnboarding) {
      openWizard('onboarding');
      setRequiresOnboarding(false);
    } else if (requiresWeightUpdate) {
      openWizard('weight-update');
      setRequiresWeightUpdate(false);
    }
  }, [requiresOnboarding, requiresWeightUpdate]);

  const openWizard = (newMode: WizardMode, newExerciseData?: ExerciseData) => {
    setMode(newMode);
    if (newExerciseData) setExerciseData(newExerciseData);
    setIsOpen(true);
  };

  const closeWizard = () => {
    setIsOpen(false);
    setMode(null);
    setExerciseData(null);
  };

  return (
    <WizardContext.Provider value={{ isOpen, mode, exerciseData, openWizard, closeWizard }}>
      {children}
      {isOpen && mode && (
        <SetupWizard 
          mode={mode} 
          exercise={exerciseData?.name}
          exerciseData={exerciseData || undefined} // Convert null to undefined
          onClose={mode !== 'onboarding' ? closeWizard : undefined}
        />
      )}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
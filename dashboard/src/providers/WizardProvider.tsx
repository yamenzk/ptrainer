import React, { createContext, useContext, useState, useEffect } from 'react';
import { SetupWizard } from '@/components/wizard/SetupWizard';
import type { WizardMode } from '@/types/types';
import { useAuthStore } from '@/stores/authStore';

interface WizardContextType {
  isOpen: boolean;
  mode: WizardMode | null;
  exerciseData: { name: string } | null;
  openWizard: (mode: WizardMode, exerciseData?: { name: string }) => void;
  closeWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<WizardMode | null>(null);
  const [exerciseData, setExerciseData] = useState<{ name: string } | null>(null);
  
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

  const openWizard = (newMode: WizardMode, newExerciseData?: { name: string }) => {
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
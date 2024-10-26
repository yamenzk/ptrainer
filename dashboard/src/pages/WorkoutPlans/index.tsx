// src/pages/WorkoutPlans/index.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Clock,
  Dumbbell,
  Info
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { LoadingScreen } from '@/components/ui/loading';
import { PageHeader } from '@/components/layout/PageHeader';
import { SupersetCard } from '@/components/workout/SupersetCard';
import { WorkoutDetailModal } from '@/components/workout/WorkoutDetailModal';
import type { Exercise, ExerciseReference } from '@/types/api';

interface DayTabProps {
  date: Date;
  isActive: boolean;
  hasWorkout: boolean;
  onClick: () => void;
}

const DayTab: React.FC<DayTabProps> = ({ date, isActive, hasWorkout, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center py-2 px-4 rounded-xl transition-colors ${
      isActive 
        ? 'bg-blue-500 text-white' 
        : hasWorkout 
          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700' 
          : 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500'
    }`}
  >
    <span className="text-xs font-medium">
      {date.toLocaleDateString('en-US', { weekday: 'short' })}
    </span>
    <span className="text-lg font-semibold">
      {date.getDate()}
    </span>
  </button>
);

const ExerciseCard: React.FC<{
  exercise: Exercise;
  exerciseDetails: ExerciseReference;
  onClick: () => void;
}> = ({ exercise, exerciseDetails, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">{exercise.ref}</h3>
            <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
              {exerciseDetails.level}
            </span>
          </div>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Dumbbell className="w-4 h-4 mr-1" />
              {exercise.sets} sets × {exercise.reps} reps
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {exercise.rest}s rest
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-2 text-xs">
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              {exerciseDetails.primary_muscle}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
              {exerciseDetails.equipment}
            </span>
          </div>
        </div>
        <button 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <Info className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

const WorkoutPlans: React.FC = () => {
  const { plans, references } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<{
    exercise: Exercise;
    type: 'regular' | 'superset';
    supersetIndex?: number;
  } | null>(null);

  // Initialize selected plan to active plan or latest plan
  useEffect(() => {
    if (plans.length > 0) {
      const activePlan = plans.find(plan => plan.status === 'Active');
      if (activePlan) {
        setSelectedPlanId(activePlan.plan_name);
        setSelectedDate(new Date(activePlan.start));
      } else {
        const latestPlan = plans.reduce((latest, current) => 
          new Date(current.start) > new Date(latest.start) ? current : latest
        );
        setSelectedPlanId(latestPlan.plan_name);
        setSelectedDate(new Date(latestPlan.start));
      }
    }
  }, [plans]);

  const selectedPlan = useMemo(() => 
    plans.find(plan => plan.plan_name === selectedPlanId),
    [plans, selectedPlanId]
  );

  if (!selectedPlan || !references) return <LoadingScreen />;

  const startDate = new Date(selectedPlan.start);
  const endDate = new Date(selectedPlan.end);
  const dayNumber = Math.floor((selectedDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayKey = `day_${dayNumber + 1}` as keyof typeof selectedPlan.days;
  const selectedDayPlan = selectedPlan.days[dayKey];

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Plan Selector */}
      <PageHeader
        title="Workout Plan"
        selectedPlan={selectedPlan}
        plans={plans}
        onPlanChange={setSelectedPlanId}
      />

      {/* Week Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto py-2 scrollbar-hide">
        {weekDates.map((date) => (
          <DayTab
            key={date.toISOString()}
            date={date}
            isActive={date.toDateString() === selectedDate.toDateString()}
            hasWorkout={true}
            onClick={() => setSelectedDate(date)}
          />
        ))}
      </div>

      {/* Exercises List */}
      {selectedDayPlan ? (
        <div className="space-y-4">
          {selectedDayPlan.exercises.map((exerciseItem, index) => {
            if (exerciseItem.type === 'regular') {
              return (
                <ExerciseCard
                  key={`${exerciseItem.exercise.ref}-${index}`}
                  exercise={exerciseItem.exercise}
                  exerciseDetails={references.exercises[exerciseItem.exercise.ref]}
                  onClick={() => setSelectedExercise({
                    exercise: exerciseItem.exercise,
                    type: 'regular'
                  })}
                />
              );
            } else {
              return (
                <SupersetCard
                  key={index}
                  exercises={exerciseItem.exercises}
                  exerciseDetails={references.exercises}
                  onExerciseClick={(exercise, supersetIndex) => setSelectedExercise({
                    exercise,
                    type: 'superset',
                    supersetIndex: supersetIndex + 1
                  })}
                />
              );
            }
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No workout planned for this day
          </p>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <WorkoutDetailModal
          exercise={selectedExercise.exercise}
          exerciseDetails={references.exercises[selectedExercise.exercise.ref]}
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          type={selectedExercise.type}
          supersetIndex={selectedExercise.supersetIndex}
          performance={references.performance[selectedExercise.exercise.ref] || []} // Add this line
        />
      )}
    </div>
  );
};

export default WorkoutPlans;
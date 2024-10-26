// src/pages/Dashboard/index.tsx
import React, { useMemo } from 'react';
import { 
  Target, 
  Activity,
  Scale,
  Flame,
  Beef,
  Droplet,
  Weight,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { client, plans } = useAuthStore();

  const activePlan = useMemo(() => 
    plans.find(plan => plan.status === 'Active'),
    [plans]
  );

  const weightData = useMemo(() => {
    if (!client?.weight) return [];
    return client.weight.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      weight: entry.weight
    }));
  }, [client?.weight]);

  const weightChange = useMemo(() => {
    if (weightData.length < 2) return { value: 0, isUpward: false };
    const latest = weightData[weightData.length - 1].weight;
    const previous = weightData[weightData.length - 2].weight;
    const change = ((latest - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isUpward: change > 0
    };
  }, [weightData]);

  if (!client || !activePlan) return null;

  const today = new Date();
  const dayOfWeek = today.getDay();
  const currentDayKey = `day_${dayOfWeek}` as keyof typeof activePlan.days;
  const todaysPlan = activePlan.days[currentDayKey];

  const dailyNutrition = todaysPlan?.totals || {
    energy: { value: 0, unit: 'kcal' },
    protein: { value: 0, unit: 'g' },
    carbs: { value: 0, unit: 'g' },
    fat: { value: 0, unit: 'g' }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              Welcome back, {client.client_name.split(' ')[0]}!
            </h1>
            <p className="text-white/80">
              Keep pushing towards your {client.goal.toLowerCase()} goal
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 rounded-xl p-2 backdrop-blur-sm">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5" />
              <span>Current Weight</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {weightData[weightData.length - 1]?.weight || 0} kg
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Target Weight</span>
            </div>
            <p className="text-2xl font-bold mt-2">{client.target_weight} kg</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Weekly Activity</span>
            </div>
            <p className="text-2xl font-bold mt-2">{client.workouts} workouts</p>
          </div>
        </div>
      </div>

      {/* Weight Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Weight Progress</h2>
          <StatCard
            title="Weight Change"
            value={`${weightData[weightData.length - 1]?.weight || 0} kg`}
            icon={Scale}
            trend={weightChange as { value: number; isUpward: boolean }}
            color="blue"
          />
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <p className="font-medium">{payload[0].payload.date}</p>
                      <p className="text-blue-500">{payload[0].value} kg</p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's Goals */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Today's Nutrition Goals</h2>
          <ProgressCard
            title="Calories"
            current={Math.round(dailyNutrition.energy.value)}
            target={parseInt(activePlan.targets.energy)}
            unit="kcal"
            color="bg-gradient-to-r from-orange-500 to-red-500"
          />
          <ProgressCard
            title="Protein"
            current={Math.round(dailyNutrition.protein.value)}
            target={parseInt(activePlan.targets.proteins)}
            unit="g"
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <ProgressCard
            title="Carbs"
            current={Math.round(dailyNutrition.carbs.value)}
            target={parseInt(activePlan.targets.carbs)}
            unit="g"
            color="bg-gradient-to-r from-yellow-500 to-orange-500"
          />
          <ProgressCard
            title="Fats"
            current={Math.round(dailyNutrition.fat.value)}
            target={parseInt(activePlan.targets.fats)}
            unit="g"
            color="bg-gradient-to-r from-green-500 to-emerald-500"
          />
        </div>

        {/* Today's Workout */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Today's Workout</h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            {todaysPlan?.exercises ? (
              <div className="space-y-4">
                {todaysPlan.exercises.map((exerciseItem, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
                  >
                    {exerciseItem.type === 'regular' ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{exerciseItem.exercise.ref}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {exerciseItem.exercise.sets} sets × {exerciseItem.exercise.reps} reps
                          </p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {exerciseItem.exercise.rest}s rest
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-purple-500 font-medium mb-2">Superset</p>
                        <div className="space-y-2">
                          {exerciseItem.exercises.map((exercise, i) => (
                            <div 
                              key={i}
                              className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{exercise.ref}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {exercise.sets} sets × {exercise.reps} reps
                                </p>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {exercise.rest}s rest
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No workout scheduled for today
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
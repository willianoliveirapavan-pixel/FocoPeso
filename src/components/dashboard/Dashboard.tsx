import React from 'react';
import { Camera, Sparkles, Flame, Activity, Zap, Plus, ArrowUpRight } from 'lucide-react';
import { UserProfile, MealLog, MealType } from '../../types';
import { MealSection } from './MealSection';

interface DashboardProps {
  user: UserProfile;
  meals: MealLog[];
  onOpenScan: () => void;
  onOpenManual: (type?: MealType) => void;
  onDeleteMeal: (mealId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  meals,
  onOpenScan,
  onOpenManual,
  onDeleteMeal,
}) => {
  // Compute daily totals
  const totalCalories = meals.reduce((acc, m) => acc + m.totalCalories, 0);
  const totalProtein = Number(meals.reduce((acc, m) => acc + m.totalProtein, 0).toFixed(1));
  const totalCarbs = Number(meals.reduce((acc, m) => acc + m.totalCarbs, 0).toFixed(1));
  const totalFat = Number(meals.reduce((acc, m) => acc + m.totalFat, 0).toFixed(1));

  const remainingCalories = Math.max(0, user.dailyCalorieGoal - totalCalories);
  const calPercent = Math.min(100, Math.round((totalCalories / user.dailyCalorieGoal) * 100));

  const protPercent = Math.min(100, Math.round((totalProtein / user.dailyProteinGoal) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / user.dailyCarbsGoal) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / user.dailyFatGoal) * 100));

  // Categorize meals by type
  const cafeMeals = meals.filter((m) => m.mealType === 'cafe');
  const almocoMeals = meals.filter((m) => m.mealType === 'almoco');
  const jantarMeals = meals.filter((m) => m.mealType === 'jantar');
  const lancheMeals = meals.filter((m) => m.mealType === 'lanche');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pb-20">
      
      {/* Left panel / Progress metrics sidebar (sticky on desktop) */}
      <div className="col-span-1 md:col-span-5 md:sticky md:top-[90px] h-fit space-y-4">
        {/* Hero Calorie & Macro Progress Card */}
        <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-xl space-y-4">
          {/* Glow effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400">Resumo do Dia</span>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                <span>{totalCalories}</span>
                <span className="text-xs font-normal text-slate-400">/ {user.dailyCalorieGoal} kcal</span>
              </h2>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {calPercent}% Atingido
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Restam {remainingCalories} kcal</p>
            </div>
          </div>

          {/* Progress Bar Calorie Ring */}
          <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
              style={{ width: `${calPercent}%` }}
            />
          </div>

          {/* Macronutrients Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {/* Protein */}
            <div className="p-3 rounded-2xl bg-slate-850 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-300">Proteína</span>
                <span className="text-indigo-400 font-extrabold">{totalProtein}g</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${protPercent}%` }}
                />
              </div>
              <p className="text-[9px] text-slate-400 text-right">{user.dailyProteinGoal}g meta</p>
            </div>

            {/* Carbs */}
            <div className="p-3 rounded-2xl bg-slate-850 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-300">Carbos</span>
                <span className="text-amber-400 font-extrabold">{totalCarbs}g</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
              <p className="text-[9px] text-slate-400 text-right">{user.dailyCarbsGoal}g meta</p>
            </div>

            {/* Fat */}
            <div className="p-3 rounded-2xl bg-slate-850 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-300">Gorduras</span>
                <span className="text-rose-400 font-extrabold">{totalFat}g</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
              <p className="text-[9px] text-slate-400 text-right">{user.dailyFatGoal}g meta</p>
            </div>
          </div>
        </div>

        {/* Prominent Scanner Action Banner */}
        <div
          onClick={onOpenScan}
          className="p-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-600/20 border border-emerald-400/30 cursor-pointer flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <span>Escanear Prato com app</span>
                <Sparkles className="w-4 h-4 text-emerald-200" />
              </h3>
              <p className="text-xs text-emerald-100 font-medium">Análise instantânea por foto</p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Right panel / Meal list (scrolls normally on desktop) */}
      <div className="col-span-1 md:col-span-7 space-y-3">
        <MealSection
          mealType="cafe"
          title="Café da Manhã"
          subtitle="Manhã"
          meals={cafeMeals}
          onOpenCameraForType={onOpenScan}
          onOpenManualForType={onOpenManual}
          onDeleteMeal={onDeleteMeal}
        />

        <MealSection
          mealType="almoco"
          title="Almoço"
          subtitle="Tarde"
          meals={almocoMeals}
          onOpenCameraForType={onOpenScan}
          onOpenManualForType={onOpenManual}
          onDeleteMeal={onDeleteMeal}
        />

        <MealSection
          mealType="jantar"
          title="Jantar"
          subtitle="Noite"
          meals={jantarMeals}
          onOpenCameraForType={onOpenScan}
          onOpenManualForType={onOpenManual}
          onDeleteMeal={onDeleteMeal}
        />

        <MealSection
          mealType="lanche"
          title="Lanches & Snacks"
          subtitle="Qualquer Horário"
          meals={lancheMeals}
          onOpenCameraForType={onOpenScan}
          onOpenManualForType={onOpenManual}
          onDeleteMeal={onDeleteMeal}
        />
      </div>
    </div>
  );
};

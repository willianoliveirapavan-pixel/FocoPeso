import React, { useState } from 'react';
import {
  Utensils,
  Clock,
  RefreshCw,
  Droplet,
  Sparkles,
  Bot,
  Plus,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile, MealCategoryPlan } from '../types';
import { generateSuggestedMealPlan, calculateMacros } from '../utils/nutrition';
import { PaywallOverlay } from './PaywallOverlay';
import { getWaterLog, saveWaterLog } from '../utils/storage';

interface MealPlanTabProps {
  user: UserProfile;
  onOpenUpgradeModal: () => void;
  onOpenAiAssistant: () => void;
}

export const MealPlanTab: React.FC<MealPlanTabProps> = ({
  user,
  onOpenUpgradeModal,
  onOpenAiAssistant,
}) => {
  const macros = calculateMacros(user);
  const [mealPlans, setMealPlans] = useState<MealCategoryPlan[]>(
    generateSuggestedMealPlan(macros.targetCalories)
  );

  const [waterLog, setWaterLog] = useState(getWaterLog());

  const handleAddWater = (amountMl: number) => {
    const updated = {
      ...waterLog,
      consumedMl: Math.min(
        5000,
        Math.max(0, waterLog.consumedMl + amountMl)
      ),
    };
    setWaterLog(updated);
    saveWaterLog(updated);
  };

  const waterPct = Math.min(
    100,
    Math.round((waterLog.consumedMl / waterLog.targetMl) * 100)
  );

  const handleRegeneratePlan = () => {
    setMealPlans(generateSuggestedMealPlan(macros.targetCalories));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Sugestão de Cardápio Diário
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Plano alimentar equilibrado e ajustado para alcançar {macros.targetCalories} kcal/dia.
          </p>
        </div>

        {user.plan === 'premium' && (
          <button
            onClick={onOpenAiAssistant}
            id="open-ai-assistant-btn"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <Bot className="w-4 h-4 text-emerald-200" />
            Consultar IA Nutricional (Gemini)
          </button>
        )}
      </div>

      {/* PAYWALL RESTRICTION (Requisito 5: Sugestão de Cardápio bloqueada para Free/Pro) */}
      <PaywallOverlay
        requiredPlan="premium"
        currentPlan={user.plan}
        title="Sugestão de Cardápio Personalizado (Exclusivo Premium)"
        description="O Plano Premium inclui o plano alimentar completo com opções de substituição de refeição, rastreador de hidratação e assistente com IA."
        onUpgradeClick={onOpenUpgradeModal}
      >
        <div className="space-y-8">
          {/* Water Consumption Tracker Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0">
                <Droplet className="w-8 h-8 fill-blue-200" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Rastreador de Hidratação Diária
                </p>
                <h3 className="text-2xl font-extrabold">
                  {waterLog.consumedMl} ml / {waterLog.targetMl} ml
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  {waterPct >= 100
                    ? '🎉 Meta de água atingida hoje!'
                    : `Faltam ${waterLog.targetMl - waterLog.consumedMl} ml para sua meta.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => handleAddWater(250)}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> +250ml (Copo)
              </button>
              <button
                onClick={() => handleAddWater(500)}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> +500ml (Garrafa)
              </button>
            </div>
          </div>

          {/* Meal Plan Categories Grid */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Refeições Recomendadas para o Dia
            </h3>
            <button
              onClick={handleRegeneratePlan}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Recalcular Refeições
            </button>
          </div>

          <div className="space-y-6">
            {mealPlans.map((cat, idx) => (
              <div
                key={cat.category}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-xs hover:border-gray-200 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800 mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-gray-900 dark:text-white text-base">
                        {cat.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Horário ideal: {cat.timeRange}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meal Totals Badge */}
                  <div className="flex items-center gap-2 text-xs font-bold bg-gray-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-slate-700">
                    <span className="text-gray-900 dark:text-white">{cat.totalCalories} kcal</span>
                    <span className="text-gray-300 dark:text-slate-600">•</span>
                    <span className="text-emerald-700 dark:text-emerald-400">{cat.totalProtein}g Prot</span>
                    <span className="text-gray-300 dark:text-slate-600">•</span>
                    <span className="text-blue-700 dark:text-blue-400">{cat.totalCarbs}g Carb</span>
                    <span className="text-gray-300 dark:text-slate-600">•</span>
                    <span className="text-amber-700 dark:text-amber-400">{cat.totalFat}g Gord</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/80 hover:bg-gray-100/70 dark:hover:bg-slate-800 transition-colors gap-2"
                    >
                      <div>
                        <p className="font-bold text-sm text-gray-800 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          Porção recomendada: <strong className="text-gray-700 dark:text-slate-200">{item.portion}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <span className="font-extrabold text-gray-900 dark:text-white">
                          {item.calories} kcal
                        </span>
                        <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                          P: <strong className="text-emerald-700 dark:text-emerald-400">{item.protein}g</strong> | C:{' '}
                          <strong className="text-blue-700 dark:text-blue-400">{item.carbs}g</strong> | G:{' '}
                          <strong className="text-amber-700 dark:text-amber-400">{item.fat}g</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PaywallOverlay>
    </div>
  );
};

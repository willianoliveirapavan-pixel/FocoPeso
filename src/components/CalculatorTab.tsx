import React, { useState } from 'react';
import {
  Calculator,
  Flame,
  TrendingUp,
  Target,
  Sparkles,
  PieChart as PieChartIcon,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { UserProfile, FormulaType, Gender, Goal } from '../types';
import { calculateMacros, calculateTMB, calculateTDEE, ACTIVITY_LEVEL_OPTIONS } from '../utils/nutrition';
import { PaywallOverlay } from './PaywallOverlay';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface CalculatorTabProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onOpenUpgradeModal: () => void;
}

export const CalculatorTab: React.FC<CalculatorTabProps> = ({
  user,
  onUpdateUser,
  onOpenUpgradeModal,
}) => {
  const [calcProfile, setCalcProfile] = useState<UserProfile>(user);

  const macros = calculateMacros(calcProfile);

  // Pie chart data
  const macroData = [
    { name: 'Proteínas', value: macros.proteinGrams * 4, grams: macros.proteinGrams, color: '#10b981' },
    { name: 'Carboidratos', value: macros.carbsGrams * 4, grams: macros.carbsGrams, color: '#3b82f6' },
    { name: 'Gorduras', value: macros.fatsGrams * 9, grams: macros.fatsGrams, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Calculadora de TMB & Macronutrientes
        </h2>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          Ajuste as variáveis abaixo para simular o impacto nas suas calorias e macronutrientes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (Auto-filled from user profile) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Parâmetros de Cálculo
            </span>
            <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              Dados do Perfil
            </span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Fórmula da Taxa Metabólica
              </label>
              <select
                value={calcProfile.formula}
                onChange={(e) =>
                  setCalcProfile({
                    ...calcProfile,
                    formula: e.target.value as FormulaType,
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="mifflin">Mifflin-St Jeor (Padrão ouro moderno)</option>
                <option value="harris">Harris-Benedict (Versão revisada)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Gênero
                </label>
                <select
                  value={calcProfile.gender}
                  onChange={(e) =>
                    setCalcProfile({
                      ...calcProfile,
                      gender: e.target.value as Gender,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Idade (anos)
                </label>
                <input
                  type="number"
                  value={calcProfile.age}
                  onChange={(e) =>
                    setCalcProfile({ ...calcProfile, age: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Peso Corporal (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcProfile.currentWeight}
                  onChange={(e) =>
                    setCalcProfile({
                      ...calcProfile,
                      currentWeight: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={calcProfile.height}
                  onChange={(e) =>
                    setCalcProfile({
                      ...calcProfile,
                      height: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Fator de Atividade
              </label>
              <select
                value={calcProfile.activityLevel}
                onChange={(e) =>
                  setCalcProfile({
                    ...calcProfile,
                    activityLevel: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                {ACTIVITY_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.value}x)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Objetivo
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCalcProfile({ ...calcProfile, goal: 'lose' })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    calcProfile.goal === 'lose'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300'
                  }`}
                >
                  Perder Peso
                </button>
                <button
                  type="button"
                  onClick={() => setCalcProfile({ ...calcProfile, goal: 'maintain' })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    calcProfile.goal === 'maintain'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300'
                  }`}
                >
                  Manter
                </button>
                <button
                  type="button"
                  onClick={() => setCalcProfile({ ...calcProfile, goal: 'gain' })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    calcProfile.goal === 'gain'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300'
                  }`}
                >
                  Ganhar Massa
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* TMB & TDEE Free Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-500 dark:text-orange-400 flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">TMB (Basal)</p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    {macros.tmb} <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">kcal</span>
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">
                Energia mínima gasta em repouso.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Gasto Total (TDEE)</p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    {macros.tdee} <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">kcal</span>
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">
                Calorias totais queimadas por dia.
              </p>
            </div>
          </div>

          {/* Target Calorie Highlights */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Calorias Alvo Recomendadas
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold">
                    {macros.targetCalories}
                  </span>
                  <span className="text-sm font-bold text-emerald-200">kcal / dia</span>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
                  {calcProfile.goal === 'lose'
                    ? 'Déficit (-500 kcal)'
                    : calcProfile.goal === 'gain'
                    ? 'Superávit (+400 kcal)'
                    : 'Manutenção (0 kcal)'}
                </span>
              </div>
            </div>
          </div>

          {/* MACRONUTRIENT PAYWALL PROTECTED SECTION (Exigência Requisito 5) */}
          <PaywallOverlay
            requiredPlan="beta"
            currentPlan={user.plan}
            title="Divisão Detalhada de Macronutrientes"
            description="O Plano Beta libera a quantidade precisa em gramas (g/dia) de Proteínas, Carboidratos e Gorduras com gráfico interativo de distribuição."
            onUpgradeClick={onOpenUpgradeModal}
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Divisão de Macronutrientes em Gramas
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-normal">
                  Pro / Premium Unlocked
                </span>
              </h3>

              {/* Pie chart and metrics grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any, name: any, item: any) => [
                          `${item.payload.grams}g (${val} kcal)`,
                          name,
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  {/* Protein */}
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                        🥩 Proteínas ({macros.proteinPct}%)
                      </span>
                      <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                        {macros.proteinGrams} g / dia
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      ~{(macros.proteinGrams / calcProfile.currentWeight).toFixed(1)}g por kg corporal
                    </p>
                  </div>

                  {/* Carbs */}
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-blue-900 dark:text-blue-200">
                        🍚 Carboidratos ({macros.carbsPct}%)
                      </span>
                      <span className="text-sm font-black text-blue-700 dark:text-blue-300">
                        {macros.carbsGrams} g / dia
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-700 dark:text-blue-400">
                      Principal fonte de energia para treinos e foco
                    </p>
                  </div>

                  {/* Fats */}
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-amber-900 dark:text-amber-200">
                        🥑 Gorduras Boas ({macros.fatsPct}%)
                      </span>
                      <span className="text-sm font-black text-amber-700 dark:text-amber-300">
                        {macros.fatsGrams} g / dia
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400">
                      Regulação hormonal e saúde metabólica
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </PaywallOverlay>
        </div>
      </div>
    </div>
  );
};

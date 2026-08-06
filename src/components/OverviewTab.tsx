import React from 'react';
import {
  Flame,
  Target,
  TrendingUp,
  Activity,
  Award,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Utensils,
  Sparkles,
} from 'lucide-react';
import { UserProfile, TabType } from '../types';
import { calculateTMB, calculateTDEE, calculateBMI, calculateMacros } from '../utils/nutrition';
import confetti from 'canvas-confetti';

interface OverviewTabProps {
  user: UserProfile;
  onSelectTab: (tab: TabType) => void;
  onOpenUpgradeModal: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  user,
  onSelectTab,
  onOpenUpgradeModal,
}) => {
  const macros = calculateMacros(user);
  const bmiInfo = calculateBMI(user.currentWeight, user.height);

  // Goal distance calculation
  const weightDiff = Math.abs(user.currentWeight - user.targetWeight).toFixed(1);
  const isLoss = user.goal === 'lose';
  const isGain = user.goal === 'gain';

  // Progress percentage calculation
  let progressPct = 0;
  if (user.currentWeight === user.targetWeight) {
    progressPct = 100;
  } else if (isLoss) {
    // Assuming starting weight was targetWeight + 10 or current weight
    const totalDiff = Math.max(5, Number(weightDiff) + 5);
    const completed = totalDiff - Number(weightDiff);
    progressPct = Math.min(100, Math.max(10, Math.round((completed / totalDiff) * 100)));
  } else if (isGain) {
    const totalDiff = Math.max(5, Number(weightDiff) + 5);
    const completed = totalDiff - Number(weightDiff);
    progressPct = Math.min(100, Math.max(10, Math.round((completed / totalDiff) * 100)));
  } else {
    progressPct = 100;
  }

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Painel Nutricional Inteligente</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Olá, {user.name}! 👋
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            Seu perfil está configurado para{' '}
            <strong className="text-white underline decoration-emerald-300">
              {user.goal === 'lose'
                ? 'Perda de Gordura'
                : user.goal === 'gain'
                ? 'Ganho de Massa Magra'
                : 'Manutenção de Peso'}
            </strong>
            . Veja seu progresso e métricas diárias abaixo.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => {
                if (user.plan === 'free') {
                  onOpenUpgradeModal();
                } else {
                  onSelectTab('calculator');
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              Ver TMB & Macros
            </button>
            <button
              onClick={() => onSelectTab('profile')}
              className="px-5 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white font-semibold text-xs border border-emerald-500/30 transition-all cursor-pointer"
            >
              Atualizar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Peso & Progresso Meta */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Peso Atual
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {user.currentWeight}
            </span>
            <span className="text-sm text-gray-500 dark:text-slate-400 font-semibold">kg</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
            Meta: <strong className="text-gray-900 dark:text-white">{user.targetWeight} kg</strong>
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            {Number(weightDiff) === 0
              ? '🎉 Meta Atingida!'
              : `Você está a ${weightDiff} kg da sua meta!`}
          </p>
        </div>

        {/* KPI 2: TMB (Metabolismo Basal) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              TMB (Basal)
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-500 dark:text-orange-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {macros.tmb}
            </span>
            <span className="text-sm text-gray-500 dark:text-slate-400 font-semibold">kcal/dia</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Gasto do organismo em repouso absoluto.
          </p>
        </div>

        {/* KPI 3: TDEE (Gasto Total Diário) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Gasto Total (TDEE)
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {macros.tdee}
            </span>
            <span className="text-sm text-gray-500 dark:text-slate-400 font-semibold">kcal/dia</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Considerando seu nível de atividade.
          </p>
        </div>

        {/* KPI 4: IMC Status */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Índice IMC
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {bmiInfo.bmi}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold border ${bmiInfo.color}">
              {bmiInfo.category}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 truncate" title={bmiInfo.advice}>
            {bmiInfo.advice}
          </p>
        </div>
      </div>

      {/* Target Calorie Summary & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Goal Details */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Meta Calórica Diária Recomendada
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Calculada cientificamente para atingir seu objetivo.
              </p>
            </div>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {macros.targetCalories} <span className="text-xs font-bold text-gray-500 dark:text-slate-400">kcal</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700">
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1 font-semibold">Gasto Basal (TMB)</p>
              <p className="text-lg font-bold text-gray-800 dark:text-slate-200">{macros.tmb} kcal</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700">
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1 font-semibold">Ajuste de Meta</p>
              <p className={`text-lg font-bold ${macros.deficitOrSurplus < 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {macros.deficitOrSurplus > 0 ? `+${macros.deficitOrSurplus}` : macros.deficitOrSurplus} kcal
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900">
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-1 font-bold">Consumo Alvo</p>
              <p className="text-lg font-black text-emerald-800 dark:text-emerald-200">{macros.targetCalories} kcal</p>
            </div>
          </div>

        </div>

        {/* Plan & Upgrade Card */}
        <div className="p-6 rounded-3xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Seu Plano Atual
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {user.plan}
              </span>
            </div>

            <h3 className="text-xl font-extrabold mb-2 text-gray-900 dark:text-white">
              {user.plan === 'free'
                ? 'Plano Grátis Limitado'
                : user.plan === 'beta'
                ? 'Plano Beta Ativo'
                : 'Plano Alfa VIP'}
            </h3>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {user.plan === 'free'
                ? 'Você tem acesso ao perfil e cálculo de TMB. Desbloqueie a divisão de macros e gráficos avançados.'
                : user.plan === 'beta'
                ? 'Você possui acesso a macros e histórico. Faça upgrade para o Alfa para sugestão de cardápio e IA.'
                : 'Você tem acesso ilimitado a todos os recursos da plataforma!'}
            </p>
          </div>

          <button
            onClick={onOpenUpgradeModal}
            id="overview-upgrade-btn"
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {user.plan === 'free'
              ? 'Fazer Upgrade para o Beta (R$ 19,90)'
              : user.plan === 'beta'
              ? 'Fazer Upgrade para Alfa'
              : 'Gerenciar Minha Assinatura'}
          </button>
        </div>
      </div>
    </div>
  );
};

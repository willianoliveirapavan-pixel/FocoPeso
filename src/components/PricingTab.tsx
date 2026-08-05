import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Lock,
  Crown,
  Zap,
  ShieldCheck,
  ArrowRight,
  Check,
} from 'lucide-react';
import { UserProfile, PlanType } from '../types';
import confetti from 'canvas-confetti';

interface PricingTabProps {
  user: UserProfile;
  onUpdatePlan: (plan: PlanType) => void;
}

export const PricingTab: React.FC<PricingTabProps> = ({ user, onUpdatePlan }) => {
  const [checkoutModalPlan, setCheckoutModalPlan] = useState<PlanType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmUpgrade = (plan: PlanType) => {
    setIsProcessing(true);
    setTimeout(() => {
      onUpdatePlan(plan);
      setIsProcessing(false);
      setCheckoutModalPlan(null);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Planos & Desbloqueio de Recursos</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Gerenciar Assinatura FocoPeso
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
          Seu plano atual é{' '}
          <strong className="text-emerald-600 dark:text-emerald-400 uppercase font-black">
            [{user.plan}]
          </strong>
          . Faça o upgrade a qualquer momento para liberar métricas avançadas.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
        {/* PLANO GRÁTIS */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border flex flex-col justify-between transition-all ${
            user.plan === 'free'
              ? 'border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
              : 'border-gray-200 dark:border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300">
                Básico
              </span>
              {user.plan === 'free' && (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                  Plano Atual
                </span>
              )}
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
              Plano Grátis
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">
              Acesso ao perfil básico e cálculo de Taxa Metabólica Basal.
            </p>

            <div className="mb-8">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">R$ 0</span>
              <span className="text-gray-500 dark:text-slate-400 text-sm font-medium"> /mês</span>
            </div>

            <ul className="space-y-4 text-sm text-gray-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Cálculo completo de TMB</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Cálculo de TDEE básico</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 dark:text-slate-500">
                <Lock className="w-4 h-4 text-gray-300 dark:text-slate-600 shrink-0" />
                <span className="line-through">Divisão de Macros (g/dia)</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 dark:text-slate-500">
                <Lock className="w-4 h-4 text-gray-300 dark:text-slate-600 shrink-0" />
                <span className="line-through">Sugestão de Cardápio</span>
              </li>
            </ul>
          </div>

          <button
            disabled={user.plan === 'free'}
            onClick={() => handleConfirmUpgrade('free')}
            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              user.plan === 'free'
                ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 cursor-default'
                : 'border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-white'
            }`}
          >
            {user.plan === 'free' ? 'Seu Plano Atual' : 'Mudar para Grátis'}
          </button>
        </div>

        {/* PLANO BETA */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 flex flex-col justify-between transition-all relative ${
            user.plan === 'beta'
              ? 'border-amber-500 shadow-xl ring-2 ring-amber-500/20'
              : 'border-amber-400 dark:border-amber-600 shadow-md'
          }`}
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            Mais Popular (Macros)
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                BETA Performance
              </span>
              {user.plan === 'beta' && (
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2.5 py-1 rounded-full">
                  Plano Atual
                </span>
              )}
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
              Plano Beta
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">
              Divisão exata de macronutrientes, gráficos de progresso e histórico.
            </p>

            <div className="mb-8">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">R$ 19,90</span>
              <span className="text-gray-500 dark:text-slate-400 text-sm font-medium"> /mês</span>
            </div>

            <ul className="space-y-4 text-sm text-gray-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-gray-900 dark:text-white">Tudo do Plano Grátis</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-gray-900 dark:text-white">Gramas exatas de Proteína, Carbs e Gordura</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Gráficos de Evolução de Peso</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 dark:text-slate-500">
                <Lock className="w-4 h-4 text-gray-300 dark:text-slate-600 shrink-0" />
                <span className="line-through">Sugestão de Cardápio Diário</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setCheckoutModalPlan('beta')}
            disabled={user.plan === 'beta'}
            className={`w-full py-4 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
              user.plan === 'beta'
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 cursor-default'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {user.plan === 'beta' ? 'Seu Plano Atual' : 'Ativar Plano Beta (R$ 19,90)'}
          </button>
        </div>

        {/* PLANO ALFA */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border flex flex-col justify-between transition-all ${
            user.plan === 'alfa'
              ? 'border-2 border-emerald-600 shadow-xl ring-2 ring-emerald-500/20'
              : 'border-emerald-200 dark:border-emerald-900'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                ALFA VIP
              </span>
              {user.plan === 'alfa' && (
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                  Plano Atual
                </span>
              )}
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
              Plano Alfa
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">
              Sugestão completa de cardápio, assistente com IA e controle de água.
            </p>

            <div className="mb-8">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">R$ 49,90</span>
              <span className="text-gray-500 dark:text-slate-400 text-sm font-medium"> /mês</span>
            </div>

            <ul className="space-y-4 text-sm text-gray-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-gray-900 dark:text-white">Tudo do Plano Beta</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Sugestão de Cardápio Completo</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Assistente Nutricional IA (Gemini)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Rastreador de Hidratação Diária</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setCheckoutModalPlan('alfa')}
            disabled={user.plan === 'alfa'}
            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              user.plan === 'alfa'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
            }`}
          >
            {user.plan === 'alfa' ? 'Seu Plano Atual' : 'Ativar Plano Alfa (R$ 49,90)'}
          </button>
        </div>
      </div>

      {/* Checkout Simulator Modal */}
      {checkoutModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Confirmar Upgrade para {checkoutModalPlan.toUpperCase()}
            </h3>

            <p className="text-sm text-gray-600 dark:text-slate-300">
              Valor:{' '}
              <strong className="text-gray-900 dark:text-white font-bold">
                {checkoutModalPlan === 'beta' ? 'R$ 19,90/mês' : 'R$ 49,90/mês'}
              </strong>
              . Ativação imediata para testes do MVP.
            </p>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 text-xs text-gray-600 dark:text-slate-300 space-y-2 text-left border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Acesso instantâneo a todos os recursos do plano</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Desbloqueio imediato do desfoque no dashboard</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCheckoutModalPlan(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleConfirmUpgrade(checkoutModalPlan)}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? 'Processando...' : 'Confirmar & Desbloquear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Planos & Desbloqueio de Recursos</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Gerenciar Assinatura FocoPeso
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Seu plano atual é{' '}
          <strong className="text-emerald-600 uppercase font-black">
            [{user.plan}]
          </strong>
          . Faça o upgrade a qualquer momento para liberar métricas avançadas.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
        {/* PLANO GRÁTIS */}
        <div
          className={`bg-white rounded-3xl p-8 border flex flex-col justify-between transition-all ${
            user.plan === 'free'
              ? 'border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
              : 'border-gray-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                Básico
              </span>
              {user.plan === 'free' && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Plano Atual
                </span>
              )}
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
              Plano Grátis
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Acesso ao perfil básico e cálculo de Taxa Metabólica Basal.
            </p>

            <div className="mb-8">
              <span className="text-4xl font-extrabold text-gray-900">R$ 0</span>
              <span className="text-gray-500 text-sm font-medium"> /mês</span>
            </div>

            <ul className="space-y-4 text-sm text-gray-600 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Cálculo completo de TMB</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Cálculo de TDEE básico</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Lock className="w-4 h-4 text-gray-300 shrink-0" />
                <span className="line-through">Divisão de Macros (g/dia)</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Lock className="w-4 h-4 text-gray-300 shrink-0" />
                <span className="line-through">Sugestão de Cardápio</span>
              </li>
            </ul>
          </div>

          <button
            disabled={user.plan === 'free'}
            onClick={() => handleConfirmUpgrade('free')}
            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              user.plan === 'free'
                ? 'bg-gray-100 text-gray-400 cursor-default'
                : 'border border-gray-300 hover:bg-gray-50 text-gray-800'
            }`}
          >
            {user.plan === 'free' ? 'Seu Plano Atual' : 'Mudar para Grátis'}
          </button>
        </div>

        {/* PLANO PRO */}
        <div
          className={`bg-white rounded-3xl p-8 border-2 flex flex-col justify-between transition-all relative ${
            user.plan === 'pro'
              ? 'border-amber-500 shadow-xl ring-2 ring-amber-500/20'
              : 'border-amber-400 shadow-md'
          }`}
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            Mais Popular (Macros)
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                PRO Performance
              </span>
              {user.plan === 'pro' && (
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                  Plano Atual
                </span>
              )}
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
              Plano Pro
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Divisão exata de macronutrientes, gráficos de progresso e histórico.
            </p>

            <div className="mb-8">
              <span className="text-4xl font-extrabold text-gray-900">R$ 19,90</span>
              <span className="text-gray-500 text-sm font-medium"> /mês</span>
            </div>

            <ul className="space-y-4 text-sm text-gray-600 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-gray-900">Tudo do Plano Grátis</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-gray-900">Gramas exatas de Proteína, Carbs e Gordura</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Gráficos de Evolução de Peso</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Lock className="w-4 h-4 text-gray-300 shrink-0" />
                <span className="line-through">Sugestão de Cardápio Diário</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setCheckoutModalPlan('pro')}
            disabled={user.plan === 'pro'}
            className={`w-full py-4 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
              user.plan === 'pro'
                ? 'bg-amber-100 text-amber-800 cursor-default'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {user.plan === 'pro' ? 'Seu Plano Atual' : 'Ativar Plano Pro (R$ 19,90)'}
          </button>
        </div>

        {/* PLANO PREMIUM */}
        <div
          className={`bg-white rounded-3xl p-8 border flex flex-col justify-between transition-all ${
            user.plan === 'premium'
              ? 'border-2 border-emerald-600 shadow-xl ring-2 ring-emerald-500/20'
              : 'border-emerald-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                PREMIUM VIP
              </span>
              {user.plan === 'premium' && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Plano Atual
                </span>
              )}
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
              Plano Premium
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Sugestão completa de cardápio, assistente com IA e controle de água.
            </p>

            <div className="mb-8">
              <span className="text-4xl font-extrabold text-gray-900">R$ 49,90</span>
              <span className="text-gray-500 text-sm font-medium"> /mês</span>
            </div>

            <ul className="space-y-4 text-sm text-gray-600 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-gray-900">Tudo do Plano Pro</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-emerald-700">Sugestão de Cardápio Completo</span>
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
            onClick={() => setCheckoutModalPlan('premium')}
            disabled={user.plan === 'premium'}
            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              user.plan === 'premium'
                ? 'bg-emerald-100 text-emerald-800 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
            }`}
          >
            {user.plan === 'premium' ? 'Seu Plano Atual' : 'Ativar Plano Premium (R$ 49,90)'}
          </button>
        </div>
      </div>

      {/* Checkout Simulator Modal */}
      {checkoutModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900">
              Confirmar Upgrade para {checkoutModalPlan.toUpperCase()}
            </h3>

            <p className="text-sm text-gray-600">
              Valor:{' '}
              <strong className="text-gray-900 font-bold">
                {checkoutModalPlan === 'pro' ? 'R$ 19,90/mês' : 'R$ 49,90/mês'}
              </strong>
              . Ativação imediata para testes do MVP.
            </p>

            <div className="p-4 rounded-2xl bg-gray-50 text-xs text-gray-600 space-y-2 text-left border border-gray-100">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Acesso instantâneo a todos os recursos do plano</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Desbloqueio imediato do desfoque no dashboard</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCheckoutModalPlan(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleConfirmUpgrade(checkoutModalPlan)}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
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

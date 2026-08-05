import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  Crown,
  ShieldCheck,
  Zap,
  Check,
} from 'lucide-react';
import { UserProfile, PlanType } from '../types';
import confetti from 'canvas-confetti';

interface PlansModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
  onUpdatePlan: (plan: PlanType) => void;
}

export const PlansModal: React.FC<PlansModalProps> = ({
  isOpen,
  user,
  onClose,
  onUpdatePlan,
}) => {
  const [checkoutPlan, setCheckoutPlan] = useState<PlanType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirmUpgrade = (plan: PlanType) => {
    setIsProcessing(true);
    setTimeout(() => {
      onUpdatePlan(plan);
      setIsProcessing(false);
      setCheckoutPlan(null);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-slate-800 relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-plans-modal-btn"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 pr-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Desbloqueio de Recursos Exclusivos</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Escolha o Plano Ideal para Você
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-2">
            Seu plano atual é{' '}
            <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">
              [{user.plan}]
            </span>
            . Atualize para liberar gráficos de macros, sugestão de cardápio e assistente IA.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* PLANO GRÁTIS */}
          <div
            className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${
              user.plan === 'free'
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300">
                  Básico
                </span>
                {user.plan === 'free' && (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    Ativo
                  </span>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">
                Plano Grátis
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
                Perfil básico e cálculo de TMB.
              </p>

              <div className="mb-6">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">R$ 0</span>
                <span className="text-gray-500 dark:text-slate-400 text-xs font-medium"> /mês</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Cálculo completo de TMB</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Gasto diário estimado (TDEE)</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400 dark:text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 shrink-0" />
                  <span className="line-through">Divisão exata de Macros</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400 dark:text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 shrink-0" />
                  <span className="line-through">Sugestão de Cardápio</span>
                </li>
              </ul>
            </div>

            <button
              disabled={user.plan === 'free'}
              onClick={() => handleConfirmUpgrade('free')}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            className={`rounded-3xl p-6 border-2 flex flex-col justify-between transition-all relative ${
              user.plan === 'beta'
                ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-500 ring-2 ring-amber-500/20 shadow-lg'
                : 'bg-white dark:bg-slate-900 border-amber-400 dark:border-amber-600 shadow-sm'
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm whitespace-nowrap">
              Populares (Macros)
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  BETA
                </span>
                {user.plan === 'beta' && (
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                    Ativo
                  </span>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">
                Plano Beta
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
                Macros detalhados em gramas e gráficos.
              </p>

              <div className="mb-6">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">R$ 19,90</span>
                <span className="text-gray-500 dark:text-slate-400 text-xs font-medium"> /mês</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-white">Tudo do Plano Grátis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-white">Gramas de Proteína, Carbs e Gordura</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Gráficos de Proporção Interativa</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400 dark:text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 shrink-0" />
                  <span className="line-through">Sugestão de Cardápio</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setCheckoutPlan('beta')}
              disabled={user.plan === 'beta'}
              className={`w-full py-3 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer ${
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
            className={`rounded-3xl p-6 border-2 flex flex-col justify-between transition-all ${
              user.plan === 'alfa'
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-600 ring-2 ring-emerald-500/20 shadow-lg'
                : 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  ALFA VIP
                </span>
                {user.plan === 'alfa' && (
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    Ativo
                  </span>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">
                Plano Alfa
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
                Cardápio completo, IA Nutricional e Hidratação.
              </p>

              <div className="mb-6">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white">R$ 49,90</span>
                <span className="text-gray-500 dark:text-slate-400 text-xs font-medium"> /mês</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-white">Tudo do Plano Beta</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Sugestão de Cardápio Completo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Assistente IA Nutricional (Gemini)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Rastreador de Água Diário</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setCheckoutPlan('alfa')}
              disabled={user.plan === 'alfa'}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                user.plan === 'alfa'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
              }`}
            >
              {user.plan === 'alfa' ? 'Seu Plano Atual' : 'Ativar Alfa (R$ 49,90)'}
            </button>
          </div>
        </div>

        {/* Confirmation Sub-Modal */}
        {checkoutPlan && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <h4 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Confirmar Upgrade para {checkoutPlan.toUpperCase()}
              </h4>

              <p className="text-xs text-gray-600 dark:text-slate-300">
                Valor do plano:{' '}
                <strong className="text-gray-900 dark:text-white font-bold">
                  {checkoutPlan === 'beta' ? 'R$ 19,90/mês' : 'R$ 49,90/mês'}
                </strong>
                . Desbloqueio e liberação imediata de recursos.
              </p>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 text-[11px] text-gray-600 dark:text-slate-300 space-y-1.5 text-left border border-gray-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Liberação imediata no seu painel</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Sem carência, cancele quando quiser</span>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setCheckoutPlan(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleConfirmUpgrade(checkoutPlan)}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isProcessing ? 'Ativando...' : 'Confirmar & Ativar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


import React from 'react';
import { Lock, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { PlanType } from '../types';

interface PaywallOverlayProps {
  requiredPlan: 'beta' | 'alfa';
  currentPlan: PlanType;
  title?: string;
  description?: string;
  onUpgradeClick: () => void;
  children: React.ReactNode;
}

export const PaywallOverlay: React.FC<PaywallOverlayProps> = ({
  requiredPlan,
  currentPlan,
  title = 'Recurso Exclusivo',
  description = 'Faça o upgrade para desbloquear gráficos avançados de macronutrientes e sugestões completas de cardápio.',
  onUpgradeClick,
  children,
}) => {
  const isLocked =
    requiredPlan === 'beta'
      ? currentPlan === 'free'
      : currentPlan !== 'alfa';

  if (!isLocked) {
    return <>{children}</>;
  }

  const planBadgeText = requiredPlan === 'beta' ? 'Plano Beta' : 'Plano Alfa';
  const badgeColor =
    requiredPlan === 'beta'
      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800">
      {/* Blurred background preview */}
      <div className="filter blur-md opacity-40 select-none pointer-events-none transition-all duration-300">
        {children}
      </div>

      {/* Lock Overlay Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white/70 via-white/85 to-white/95 dark:from-slate-900/80 dark:via-slate-900/90 dark:to-slate-900/95 backdrop-blur-[6px] text-center">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 transform transition-transform group-hover:scale-105 duration-300">
          <Lock className="w-8 h-8" />
        </div>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full text-xs font-semibold border shadow-xs ${badgeColor}`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          Requer {planBadgeText}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 max-w-md">
          {title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-slate-300 max-w-md mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            onClick={onUpgradeClick}
            id="paywall-upgrade-btn"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            Desbloquear {planBadgeText} agora
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-400 dark:text-slate-400 mt-4">
          A partir de apenas R$ 19,90/mês. Cancele quando quiser.
        </p>
      </div>
    </div>
  );
};

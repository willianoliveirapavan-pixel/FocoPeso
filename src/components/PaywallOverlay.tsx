import React from 'react';
import { Lock, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { PlanType } from '../types';

interface PaywallOverlayProps {
  requiredPlan: 'pro' | 'premium';
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
    requiredPlan === 'pro'
      ? currentPlan === 'free'
      : currentPlan !== 'premium';

  if (!isLocked) {
    return <>{children}</>;
  }

  const planBadgeText = requiredPlan === 'pro' ? 'Plano Pro' : 'Plano Premium';
  const badgeColor =
    requiredPlan === 'pro'
      ? 'bg-amber-100 text-amber-800 border-amber-300'
      : 'bg-emerald-100 text-emerald-800 border-emerald-300';

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-gray-100">
      {/* Blurred background preview */}
      <div className="filter blur-md opacity-40 select-none pointer-events-none transition-all duration-300">
        {children}
      </div>

      {/* Lock Overlay Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white/70 via-white/85 to-white/95 backdrop-blur-[6px] text-center">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 transform transition-transform group-hover:scale-105 duration-300">
          <Lock className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full text-xs font-semibold border shadow-xs ${badgeColor}">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Requer {planBadgeText}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 max-w-md">
          {title}
        </h3>

        <p className="text-sm text-gray-600 max-w-md mb-6 leading-relaxed">
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

        <p className="text-xs text-gray-400 mt-4">
          A partir de apenas R$ 19,90/mês. Cancele quando quiser.
        </p>
      </div>
    </div>
  );
};

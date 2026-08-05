import React from 'react';
import {
  LayoutDashboard,
  User,
  Calculator,
  UtensilsCrossed,
  BookOpen,
  Sparkles,
  Lock,
  Crown,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { TabType, PlanType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userPlan: PlanType;
  onOpenUpgradeModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  userPlan,
  onOpenUpgradeModal,
}) => {
  const isFree = userPlan === 'free';
  const isPro = userPlan === 'pro';

  const menuItems: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    locked?: boolean;
    lockMsg?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'profile',
      label: 'Meu Perfil & Metas',
      icon: <User className="w-5 h-5" />,
    },
    {
      id: 'calculator',
      label: 'Calculadora TMB & Macros',
      icon: <Calculator className="w-5 h-5" />,
      locked: isFree,
      lockMsg: 'Macros bloqueados no Free',
    },
    {
      id: 'mealplan',
      label: 'Sugestão de Cardápio',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      locked: isFree || isPro,
      lockMsg: isFree ? 'Requer Pro / Premium' : 'Exclusivo Premium',
    },
    {
      id: 'diary',
      label: 'Diário Alimentar',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'pricing',
      label: 'Planos & Upgrade',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      badge: isFree ? 'Upgrade!' : 'Detalhes',
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-3">
            Menu Principal
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-2xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        isActive ? 'text-emerald-600' : 'text-gray-400'
                      }
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.locked ? (
                    <span
                      className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"
                      title={item.lockMsg}
                    >
                      <Lock className="w-3 h-3 text-amber-600" />
                      {userPlan === 'free' ? 'Lock' : 'VIP'}
                    </span>
                  ) : item.badge ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Upgrade Callout Box for Free/Pro users */}
        {isFree && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-xs text-amber-900 uppercase tracking-wide">
                Desbloqueie o Pro
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed mb-3">
              Tenha acesso imediato à divisão exata de macronutrientes, gráficos
              e metabetismo ideal por R$ 19,90/mês.
            </p>
            <button
              onClick={onOpenUpgradeModal}
              id="sidebar-upgrade-cta"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              Fazer Upgrade Agora
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {isPro && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-xs text-emerald-900 uppercase tracking-wide">
                Vire Premium
              </span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed mb-3">
              Desbloqueie sugestão de cardápio completo, assistente com IA e
              controle de hidratação.
            </p>
            <button
              onClick={onOpenUpgradeModal}
              id="sidebar-upgrade-premium-cta"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              Ver Recursos Premium
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer support note */}
      <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400">
        <p className="font-semibold text-gray-500 mb-1">NutriCalc Pro v2.4</p>
        <p>Desenvolvido com padrão SaaS científico para PT-BR.</p>
      </div>
    </aside>
  );
};

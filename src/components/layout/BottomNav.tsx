import React from 'react';
import { LayoutDashboard, Camera, PieChart, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'dashboard' | 'history' | 'profile';
  onTabChange: (tab: 'dashboard' | 'history' | 'profile') => void;
  onOpenScan: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenScan,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-400 py-2 px-4 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* Dashboard Tab */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-400' : 'hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Diário</span>
        </button>

        {/* Central Prominent Camera Button */}
        <div className="relative -top-5">
          <button
            onClick={onOpenScan}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 ring-4 ring-slate-900 active:scale-95 transition-all cursor-pointer"
            title="Escanear Prato com app"
          >
            <Camera className="w-7 h-7 text-white" />
          </button>
        </div>

        {/* History Tab */}
        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${
            activeTab === 'history' ? 'text-emerald-400' : 'hover:text-slate-200'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span>Histórico</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${
            activeTab === 'profile' ? 'text-emerald-400' : 'hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Perfil</span>
        </button>
      </div>
    </div>
  );
};

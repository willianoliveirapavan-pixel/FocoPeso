import React, { useState } from 'react';
import { Camera, User, Calendar, Sparkles, Sliders, Menu, X, ChevronLeft, ChevronRight, LogOut, ShieldCheck, Key, CreditCard, Info } from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  user: UserProfile;
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (newDate: string) => void;
  onOpenScan: () => void;
  onOpenProfile: () => void;
  onOpenPlatformInfo?: (tab?: 'planos' | 'funcionalidades' | 'ferramentas' | 'privacidade') => void;
  onOpenAdmin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  selectedDate,
  onDateChange,
  onOpenScan,
  onOpenProfile,
  onOpenPlatformInfo,
  onOpenAdmin,
  onLogout,
}) => {
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);

  const isAdmin = user.email.toLowerCase().trim() === 'willianoliveirapavan@gmail.com';

  // Helper for date formatting
  const formatDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const dateObj = new Date(dateStr + 'T00:00:00');
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === today) return 'Hoje';
    if (dateStr === yesterdayStr) return 'Ontem';

    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  return (
    <>
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                FocoPeso <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">App</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Saúde & Dieta</p>
            </div>
          </div>

          {/* Date Selector Pill */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-full px-1.5 py-1 text-xs shrink-0">
            <button
              onClick={handlePrevDay}
              className="p-1 hover:bg-slate-700 rounded-full text-slate-300 transition-colors cursor-pointer"
              title="Dia Anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="px-2 font-semibold text-emerald-400 flex items-center gap-1 min-w-[70px] justify-center">
              <Calendar className="w-3 h-3 text-emerald-400" />
              <span>{formatDateLabel(selectedDate)}</span>
            </div>
            <button
              onClick={handleNextDay}
              className="p-1 hover:bg-slate-700 rounded-full text-slate-300 transition-colors cursor-pointer"
              title="Próximo Dia"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Desktop Navigation Row (Visible only on md and up) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenScan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Escanear Prato</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700/80 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Perfil e Metas</span>
            </button>

            <button
              onClick={() => onOpenPlatformInfo?.('planos')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700/80 transition-all cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Planos</span>
            </button>

            <button
              onClick={() => onOpenPlatformInfo?.('funcionalidades')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700/80 transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>Módulos</span>
            </button>

            {isAdmin && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 font-black text-xs border border-emerald-500/40 transition-all cursor-pointer shadow-sm"
              >
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin</span>
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 hover:text-rose-200 border border-rose-900/40 transition-all cursor-pointer"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Off-Canvas Menu Toggle */}
          <button
            onClick={() => setIsOffCanvasOpen(true)}
            className="md:hidden p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Off-Canvas Mobile Drawer Overlay */}
      {isOffCanvasOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOffCanvasOpen(false)}
          />

          <div className="relative w-80 max-w-[85vw] bg-slate-900 border-l border-slate-800 text-slate-100 p-5 flex flex-col justify-between z-10 shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-white truncate max-w-[130px]">{user.name}</h3>
                      {isAdmin && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOffCanvasOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Options */}
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setIsOffCanvasOpen(false);
                    onOpenScan();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Escanear Prato com app</span>
                </button>

                <button
                  onClick={() => {
                    setIsOffCanvasOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium text-xs border border-slate-700/80 transition-all cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Metas & Perfil Nutricional</span>
                </button>

                <button
                  onClick={() => {
                    setIsOffCanvasOpen(false);
                    onOpenPlatformInfo?.('planos');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium text-xs border border-slate-700/80 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <div className="flex items-center justify-between w-full">
                    <span>Planos & Assinaturas</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">R$ 19,90</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsOffCanvasOpen(false);
                    onOpenPlatformInfo?.('funcionalidades');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-medium text-xs border border-slate-700/80 transition-all cursor-pointer"
                >
                  <Info className="w-4 h-4 text-emerald-400" />
                  <span>Módulos & Privacidade</span>
                </button>

                {/* Exclusive Admin Menu Item (Strictly for willianoliveirapavan@gmail.com) */}
                {isAdmin && onOpenAdmin && (
                  <button
                    onClick={() => {
                      setIsOffCanvasOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                  >
                    <Key className="w-4 h-4 text-emerald-400" />
                    <div className="flex items-center justify-between w-full">
                      <span>Painel Admin</span>
                      <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded-full uppercase">VIP</span>
                    </div>
                  </button>
                )}

                {onLogout && (
                  <button
                    onClick={() => {
                      setIsOffCanvasOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 font-medium text-xs border border-rose-900/40 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sair da Conta</span>
                  </button>
                )}
              </nav>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-200 text-xs">
                  <span>Meta Diária</span>
                  <span className="text-emerald-400 font-bold">{user.dailyCalorieGoal} kcal</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[11px] text-center pt-1 border-t border-slate-700/50">
                  <div>
                    <span className="block font-bold text-slate-100">{user.dailyProteinGoal}g</span>
                    <span className="text-slate-400">Proteína</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-100">{user.dailyCarbsGoal}g</span>
                    <span className="text-slate-400">Carbos</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-100">{user.dailyFatGoal}g</span>
                    <span className="text-slate-400">Gordura</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-500">FocoPeso App v2.0</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


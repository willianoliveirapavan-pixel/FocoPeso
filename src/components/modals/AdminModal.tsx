import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Users,
  Settings,
  Activity,
  Database,
  CheckCircle2,
  DollarSign,
  Zap,
  Save,
  Server,
  Key,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, user }) => {
  const isAdmin = user.email.toLowerCase().trim() === 'willianoliveirapavan@gmail.com';

  const [betaPrice, setBetaPrice] = useState('19,90');
  const [stripeUrl, setStripeUrl] = useState(() => {
    const stored = localStorage.getItem('focopeso_stripe_url') || 'https://buy.stripe.com/28E5kFffq1yP9ZteUc3Ru00';
    if (stored.includes('focopeso_beta_1990')) {
      localStorage.setItem('focopeso_stripe_url', 'https://buy.stripe.com/28E5kFffq1yP9ZteUc3Ru00');
      return 'https://buy.stripe.com/28E5kFffq1yP9ZteUc3Ru00';
    }
    return stored;
  });
  const [aiScannerEnabled, setAiScannerEnabled] = useState(true);
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(true);
  const [reportsModuleEnabled, setReportsModuleEnabled] = useState(true);
  const [showSaveToast, setShowSaveToast] = useState(false);

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Acesso Restrito</h3>
          <p className="text-xs text-slate-400">
            Apenas o e-mail do administrador principal (<strong>willianoliveirapavan@gmail.com</strong>) possui permissão de acesso a este painel.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('focopeso_stripe_url', stripeUrl.trim());
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold shadow-md shadow-emerald-500/10">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-white">Painel de Administração</h2>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black uppercase px-2 py-0.5 rounded-full">
                  Exclusivo
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveSettings} className="p-4 overflow-y-auto space-y-4 text-xs">
          {showSaveToast && (
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold flex items-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Configurações administrativas salvas com sucesso!</span>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center space-y-0.5">
              <Users className="w-4 h-4 text-emerald-400 mx-auto" />
              <span className="block text-base font-black text-white">1</span>
              <span className="text-[10px] text-slate-400">Admin Ativo</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center space-y-0.5">
              <DollarSign className="w-4 h-4 text-emerald-400 mx-auto" />
              <span className="block text-base font-black text-emerald-400">R$ {betaPrice}</span>
              <span className="text-[10px] text-slate-400">Plano Beta /mês</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center space-y-0.5">
              <Server className="w-4 h-4 text-emerald-400 mx-auto" />
              <span className="block text-base font-black text-white">Google DB</span>
              <span className="text-[10px] text-slate-400">Firestore OK</span>
            </div>
          </div>

          {/* Pricing settings */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between font-bold text-white">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Valor Mensal do Plano Beta</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                Promocional
              </span>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-slate-400 font-bold">R$</span>
              <input
                type="text"
                value={betaPrice}
                onChange={(e) => setBetaPrice(e.target.value)}
                className="w-32 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-black text-sm text-center"
              />
              <span className="text-slate-400 text-[11px]">/mês por assinante</span>
            </div>

            <div className="pt-2 border-t border-slate-700/50 space-y-1">
              <label className="block font-bold text-slate-200 text-[11px]">
                Link de Pagamento Stripe (Plano Beta)
              </label>
              <input
                type="text"
                value={stripeUrl}
                onChange={(e) => setStripeUrl(e.target.value)}
                placeholder="https://buy.stripe.com/..."
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          {/* Module controls */}
          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Gerenciamento dos Módulos do App</span>
            </h4>

            <div className="space-y-2">
              <label className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-100 block">Módulo FocoPeso App Engine</span>
                  <span className="text-[10px] text-slate-400">Escaneamento por foto e estimativa de porções</span>
                </div>
                <input
                  type="checkbox"
                  checked={aiScannerEnabled}
                  onChange={(e) => setAiScannerEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>

              <label className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-100 block">Sincronização Cloud Firestore</span>
                  <span className="text-[10px] text-slate-400">Persistência permanente no banco de dados do Google</span>
                </div>
                <input
                  type="checkbox"
                  checked={cloudSyncEnabled}
                  onChange={(e) => setCloudSyncEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>

              <label className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="font-bold text-slate-100 block">Módulo de Relatórios e Metas</span>
                  <span className="text-[10px] text-slate-400">Estatísticas semanais e calculadora TMB</span>
                </div>
                <input
                  type="checkbox"
                  checked={reportsModuleEnabled}
                  onChange={(e) => setReportsModuleEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>
            </div>
          </div>

          {/* Admin info box */}
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-300 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privilégios Administrativos Ativos</span>
            </p>
            <p className="text-slate-300 leading-relaxed">
              O e-mail <strong>willianoliveirapavan@gmail.com</strong> possui privilégio exclusivo de visualização do painel de administração e acesso total ao Plano Beta de R$ 19,90.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

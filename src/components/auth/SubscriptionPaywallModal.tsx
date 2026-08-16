import React, { useState } from 'react';
import {
  Utensils,
  CheckCircle2,
  Lock,
  CreditCard,
  Star,
  ShieldCheck,
  LogOut,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SubscriptionPaywallModalProps {
  user: UserProfile;
  onConfirmPayment: () => Promise<void>;
  onLogout: () => Promise<void>;
}

export const SubscriptionPaywallModal: React.FC<SubscriptionPaywallModalProps> = ({
  user,
  onConfirmPayment,
  onLogout,
}) => {
  const [loading, setLoading] = useState(false);
  const stripeUrl = (() => {
    const stored = localStorage.getItem('focopeso_stripe_url') || (import.meta as any).env?.VITE_STRIPE_BETA_PAYMENT_URL || 'https://buy.stripe.com/28E5kFffq1yP9ZteUc3Ru00';
    if (stored.includes('focopeso_beta_1990')) {
      localStorage.setItem('focopeso_stripe_url', 'https://buy.stripe.com/28E5kFffq1yP9ZteUc3Ru00');
      return 'https://buy.stripe.com/28E5kFffq1yP9ZteUc3Ru00';
    }
    return stored;
  })();

  const handleOpenStripe = () => {
    setLoading(true);
    let finalUrl = stripeUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpenStripe();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header Banner */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">FocoPeso <span className="text-emerald-400">Beta</span></h2>
                <span className="text-[9px] bg-emerald-500 text-slate-950 font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                  Ativação
                </span>
              </div>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sair da conta"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Sair</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Plan Offer Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/60 to-slate-950 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span className="font-extrabold text-white text-sm">Plano Beta Exclusivo</span>
              </div>
              <div className="text-xl font-black text-emerald-400">
                R$ 19,90 <span className="text-xs text-slate-400 font-normal">/mês</span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-[11px]">
              Assine agora via Stripe para desbloquear acesso total e ilimitado às ferramentas de inteligência artificial e diário nutricional do FocoPeso.
            </p>

            <ul className="space-y-2 text-slate-200 text-[11px] pt-1">
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Reconhecimento de refeições por foto por IA sem limites</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cálculo automático de calorias, proteínas, carboidratos e gorduras</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Relatórios de progresso e histórico diário e semanal</span>
              </li>
              <li className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sincronização permanente em nuvem pelo Google Firestore</span>
              </li>
            </ul>
          </div>

          {/* Stripe Payment Method Info & Link Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Pagamento Seguro via Stripe
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/20">
                Oficial Stripe
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              O pagamento do Plano Beta é realizado de forma 100% segura através do checkout oficial da Stripe.
            </p>

            {/* Open Stripe Button */}
            <button
              type="button"
              onClick={handleOpenStripe}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/10 active:scale-98 transition-all cursor-pointer"
            >
              <CreditCard className="w-5 h-5 text-slate-950" />
              <span>Pagar R$ 19,90 no Stripe e Liberar Acesso</span>
              <ExternalLink className="w-4 h-4 text-slate-950" />
            </button>
          </div>

          {/* Automated Activation Info */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2 text-[11px] text-slate-300 leading-relaxed text-center">
            <p>
              Após concluir o pagamento na janela segura do Stripe, você será redirecionado de volta ao FocoPeso e seu acesso será liberado automaticamente.
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              Caso já tenha pago e queira atualizar o status manualmente, você pode atualizar a página.
            </p>
          </div>

          {/* Guarantee Footer */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Processamento 100% seguro pelo Stripe. Cancele quando quiser.</span>
          </div>
        </div>
      </div>
    </div>
  );
};


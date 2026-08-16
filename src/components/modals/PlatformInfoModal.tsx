import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Boxes,
  HelpCircle,
  FileText,
  Star,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface PlatformInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  initialTab?: 'planos' | 'funcionalidades' | 'ferramentas' | 'privacidade';
  onUpgradeToBeta?: () => void;
}

export const PlatformInfoModal: React.FC<PlatformInfoModalProps> = ({
  isOpen,
  onClose,
  user,
  initialTab = 'planos',
  onUpgradeToBeta,
}) => {
  const [activeTab, setActiveTab] = useState<
    'planos' | 'funcionalidades' | 'ferramentas' | 'privacidade'
  >(initialTab);

  if (!isOpen) return null;

  const currentPlan = 'beta';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Central da Plataforma FocoPeso</h2>
              <p className="text-[11px] text-slate-400">Planos, Módulos, Recursos e Privacidade</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 p-1.5 bg-slate-950 border-b border-slate-800 text-[11px] font-semibold">
          <button
            onClick={() => setActiveTab('planos')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'planos'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Planos</span>
          </button>

          <button
            onClick={() => setActiveTab('funcionalidades')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'funcionalidades'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Recursos</span>
          </button>

          <button
            onClick={() => setActiveTab('ferramentas')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'ferramentas'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Módulos</span>
          </button>

          <button
            onClick={() => setActiveTab('privacidade')}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-1 ${
              activeTab === 'privacidade'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacidade</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: Planos e Assinaturas */}
          {activeTab === 'planos' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Planos e Assinaturas
                </span>
                <h3 className="text-base font-extrabold text-white pt-1">
                  Escolha o plano ideal para sua jornada
                </h3>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Acesse escaneamento de refeições por foto no app e relatórios nutricionais avançados.
                </p>
              </div>

              {/* Plan Card - Beta Plan Only */}
              <div className="pt-1">
                <div className="relative p-5 rounded-2xl border-2 border-emerald-500/80 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 flex flex-col justify-between space-y-4 shadow-xl shadow-emerald-500/10">
                  <div className="absolute -top-2.5 right-4 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                    Plano Ativo • Beta
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                      <span className="font-extrabold text-white text-base">Plano Beta FocoPeso</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-400">
                      R$ 19,90 <span className="text-xs text-slate-300 font-medium">/mês</span>
                    </div>
                    <p className="text-xs text-emerald-300/90">Acesso completo e ilimitado ao app FocoPeso</p>

                    <ul className="space-y-2 text-xs text-slate-200 pt-2">
                      <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Reconhecimento de refeições por foto sem limites</li>
                      <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Decomposição automática em gramas e macronutrientes</li>
                      <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Histórico semanal e relatórios de progresso</li>
                      <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Calculadora de Taxa Metabólica Basal (TMB)</li>
                      <li className="flex items-center gap-2 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Suporte Prioritário VIP</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-300 font-bold">
                    ✓ Assinatura Beta Ativa no FocoPeso
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Novas Funcionalidades na Plataforma */}
          {activeTab === 'funcionalidades' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Novas Funcionalidades na Plataforma</span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-400">
                    <span>Reconhecimento Fotográfico FocoPeso</span>
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">v2.0 Novo</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Tire uma foto ou envie uma imagem da sua refeição. Nosso app identifica alimentos, estima porções em gramas e calcula calorias, proteínas, carboidratos e gorduras instantaneamente.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-400">
                    <span>Design Responsivo & Bento Layout</span>
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">v2.1 Ativo</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Interface totalmente adaptável para desktops, tablets e celulares. No computador, a plataforma se desdobra em um moderno grid de duas colunas (com painel de progresso fixo) para aproveitar o espaço máximo. Em smartphones, o menu do topo recolhe-se em um elegante menu 'off-canvas' lateral.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-400">
                    <span>Calculadora Metabólica TMB Mifflin-St Jeor</span>
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">Ativo</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Ajuste automático de metas diárias de calorias com base no seu peso atual, meta, altura e taxa de atividade física.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Ferramentas & Módulos da Plataforma */}
          {activeTab === 'ferramentas' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
                <Boxes className="w-4 h-4 text-emerald-400" />
                <span>Ferramentas & Módulos Ativos</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <span className="font-bold text-white">Módulo FocoPeso App Engine</span>
                      <p className="text-[10px] text-slate-400">Análise nutricional de imagens via Gemini SDK</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Operacional</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <span className="font-bold text-white">Sincronização Firestore DB</span>
                      <p className="text-[10px] text-slate-400">Persistência em tempo real por usuário</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Operacional</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <span className="font-bold text-white">Painel de Relatórios e Histórico</span>
                      <p className="text-[10px] text-slate-400">Gráficos de calorias e macros semanais</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Operacional</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <span className="font-bold text-white">Firebase Security Rules (ABAC)</span>
                      <p className="text-[10px] text-slate-400">Isolamento total dos dados por conta</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Protegido</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Política de Privacidade */}
          {activeTab === 'privacidade' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Política de Privacidade e Proteção de Dados</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 text-[11px] leading-relaxed text-slate-300">
                <p>
                  <strong>1. Proteção de Dados:</strong> Todos os seus logs de refeição, fotos e informações de perfil são armazenados de forma segura e vinculados estritamente ao seu UID de usuário via regras de segurança do Google Cloud Firestore.
                </p>
                <p>
                  <strong>2. Processamento de Imagens:</strong> As fotos enviadas para escaneamento no FocoPeso são processadas exclusivamente para identificação nutricional e cálculo de alimentos, sem compartilhamento com terceiros.
                </p>
                <p>
                  <strong>3. Privacidade & Controle:</strong> Você possui total autonomia para salvar, alterar ou excluir suas refeições e informações de perfil a qualquer momento no seu aplicativo.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">Plano Ativo: <strong className="text-emerald-400 capitalize">{currentPlan}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-white transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

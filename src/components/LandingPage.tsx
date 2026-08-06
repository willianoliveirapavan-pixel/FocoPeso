import React, { useState } from 'react';
import {
  Activity,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Flame,
  Utensils,
  ArrowRight,
  UserCheck,
  Star,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { PlanType } from '../types';
import { calculateTMB, calculateTDEE } from '../utils/nutrition';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register', plan?: PlanType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  // Hero interactive mini-calculator state
  const [heroWeight, setHeroWeight] = useState(80);
  const [heroHeight, setHeroHeight] = useState(175);
  const [heroAge, setHeroAge] = useState(28);
  const [heroGender, setHeroGender] = useState<'masculino' | 'feminino'>('masculino');
  const [heroResult, setHeroResult] = useState<number | null>(null);

  const handleHeroCalc = (e: React.FormEvent) => {
    e.preventDefault();
    const tmb = calculateTMB(heroWeight, heroHeight, heroAge, heroGender);
    setHeroResult(tmb);
  };

  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Como funciona a calculadora de TMB do FocoPeso?',
      a: 'Utilizamos fórmulas cientificamente validadas (Mifflin-St Jeor e Harris-Benedict) que calculam quantas calorias seu corpo queima em repouso absoluto. A partir disso, ajustamos para o seu nível de atividade física e objetivo (perda de gordura, manutenção ou hipertrofia).',
    },
    {
      q: 'Posso testar a plataforma gratuitamente?',
      a: 'Sim! O Plano Grátis permite cadastrar seu perfil e calcular a sua Taxa Metabólica Basal (TMB) sem custo algum. Você pode fazer o upgrade a qualquer momento para liberar a divisão de macronutrientes e sugestões de cardápio.',
    },
    {
      q: 'Qual a diferença entre o Plano Pro e o Premium?',
      a: 'O Plano Pro libera a divisão exata de macronutrientes (proteínas, carboidratos e gorduras em gramas), gráficos de progresso e histórico de peso. O Plano Premium inclui tudo isso mais a sugestão personalizada de cardápio diário, assistente nutricional inteligente e rastreador de hidratação.',
    },
    {
      q: 'Posso cancelar minha assinatura quando quiser?',
      a: 'Com certeza! Não há fidelidade ou letras miúdas. Você cancela seu plano com um clique direto nas configurações do seu perfil.',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-800 dark:text-slate-100 transition-colors">
      {/* HERO SECTION */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background glow decorations */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-300/20 dark:bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Nutrição Baseada em Ciência & Resultados Reais</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.15]">
                Conquiste seu <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-200 dark:decoration-emerald-800 decoration-wavy">corpo ideal</span> com cálculo exato de TMB e Macros.
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Descubra quantas calorias seu corpo queima por dia, receba a divisão perfeita de proteínas, carboidratos e gorduras e acompanhe sua meta sem passar fome.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onOpenAuth('register')}
                  id="hero-cta-register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-5 h-5 text-emerald-200" />
                  Criar Conta Grátis
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => onOpenAuth('login')}
                  id="hero-cta-login"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-100 border border-gray-200 dark:border-slate-700 font-bold text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Fazer Login
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Sem cartão no cadastro
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Fórmula Mifflin-St Jeor
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  100% em Português
                </div>
              </div>
            </div>

            {/* Right Interactive Micro-Calculator Card */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-slate-800 relative">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                      Simulador Rápido de TMB
                    </h3>
                  </div>
                  <span className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                    Teste Grátis
                  </span>
                </div>

                <form onSubmit={handleHeroCalc} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">
                      Gênero
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setHeroGender('masculino')}
                        className={`py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                          heroGender === 'masculino'
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300'
                        }`}
                      >
                        Homem
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroGender('feminino')}
                        className={`py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                          heroGender === 'feminino'
                            ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300'
                        }`}
                      >
                        Mulher
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        value={heroWeight}
                        onChange={(e) => setHeroWeight(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                        min="30"
                        max="250"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">
                        Altura (cm)
                      </label>
                      <input
                        type="number"
                        value={heroHeight}
                        onChange={(e) => setHeroHeight(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                        min="100"
                        max="230"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">
                        Idade (anos)
                      </label>
                      <input
                        type="number"
                        value={heroAge}
                        onChange={(e) => setHeroAge(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                        min="10"
                        max="100"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="hero-calc-btn"
                    className="w-full py-3 rounded-xl bg-gray-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Calcular minha TMB Agora
                  </button>
                </form>

                {heroResult !== null && (
                  <div className="mt-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 animate-in fade-in duration-300">
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
                      Sua Taxa Metabólica Basal Estimada:
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
                        {heroResult}
                      </span>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                        kcal / dia
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2">
                      💡 Esse é o mínimo que seu corpo queima apenas para se manter vivo. Cadastre-se para ver seu gasto total diário e divisão de macros!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECURSOS / FEATURES */}
      <section id="recursos" className="py-16 bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">
              Recursos de Alto Desempenho
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Tudo o que você precisa para controlar sua dieta sem achismos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-6">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Cálculo Científico TMB & TDEE
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                Descubra com precisão matemática quantas calorias seu corpo gasta em repouso e em atividade diária com fórmulas oficiais.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Divisão Personalizada de Macros
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                Proteínas para preservar massa magra, carboidratos para energia e gorduras boas para regulação hormonal na medida ideal.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-6">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Sugestão de Cardápio Adaptativo
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                Refeições divididas ao longo do dia ajustadas exatamente às suas calorias alvo com alimentos populares do Brasil.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* TESTIMONIALS */}
      <section id="depoimentos" className="py-16 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">
              Histórias de Sucesso
            </h2>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Quem usa o FocoPeso aprova a transformação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700">
              <div className="flex gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
                "Consegui perder 7kg em 2 meses entendendo finalmente a minha TMB e comendo a quantidade certa de proteínas sem radicalismos!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-sm">
                  MC
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Mariana Costa</p>
                  <p className="text-xs text-gray-400 dark:text-slate-400">Plano Pro • Perdeu 7 kg</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700">
              <div className="flex gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
                "A divisão de macros do FocoPeso mudou meu treino. Ganhei massa magra sem acumular gordura abdominal. Ferramenta indispensável!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold flex items-center justify-center text-sm">
                  RS
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Rodrigo Santos</p>
                  <p className="text-xs text-gray-400 dark:text-slate-400">Plano Premium • Ganho de Massa</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700">
              <div className="flex gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
                "Super simples de usar no celular. A sugestão de cardápio facilitou muito minha rotina corrida no trabalho."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center text-sm">
                  FA
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Fernanda Almeida</p>
                  <p className="text-xs text-gray-400 dark:text-slate-400">Plano Pro • Manutenção</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between font-bold text-gray-900 dark:text-white text-sm cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 dark:text-slate-500 transition-transform ${
                      faqOpen === idx ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                    }`}
                  />
                </button>
                {faqOpen === idx && (
                  <div className="px-5 pb-5 text-sm text-gray-600 dark:text-slate-300 border-t border-gray-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-500" />
            <span className="text-lg font-bold text-white tracking-tight">
              Foco<span className="text-emerald-500">Peso</span>
            </span>
          </div>

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} FocoPeso. Todos os direitos reservados. Saúde & Nutrição Científica em PT-BR.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button onClick={() => onOpenAuth('login')} className="hover:text-white transition-colors cursor-pointer">
              Login
            </button>
            <button onClick={() => onOpenAuth('register')} className="hover:text-white transition-colors cursor-pointer">
              Cadastro
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

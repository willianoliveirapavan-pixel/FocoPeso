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
      q: 'Como funciona a calculadora de TMB do NutriCalc Pro?',
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
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800">
      {/* HERO SECTION */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background glow decorations */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-300/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Nutrição Baseada em Ciência & Resultados Reais</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Conquiste seu <span className="text-emerald-600 underline decoration-emerald-200 decoration-wavy">corpo ideal</span> com cálculo exato de TMB e Macros.
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
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
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-bold text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Fazer Login
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
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
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 relative">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                    <h3 className="font-bold text-gray-900 text-base">
                      Simulador Rápido de TMB
                    </h3>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full">
                    Teste Grátis
                  </span>
                </div>

                <form onSubmit={handleHeroCalc} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Gênero
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setHeroGender('masculino')}
                        className={`py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                          heroGender === 'masculino'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        Homem
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroGender('feminino')}
                        className={`py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                          heroGender === 'feminino'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        Mulher
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        value={heroWeight}
                        onChange={(e) => setHeroWeight(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-500"
                        min="30"
                        max="250"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Altura (cm)
                      </label>
                      <input
                        type="number"
                        value={heroHeight}
                        onChange={(e) => setHeroHeight(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-500"
                        min="100"
                        max="230"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Idade (anos)
                      </label>
                      <input
                        type="number"
                        value={heroAge}
                        onChange={(e) => setHeroAge(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-500"
                        min="10"
                        max="100"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="hero-calc-btn"
                    className="w-full py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Calcular minha TMB Agora
                  </button>
                </form>

                {heroResult !== null && (
                  <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 animate-in fade-in duration-300">
                    <p className="text-xs text-emerald-800 font-semibold mb-1">
                      Sua Taxa Metabólica Basal Estimada:
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-emerald-700">
                        {heroResult}
                      </span>
                      <span className="text-sm font-semibold text-emerald-600">
                        kcal / dia
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-600 mt-2">
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
      <section id="recursos" className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest mb-2">
              Recursos de Alto Desempenho
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Tudo o que você precisa para controlar sua dieta sem achismos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Cálculo Científico TMB & TDEE
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Descubra com precisão matemática quantas calorias seu corpo gasta em repouso e em atividade diária com fórmulas oficiais.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Divisão Personalizada de Macros
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Proteínas para preservar massa magra, carboidratos para energia e gorduras boas para regulação hormonal na medida ideal.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Sugestão de Cardápio Adaptativo
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Refeições divididas ao longo do dia ajustadas exatamente às suas calorias alvo com alimentos populares do Brasil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING TABLE (Exigência Principal 2) */}
      <section id="precos" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest mb-2">
              Planos Transparentes
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Escolha o plano ideal para a sua transformação
            </p>
            <p className="text-base text-gray-600">
              Sem contratos de fidelidade. Mude ou cancele seu plano a qualquer momento.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* PLANO GRÁTIS */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-all">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 mb-4">
                  Básico
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                  Plano Grátis
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Ideal para conhecer a plataforma e calcular sua TMB.
                </p>

                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-gray-900">R$ 0</span>
                  <span className="text-gray-500 text-sm font-medium"> /mês</span>
                </div>

                <ul className="space-y-4 text-sm text-gray-600 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Cadastro de Perfil básico</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Cálculo completo de TMB (Basal)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Cálculo de TDEE (Gasto Diário)</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <Lock className="w-4 h-4 text-gray-300 shrink-0" />
                    <span className="line-through">Divisão de Macronutrientes</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <Lock className="w-4 h-4 text-gray-300 shrink-0" />
                    <span className="line-through">Gráficos de Progresso e Metas</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <Lock className="w-4 h-4 text-gray-300 shrink-0" />
                    <span className="line-through">Sugestão de Cardápio</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('register', 'free')}
                id="plan-free-btn"
                className="w-full py-3.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-sm transition-colors cursor-pointer"
              >
                Criar Conta Grátis
              </button>
            </div>

            {/* PLANO PRO (Destaque) */}
            <div className="bg-white rounded-3xl p-8 border-2 border-amber-500 shadow-xl relative flex flex-col justify-between transform lg:-translate-y-3">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                Mais Popular
              </div>

              <div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-4 mt-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Performance Completa
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                  Plano Pro
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Para quem deseja saber exatamente o quanto comer para atingir resultados.
                </p>

                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-gray-900">R$ 19,90</span>
                  <span className="text-gray-500 text-sm font-medium"> /mês</span>
                </div>

                <ul className="space-y-4 text-sm text-gray-600 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-gray-900">Tudo do Plano Grátis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-gray-900">Divisão exata de Macros (g/dia)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Gráficos de Progresso em Tempo Real</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Histórico de Peso e Meta Visual</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Diário Alimentar Interativo</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <Lock className="w-4 h-4 text-gray-300 shrink-0" />
                    <span className="line-through">Sugestão de Cardápio Diário</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('register', 'pro')}
                id="plan-pro-btn"
                className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Assinar Plano Pro
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PLANO PREMIUM */}
            <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
              <div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-4">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Experiência VIP
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                  Plano Premium
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Suporte completo com planejamento de refeições e assistente IA.
                </p>

                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-gray-900">R$ 49,90</span>
                  <span className="text-gray-500 text-sm font-medium"> /mês</span>
                </div>

                <ul className="space-y-4 text-sm text-gray-600 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-gray-900">Tudo do Plano Pro</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-emerald-700">Sugestão de Cardápio Completo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Assistente Nutricional com IA (Gemini)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Controle de Hidratação Diária</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Acesso ao Grupo VIP & Suporte Direto</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('register', 'premium')}
                id="plan-premium-btn"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                Assinar Plano Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="depoimentos" className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest mb-2">
              Histórias de Sucesso
            </h2>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Quem usa o NutriCalc Pro aprova a transformação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                "Consegui perder 7kg em 2 meses entendendo finalmente a minha TMB e comendo a quantidade certa de proteínas sem radicalismos!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  MC
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Mariana Costa</p>
                  <p className="text-xs text-gray-400">Plano Pro • Perdeu 7 kg</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                "A divisão de macros do NutriCalc mudou meu treino. Ganhei massa magra sem acumular gordura abdominal. Ferramenta indispensável!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                  RS
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Rodrigo Santos</p>
                  <p className="text-xs text-gray-400">Plano Premium • Ganho de Massa</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                "Super simples de usar no celular. A sugestão de cardápio facilitou muito minha rotina corrida no trabalho."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                  FA
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Fernanda Almeida</p>
                  <p className="text-xs text-gray-400">Plano Pro • Manutenção</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between font-bold text-gray-900 text-sm cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      faqOpen === idx ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {faqOpen === idx && (
                  <div className="px-5 pb-5 text-sm text-gray-600 border-t border-gray-100 pt-3">
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
              NutriCalc<span className="text-emerald-500">Pro</span>
            </span>
          </div>

          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} NutriCalc Pro. Todos os direitos reservados. Saúde & Nutrição Científica em PT-BR.
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

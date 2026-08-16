import React, { useState } from 'react';
import {
  Utensils,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Camera,
  Activity,
  Award,
  Zap
} from 'lucide-react';
import {
  loginWithEmail,
  registerWithEmail,
  sendPasswordReset,
  getFriendlyAuthErrorMessage,
} from '../../services/authService';

export const LoginView: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Por favor, informe seu nome completo.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('As senhas digitadas não coincidem.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else if (mode === 'register') {
        await registerWithEmail(email, password, name);
      } else if (mode === 'forgot') {
        await sendPasswordReset(email);
        setSuccessMsg('E-mail de redefinição enviado! Verifique sua caixa de entrada.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const code = err?.code || '';
      setErrorMsg(getFriendlyAuthErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-0 md:p-6 lg:p-8 font-sans overflow-x-hidden relative">
      
      {/* Decorative ambient background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl bg-slate-900/60 border border-slate-800/80 md:rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-screen md:min-h-[680px]">
        
        {/* Left Column: Visual Presentation (Hidden on mobile, beautiful on desktop) */}
        <div className="hidden md:flex md:col-span-6 lg:col-span-7 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 lg:p-12 flex-col justify-between border-r border-slate-800/60 relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px]" />
          
          {/* Top Brand Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
              <Utensils className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">
                Foco<span className="text-emerald-400">Peso</span>
              </span>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Nutrição de Precisão</p>
            </div>
          </div>

          {/* Core Content Carousel / Presentation */}
          <div className="space-y-8 my-auto relative z-10 max-w-md">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-500/20">
                <Zap className="w-3.5 h-3.5" />
                Tecnologia de Ponta Integrada
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight">
                A maneira mais inteligente de controlar sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">dieta diária</span>.
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Esqueça tabelas complexas e cálculos chatos. O FocoPeso usa o app para estimar calorias, proteínas, gorduras e carboidratos de forma instantânea.
              </p>
            </div>

            {/* Feature Blocks (Compact and Sleek) */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              <div className="flex gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Análise por Foto</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tire uma foto do seu prato e deixe o app calcular os macros em segundos.</p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Controle de Metas e Macros</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Defina sua meta de emagrecimento, manutenção ou ganho, e acompanhe o progresso em tempo real.</p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/20 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Resultados Científicos</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Metodologia pautada em dados reais de nutrição para garantir que você atinja seu objetivo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Info */}
          <div className="text-[10px] text-slate-500 flex items-center gap-2 relative z-10">
            <span>© 2026 FocoPeso. Todos os direitos reservados.</span>
            <span>•</span>
            <span className="text-slate-400 hover:underline cursor-pointer">Termos de Uso</span>
          </div>
        </div>

        {/* Right Column: Dynamic Form (Clean and highly polished) */}
        <div className="col-span-1 md:col-span-6 lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-slate-900 relative">
          
          {/* Header Mobile Brand (Only visible on mobile) */}
          <div className="flex md:hidden items-center justify-between mb-8 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
                <Utensils className="w-4.5 h-4.5" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white">
                Foco<span className="text-emerald-400">Peso</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">App</span>
          </div>

          {/* Header Text */}
          <div className="space-y-2 mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {mode === 'login' && 'Bem-vindo de volta!'}
              {mode === 'register' && 'Comece sua jornada'}
              {mode === 'forgot' && 'Recuperação de conta'}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === 'login' && 'Faça login para continuar controlando sua dieta.'}
              {mode === 'register' && 'Crie sua conta em poucos segundos para começar.'}
              {mode === 'forgot' && 'Insira seu e-mail para receber as instruções de redefinição.'}
            </p>
          </div>

          {/* Login / Register Toggle Header */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl text-xs font-bold mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Criar Conta</span>
              </button>
            </div>
          )}

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{successMsg}</div>
            </div>
          )}

          {/* Actual Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name input for Register mode */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@exemplo.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Password Input (Login & Register) */}
            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300">
                    Senha
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all focus:ring-1 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password Input (Register) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha exatamente"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition-all focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/15 hover:shadow-emerald-600/25 active:scale-98 transition-all disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Acessar Meu Painel'}
                    {mode === 'register' && 'Cadastrar e Começar Dieta'}
                    {mode === 'forgot' && 'Enviar E-mail de Recuperação'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Additional helper links */}
            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Voltar para o Login</span>
              </button>
            )}

            {mode === 'login' && (
              <div className="text-center pt-2 md:hidden">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Ainda não possui conta? <span className="text-emerald-400 font-bold hover:underline">Criar nova conta</span>
                </button>
              </div>
            )}

            {mode === 'register' && (
              <div className="text-center pt-2 md:hidden">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Já possui uma conta? <span className="text-emerald-400 font-bold hover:underline">Entrar agora</span>
                </button>
              </div>
            )}
          </form>

          {/* Footer security badge */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-[10px] text-slate-500 leading-relaxed flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500/50" />
            <span>Dados protegidos por criptografia de ponta a ponta.</span>
          </div>
        </div>
      </div>
    </div>
  );
};


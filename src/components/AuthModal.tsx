import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Activity, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { UserProfile, PlanType, Gender, Goal } from '../types';
import { saveUser, setLoggedIn } from '../utils/storage';
import { ACTIVITY_LEVEL_OPTIONS } from '../utils/nutrition';
import { registerUserWithFirebase, loginUserWithFirebase } from '../services/firebaseService';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  defaultPlan?: PlanType;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode: initialMode,
  defaultPlan = 'free',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<Gender>('masculino');
  const [currentWeight, setCurrentWeight] = useState<number>(80);
  const [targetWeight, setTargetWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [activityLevel, setActivityLevel] = useState<number>(1.55);
  const [goal, setGoal] = useState<Goal>('lose');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(defaultPlan);

  useEffect(() => {
    setSelectedPlan(defaultPlan);
  }, [defaultPlan]);

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const fbUser = await loginUserWithFirebase(loginEmail, loginPassword);
      let userToLog: UserProfile;

      if (fbUser) {
        userToLog = fbUser;
      } else {
        // Fallback for demo mode
        userToLog = {
          id: 'usr_' + Date.now().toString(),
          name: loginEmail.split('@')[0] || 'Usuário Emagrecerei',
          email: loginEmail,
          password: loginPassword,
          age: 28,
          gender: 'masculino',
          currentWeight: 80,
          targetWeight: 75,
          height: 175,
          activityLevel: 1.55,
          goal: 'lose',
          plan: selectedPlan,
          formula: 'mifflin',
          createdAt: new Date().toISOString(),
        };
      }

      saveUser(userToLog);
      setLoggedIn(true);
      onSuccess(userToLog);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao realizar login no Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Por favor, preencha Nome, E-mail e Senha.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const profileData: Omit<UserProfile, 'id'> = {
      name,
      email,
      password,
      age: Number(age) || 28,
      gender,
      currentWeight: Number(currentWeight) || 80,
      targetWeight: Number(targetWeight) || 75,
      height: Number(height) || 175,
      activityLevel: Number(activityLevel) || 1.55,
      goal,
      plan: 'free',
      formula: 'mifflin',
      createdAt: new Date().toISOString(),
    };

    try {
      const newUser = await registerUserWithFirebase(profileData, password);
      saveUser(newUser);
      setLoggedIn(true);
      onSuccess(newUser);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao criar conta no Firebase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-slate-100 relative my-8 transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3">
            <Activity className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {mode === 'login' ? 'Acessar FocoPeso' : 'Criar sua Conta'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {mode === 'login'
              ? 'Digite suas credenciais para ver seu perfil e metas.'
              : 'Preencha seus dados para calcular TMB e simular seu plano.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-gray-100 dark:bg-slate-800 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Fazer Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Criar Nova Conta
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Seu E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com.br"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Sua Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              id="auth-login-submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Willian Oliveira"
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Senha *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Plan selection removed, default is 'free' */}

            {/* Health & Body details */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <p className="text-xs font-bold text-gray-800">
                Dados Físicos & Objetivos
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Gênero
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-500 bg-white"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Idade (anos)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(Number(e.target.value))}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Meta (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(Number(e.target.value))}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Nível de Atividade Física
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                >
                  {ACTIVITY_LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} - {opt.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Objetivo Principal
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setGoal('lose')}
                    className={`py-2 rounded-xl text-xs font-semibold border ${
                      goal === 'lose'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    Perder Peso
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoal('maintain')}
                    className={`py-2 rounded-xl text-xs font-semibold border ${
                      goal === 'maintain'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    Manter Peso
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoal('gain')}
                    className={`py-2 rounded-xl text-xs font-semibold border ${
                      goal === 'gain'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    Ganhar Massa
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="auth-register-submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Criando Conta no Firebase...</span>
                </>
              ) : (
                <>
                  <span>Criar Conta e Ver Resultado</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

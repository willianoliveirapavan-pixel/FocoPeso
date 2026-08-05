import React, { useState } from 'react';
import {
  User,
  Scale,
  Target,
  Ruler,
  Calendar,
  Save,
  Plus,
  TrendingDown,
  TrendingUp,
  Award,
  Sparkles,
  History,
} from 'lucide-react';
import { UserProfile, WeightEntry, Gender, Goal, FormulaType } from '../types';
import { ACTIVITY_LEVEL_OPTIONS, calculateBMI } from '../utils/nutrition';
import { getWeightLogs, saveWeightLog } from '../utils/storage';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import confetti from 'canvas-confetti';

interface ProfileGoalsTabProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const ProfileGoalsTab: React.FC<ProfileGoalsTabProps> = ({
  user,
  onUpdateUser,
}) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [weightLogs, setWeightLogs] = useState<WeightEntry[]>(getWeightLogs());
  const [newWeight, setNewWeight] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const bmiInfo = calculateBMI(formData.currentWeight, formData.height);
  const weightDiff = (formData.currentWeight - formData.targetWeight).toFixed(1);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);

    if (Number(weightDiff) === 0) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleAddWeightLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;

    const val = Number(newWeight);
    const updatedLogs = saveWeightLog({
      date: new Date().toISOString().split('T')[0],
      weight: val,
      note: newNote || 'Pesagem registrada',
    });

    setWeightLogs(updatedLogs);

    // Also update current weight in profile
    const updatedUser = { ...formData, currentWeight: val };
    setFormData(updatedUser);
    onUpdateUser(updatedUser);

    setNewWeight('');
    setNewNote('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Meu Perfil & Metas de Saúde
        </h2>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          Mantenha seus dados físicos atualizados para garantir a precisão dos cálculos de TMB e macros.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Perfil e metas salvos com sucesso no sistema!
        </div>
      )}

      {/* Goal Progress Visual Box (Exigência Requisito 4) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Progresso do Objetivo
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                {Number(weightDiff) > 0
                  ? `Você está a ${Math.abs(Number(weightDiff))} kg da sua meta!`
                  : Number(weightDiff) < 0
                  ? `Você precisa ganhar ${Math.abs(Number(weightDiff))} kg para sua meta!`
                  : 'Parabéns! Você alcançou sua meta de peso! 🎉'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 text-center">
            <div>
              <p className="text-[10px] text-gray-400 dark:text-slate-400 font-bold uppercase">Peso Atual</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">{formData.currentWeight} kg</p>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-slate-700" />
            <div>
              <p className="text-[10px] text-gray-400 dark:text-slate-400 font-bold uppercase">Peso Meta</p>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{formData.targetWeight} kg</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full transition-all duration-700 shadow-sm"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  15,
                  100 - (Math.abs(Number(weightDiff)) / (formData.currentWeight || 1)) * 100
                )
              )}%`,
            }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 text-right font-medium">
          Diferença restante: <strong className="text-gray-900 dark:text-white">{Math.abs(Number(weightDiff))} kg</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-xs">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Editar Dados Pessoais & Metas
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Gênero
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value as Gender,
                    })
                  }
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Idade (anos)
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Peso Atual (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.currentWeight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentWeight: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Peso Meta (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.targetWeight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetWeight: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      height: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Nível de Atividade Física
              </label>
              <select
                value={formData.activityLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    activityLevel: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                {ACTIVITY_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} - {opt.desc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Objetivo Nutricional
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: 'lose' })}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.goal === 'lose'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300'
                  }`}
                >
                  Perder Peso
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: 'maintain' })}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.goal === 'maintain'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300'
                  }`}
                >
                  Manter Peso
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: 'gain' })}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.goal === 'gain'
                      ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300'
                  }`}
                >
                  Ganhar Massa
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Fórmula Preferida de Cálculo de TMB
              </label>
              <select
                value={formData.formula}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    formula: e.target.value as FormulaType,
                  })
                }
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="mifflin">Mifflin-St Jeor (Padrão OMSA/Científico)</option>
                <option value="harris">Harris-Benedict (Revisada)</option>
              </select>
            </div>

            <button
              type="submit"
              id="save-profile-btn"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Perfil & Atualizar Metas
            </button>
          </form>
        </div>

        {/* Right Weight Log History Chart Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Chart Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Histórico de Peso (Evolução)
              </span>
              <span className="text-xs text-gray-400 dark:text-slate-400 font-normal">Últimos registros</span>
            </h3>

            {/* Recharts Weight Chart */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightLogs}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorWeight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Log Weight Form */}
            <form onSubmit={handleAddWeightLog} className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
              <p className="text-xs font-bold text-gray-800 dark:text-white">
                Registrar Nova Pesagem
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Peso (kg) Ex: 81.2"
                  className="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Nota (opcional)"
                  className="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                id="add-weight-log-btn"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Adicionar Pesagem ao Gráfico
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

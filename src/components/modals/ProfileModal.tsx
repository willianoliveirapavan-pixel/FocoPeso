import React, { useState } from 'react';
import { X, Sliders, Save, Calculator, Sparkles, User, Check, LogOut } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onLogout?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile,
  onLogout,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(user.name);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(user.dailyCalorieGoal);
  const [dailyProteinGoal, setDailyProteinGoal] = useState(user.dailyProteinGoal);
  const [dailyCarbsGoal, setDailyCarbsGoal] = useState(user.dailyCarbsGoal);
  const [dailyFatGoal, setDailyFatGoal] = useState(user.dailyFatGoal);
  const [currentWeight, setCurrentWeight] = useState(user.currentWeight);
  const [targetWeight, setTargetWeight] = useState(user.targetWeight);
  const [height, setHeight] = useState(user.height);
  const [gender, setGender] = useState<'masculino' | 'feminino'>(user.gender);
  const [activityLevel, setActivityLevel] = useState(user.activityLevel);

  const [showSavedToast, setShowSavedToast] = useState(false);

  // Auto recalculate goals based on Mifflin-St Jeor equation
  const handleAutoCalculate = () => {
    // TMB Mifflin-St Jeor
    let tmb = 10 * currentWeight + 6.25 * height - 5 * 28;
    if (gender === 'masculino') tmb += 5;
    else tmb -= 161;

    const tdee = Math.round(tmb * activityLevel);
    // Deficit for weight loss or surplus
    const goalCalories = currentWeight > targetWeight ? tdee - 500 : tdee + 300;

    const prot = Math.round(currentWeight * 2.0); // 2g/kg
    const fat = Math.round(currentWeight * 0.8);  // 0.8g/kg
    const remainingCal = goalCalories - (prot * 4 + fat * 9);
    const carbs = Math.max(50, Math.round(remainingCal / 4));

    setDailyCalorieGoal(goalCalories);
    setDailyProteinGoal(prot);
    setDailyFatGoal(fat);
    setDailyCarbsGoal(carbs);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      dailyCalorieGoal,
      dailyProteinGoal,
      dailyCarbsGoal,
      dailyFatGoal,
      currentWeight,
      targetWeight,
      height,
      gender,
      activityLevel,
    };

    onSaveProfile(updated);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Metas & Perfil Nutricional</h2>
              <p className="text-[11px] text-slate-400">Personalize suas metas diárias de macros</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-4 overflow-y-auto space-y-4 text-xs">
          {showSavedToast && (
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold flex items-center gap-2 animate-in zoom-in-95">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Perfil e Metas Salvos com Sucesso!</span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Calculadora Automática de TMB</span>
              <button
                type="button"
                onClick={handleAutoCalculate}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calcular Metas</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Meta (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Altura (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-center font-bold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <h3 className="font-bold text-white">Metas Diárias Personalizadas</h3>

            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <label className="block text-slate-300 font-medium mb-1">Meta de Calorias (kcal/dia)</label>
                <input
                  type="number"
                  required
                  value={dailyCalorieGoal}
                  onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-extrabold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Proteínas (g/dia)</label>
                <input
                  type="number"
                  required
                  value={dailyProteinGoal}
                  onChange={(e) => setDailyProteinGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Carboidratos (g/dia)</label>
                <input
                  type="number"
                  required
                  value={dailyCarbsGoal}
                  onChange={(e) => setDailyCarbsGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-bold"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-300 font-medium mb-1">Gorduras (g/dia)</label>
                <input
                  type="number"
                  required
                  value={dailyFatGoal}
                  onChange={(e) => setDailyFatGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-rose-400 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3 pt-3">
            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/40 flex items-center gap-1.5 transition-all"
                title="Sair da Conta"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
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

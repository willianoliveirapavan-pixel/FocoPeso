import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Utensils,
  Trash2,
  CheckCircle2,
  Flame,
  Award,
} from 'lucide-react';
import { UserProfile, FoodLogEntry } from '../types';
import { getFoodLogs, addFoodLog } from '../utils/storage';
import { calculateMacros } from '../utils/nutrition';

interface FoodDiaryTabProps {
  user: UserProfile;
}

export const FoodDiaryTab: React.FC<FoodDiaryTabProps> = ({ user }) => {
  const macros = calculateMacros(user);
  const [logs, setLogs] = useState<FoodLogEntry[]>(getFoodLogs());

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodLogEntry['category']>('lunch');
  const [calories, setCalories] = useState<string>('');
  const [protein, setProtein] = useState<string>('');
  const [carbs, setCarbs] = useState<string>('');
  const [fat, setFat] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter((l) => l.date === todayStr);

  const totalCaloriesToday = todayLogs.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProteinToday = todayLogs.reduce((acc, curr) => acc + curr.protein, 0);
  const totalCarbsToday = todayLogs.reduce((acc, curr) => acc + curr.carbs, 0);
  const totalFatToday = todayLogs.reduce((acc, curr) => acc + curr.fat, 0);

  const calPct = Math.min(100, Math.round((totalCaloriesToday / macros.targetCalories) * 100));

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !calories) return;

    const newEntry: Omit<FoodLogEntry, 'id'> = {
      date: todayStr,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      name,
      category,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    };

    const updated = addFoodLog(newEntry);
    setLogs(updated);

    // Reset form
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const categoryLabels: Record<string, string> = {
    breakfast: 'Café da Manhã',
    lunch: 'Almoço',
    snack: 'Lanche',
    dinner: 'Jantar',
    supper: 'Ceia',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Diário Alimentar Diário
        </h2>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          Registre o que você consome no dia e compare em tempo real com sua meta calórica.
        </p>
      </div>

      {/* Daily Progress Gauge */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <div>
            <span className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">
              Consumo Calórico de Hoje
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                {totalCaloriesToday}
              </span>
              <span className="text-sm font-bold text-gray-500 dark:text-slate-400">
                / {macros.targetCalories} kcal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-center font-semibold">
            <div>
              <p className="text-emerald-700 dark:text-emerald-400 font-bold">Proteínas</p>
              <p className="text-base text-gray-900 dark:text-white font-black">{totalProteinToday}g / {macros.proteinGrams}g</p>
            </div>
            <div>
              <p className="text-blue-700 dark:text-blue-400 font-bold">Carboidratos</p>
              <p className="text-base text-gray-900 dark:text-white font-black">{totalCarbsToday}g / {macros.carbsGrams}g</p>
            </div>
            <div>
              <p className="text-amber-700 dark:text-amber-400 font-bold">Gorduras</p>
              <p className="text-base text-gray-900 dark:text-white font-black">{totalFatToday}g / {macros.fatsGrams}g</p>
            </div>
          </div>
        </div>

        {/* Bar */}
        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden mb-2">
          <div
            className={`h-3.5 rounded-full transition-all duration-500 ${
              calPct > 100 ? 'bg-red-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${calPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-slate-400 font-medium text-right">
          {calPct > 100
            ? `⚠️ Você ultrapassou a meta em ${totalCaloriesToday - macros.targetCalories} kcal.`
            : `Restam ${macros.targetCalories - totalCaloriesToday} kcal para atingir sua meta hoje.`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form to log food */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Adicionar Refeição ao Diário
          </h3>

          <form onSubmit={handleAddMeal} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Descrição do Alimento / Refeição *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Tapioca com frango desfiado"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                Refeição / Horário
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="breakfast">Café da Manhã</option>
                <option value="lunch">Almoço</option>
                <option value="snack">Lanche da Tarde</option>
                <option value="dinner">Jantar</option>
                <option value="supper">Ceia</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Calorias (kcal) *
                </label>
                <input
                  type="number"
                  required
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="Ex: 350"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Proteínas (g)
                </label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="Ex: 25"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Carboidratos (g)
                </label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="Ex: 40"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">
                  Gorduras (g)
                </label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  placeholder="Ex: 10"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              id="add-food-log-submit"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Plus className="w-4 h-4" />
              Salvar Refeição no Diário
            </button>
          </form>
        </div>

        {/* List of today's logged meals */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800 shadow-xs">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Refeições Registradas Hoje ({todayLogs.length})
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-400 font-normal">{todayStr}</span>
          </h3>

          {todayLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-slate-400 space-y-2">
              <Utensils className="w-10 h-10 mx-auto text-gray-300 dark:text-slate-600" />
              <p className="text-sm font-semibold">Nenhuma refeição registrada hoje.</p>
              <p className="text-xs">Use o formulário ao lado para registrar o que consumiu.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayLogs.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                        {categoryLabels[item.category] || item.category}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-slate-400">{item.time}</span>
                    </div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white mt-1">
                      {item.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-base font-black text-gray-900 dark:text-white">
                      {item.calories} kcal
                    </span>
                    <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                      P: <strong className="text-emerald-700 dark:text-emerald-400">{item.protein}g</strong> | C:{' '}
                      <strong className="text-blue-700 dark:text-blue-400">{item.carbs}g</strong> | G:{' '}
                      <strong className="text-amber-700 dark:text-amber-400">{item.fat}g</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

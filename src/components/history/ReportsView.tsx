import React, { useState } from 'react';
import {
  PieChart as PieChartIcon,
  Target,
  Calendar,
  Trash2,
  Coffee,
  Utensils,
  Moon,
  Apple,
  ChevronRight,
  Sparkles,
  Camera,
  History,
  Filter,
} from 'lucide-react';
import { UserProfile, MealLog, MealType } from '../../types';

interface ReportsViewProps {
  user: UserProfile;
  allMeals: MealLog[];
  onSelectDate: (dateStr: string) => void;
  onDeleteMeal: (mealId: string) => void;
  onOpenScan: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  user,
  allMeals,
  onSelectDate,
  onDeleteMeal,
  onOpenScan,
}) => {
  const [filterType, setFilterType] = useState<'all' | '7days' | '30days'>('all');

  // Filter meals based on selected time window
  const getFilteredMeals = () => {
    if (filterType === 'all') return allMeals;

    const now = new Date();
    const cutoff = new Date();

    if (filterType === '7days') {
      cutoff.setDate(now.getDate() - 7);
    } else if (filterType === '30days') {
      cutoff.setDate(now.getDate() - 30);
    }

    const cutoffStr = cutoff.toISOString().split('T')[0];
    return allMeals.filter((m) => m.date >= cutoffStr);
  };

  const filteredMeals = getFilteredMeals();

  // Group meals by date string YYYY-MM-DD
  const mealsByDate: { [dateStr: string]: MealLog[] } = {};
  filteredMeals.forEach((meal) => {
    if (!mealsByDate[meal.date]) {
      mealsByDate[meal.date] = [];
    }
    mealsByDate[meal.date].push(meal);
  });

  // Sort dates descending
  const sortedDates = Object.keys(mealsByDate).sort((a, b) => b.localeCompare(a));

  // Compute totals for today or overall filtered
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = allMeals.filter((m) => m.date === todayStr);

  const totalCalories = todayMeals.reduce((acc, m) => acc + m.totalCalories, 0);
  const totalProtein = Number(todayMeals.reduce((acc, m) => acc + m.totalProtein, 0).toFixed(1));
  const totalCarbs = Number(todayMeals.reduce((acc, m) => acc + m.totalCarbs, 0).toFixed(1));
  const totalFat = Number(todayMeals.reduce((acc, m) => acc + m.totalFat, 0).toFixed(1));

  const protCal = totalProtein * 4;
  const carbsCal = totalCarbs * 4;
  const fatCal = totalFat * 9;
  const sumCal = protCal + carbsCal + fatCal || 1;

  const protPct = Math.round((protCal / sumCal) * 100);
  const carbsPct = Math.round((carbsCal / sumCal) * 100);
  const fatPct = Math.round((fatCal / sumCal) * 100);

  // Helper for date formatting
  const formatDateTitle = (dateStr: string) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'Hoje';
    if (dateStr === yesterdayStr) return 'Ontem';

    return dateObj.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getMealIcon = (type: MealType) => {
    switch (type) {
      case 'cafe':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'almoco':
        return <Utensils className="w-4 h-4 text-emerald-400" />;
      case 'jantar':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'lanche':
        return <Apple className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pb-24">
      {/* Sidebar with Nutritional Summary and Filter controls */}
      <div className="col-span-1 md:col-span-5 md:sticky md:top-[90px] h-fit space-y-4">
        {/* Header Title with quick Filter Selector */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold shadow-lg shadow-teal-500/10">
              <History className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Histórico de Refeições</h2>
              <p className="text-xs text-slate-400">Pratos e registros salvos</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <label className="text-[10px] text-slate-400 font-bold block mb-1.5">Filtro de Período</label>
            <div className="grid grid-cols-3 bg-slate-950 border border-slate-800/80 rounded-xl p-1 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-1 rounded-lg font-semibold transition-colors text-center ${
                  filterType === 'all'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tudo
              </button>
              <button
                onClick={() => setFilterType('7days')}
                className={`px-2 py-1 rounded-lg font-semibold transition-colors text-center ${
                  filterType === '7days'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                7 Dias
              </button>
              <button
                onClick={() => setFilterType('30days')}
                className={`px-2 py-1 rounded-lg font-semibold transition-colors text-center ${
                  filterType === '30days'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                30 Dias
              </button>
            </div>
          </div>
        </div>

        {/* Nutritional Summary Card (Today's Macros & Weight Progress) */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <PieChartIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Macros do Dia</h3>
              <p className="text-[11px] text-slate-400">Nutrientes consumidos hoje</p>
            </div>
          </div>

          {/* Proportional Stacked Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex p-0.5 border border-slate-700/60">
              <div
                className="bg-indigo-500 h-full rounded-l-full transition-all duration-500"
                style={{ width: `${protPct}%` }}
                title={`Proteína: ${protPct}%`}
              />
              <div
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${carbsPct}%` }}
                title={`Carboidratos: ${carbsPct}%`}
              />
              <div
                className="bg-rose-500 h-full rounded-r-full transition-all duration-500"
                style={{ width: `${fatPct}%` }}
                title={`Gorduras: ${fatPct}%`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
              <div className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-900/50">
                <span className="block text-[9px] text-indigo-300 font-semibold">Proteína ({protPct}%)</span>
                <span className="text-xs font-extrabold text-white">{totalProtein}g</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-900/50">
                <span className="block text-[9px] text-amber-300 font-semibold">Carbo ({carbsPct}%)</span>
                <span className="text-xs font-extrabold text-white">{totalCarbs}g</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-900/50">
                <span className="block text-[9px] text-rose-300 font-semibold">Gordura ({fatPct}%)</span>
                <span className="text-xs font-extrabold text-white">{totalFat}g</span>
              </div>
            </div>
          </div>

          {/* Weight Goal Status */}
          <div className="pt-2 border-t border-slate-850">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-semibold block">Peso Atual</span>
                <span className="text-sm font-extrabold text-white">{user.currentWeight} kg</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 text-center">
                <span className="text-[10px] text-emerald-300 font-semibold block">Meta de Peso</span>
                <span className="text-sm font-extrabold text-emerald-400">{user.targetWeight} kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Meal Timeline */}
      <div className="col-span-1 md:col-span-7 space-y-4">
        {sortedDates.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 text-slate-400 mx-auto flex items-center justify-center">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Nenhum Histórico Encontrado</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Suas refeições registradas aparecerão aqui organizadas por data. Comece a registrar sua alimentação!
              </p>
            </div>
            <button
              onClick={onOpenScan}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Escanear Primeiro Prato</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDates.map((dateStr) => {
              const dateMeals = mealsByDate[dateStr];
              const dayCalories = dateMeals.reduce((acc, m) => acc + m.totalCalories, 0);
              const dayProt = Number(
                dateMeals.reduce((acc, m) => acc + m.totalProtein, 0).toFixed(1)
              );
              const dayCarbs = Number(
                dateMeals.reduce((acc, m) => acc + m.totalCarbs, 0).toFixed(1)
              );
              const dayFat = Number(
                dateMeals.reduce((acc, m) => acc + m.totalFat, 0).toFixed(1)
              );

              return (
                <div
                  key={dateStr}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl"
                >
                  {/* Date Header Banner */}
                  <div className="p-4 bg-slate-800/80 border-b border-slate-700/70 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-sm font-bold text-white capitalize">
                          {formatDateTitle(dateStr)}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-medium">({dateStr})</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                        <span className="font-extrabold text-emerald-400">{dayCalories} kcal</span>
                        <span>•</span>
                        <span className="text-indigo-400">P: {dayProt}g</span>
                        <span className="text-amber-400">C: {dayCarbs}g</span>
                        <span className="text-rose-400">G: {dayFat}g</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectDate(dateStr)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-750 text-emerald-400 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-all active:scale-95"
                      title="Ver este dia no Diário"
                    >
                      <span>Ver Diário</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Meals List for this Date */}
                  <div className="p-3 space-y-2.5 divide-y divide-slate-800/60">
                    {dateMeals.map((meal) => (
                      <div key={meal.id} className="pt-2.5 first:pt-0 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {meal.imageUrl ? (
                              <img
                                src={meal.imageUrl}
                                alt={meal.dishName}
                                className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                                {getMealIcon(meal.mealType)}
                              </div>
                            )}

                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">
                                {meal.dishName}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-medium capitalize">
                                {meal.mealType === 'cafe' && 'Café da Manhã'}
                                {meal.mealType === 'almoco' && 'Almoço'}
                                {meal.mealType === 'jantar' && 'Jantar'}
                                {meal.mealType === 'lanche' && 'Lanches'}
                                {' • '}
                                {new Date(meal.timestamp).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-right">
                              <span className="text-xs font-extrabold text-emerald-400">
                                {meal.totalCalories} kcal
                              </span>
                              <p className="text-[9px] text-slate-400">
                                P:{meal.totalProtein}g C:{meal.totalCarbs}g G:{meal.totalFat}g
                              </p>
                            </div>

                            <button
                              onClick={() => onDeleteMeal(meal.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                              title="Excluir do Histórico"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Items breakdown pills */}
                        {meal.items && meal.items.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pl-1">
                            {meal.items.map((item) => (
                              <span
                                key={item.id}
                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-300"
                              >
                                <strong className="text-slate-100 font-semibold mr-1">
                                  {item.name}:
                                </strong>
                                {item.portionGrams}g ({item.calories} kcal)
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

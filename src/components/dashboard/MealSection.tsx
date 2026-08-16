import React, { useState } from 'react';
import { Coffee, Utensils, Moon, Apple, Plus, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { MealLog, MealType } from '../../types';

interface MealSectionProps {
  mealType: MealType;
  title: string;
  subtitle: string;
  meals: MealLog[];
  onOpenCameraForType: (type: MealType) => void;
  onOpenManualForType: (type: MealType) => void;
  onDeleteMeal: (mealId: string) => void;
}

export const MealSection: React.FC<MealSectionProps> = ({
  mealType,
  title,
  subtitle,
  meals,
  onOpenCameraForType,
  onOpenManualForType,
  onDeleteMeal,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Meal type icons and color badges
  const getMealTheme = () => {
    switch (mealType) {
      case 'cafe':
        return { icon: Coffee, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
      case 'almoco':
        return { icon: Utensils, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
      case 'jantar':
        return { icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' };
      case 'lanche':
        return { icon: Apple, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
    }
  };

  const theme = getMealTheme();
  const IconComponent = theme.icon;

  const totalCalories = meals.reduce((acc, m) => acc + m.totalCalories, 0);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-md">
      {/* Section Header */}
      <div className="p-3.5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${theme.bg} border ${theme.color} flex items-center justify-center`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white">{title}</h3>
              <span className="text-[10px] text-slate-400 font-medium">({subtitle})</span>
            </div>
            <p className="text-xs font-extrabold text-emerald-400 mt-0.5">{totalCalories} kcal</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenCameraForType(mealType)}
            className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1 px-2.5 transition-colors cursor-pointer"
            title="Fotografar Refeição"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fotografar</span>
          </button>

          <button
            onClick={() => onOpenManualForType(mealType)}
            className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750 transition-colors cursor-pointer"
            title="Adicionar Manualmente"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Meals List */}
      {isExpanded && (
        <div className="p-3 space-y-2.5 bg-slate-950/40">
          {meals.length === 0 ? (
            <div className="py-4 text-center text-[11px] text-slate-500 italic">
              Nenhuma refeição registrada para este horário.
            </div>
          ) : (
            meals.map((meal) => (
              <div
                key={meal.id}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {meal.imageUrl && (
                      <img
                        src={meal.imageUrl}
                        alt={meal.dishName}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-700"
                      />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-white">{meal.dishName}</h4>
                      <p className="text-[10px] text-slate-400">
                        {meal.totalCalories} kcal • P: {meal.totalProtein}g C: {meal.totalCarbs}g G: {meal.totalFat}g
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteMeal(meal.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Excluir do Diário"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Ingredient details */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px]">
                  {meal.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-medium"
                    >
                      {item.name} ({item.portionGrams}g)
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

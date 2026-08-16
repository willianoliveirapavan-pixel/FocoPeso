import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Check, Sparkles, AlertCircle, Loader2, Save } from 'lucide-react';
import { AiFoodAnalysisResult, FoodItem, MealType, MealLog } from '../../types';

interface FoodConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: AiFoodAnalysisResult | null;
  selectedImage: string | null;
  selectedDate: string;
  onSaveMeal: (meal: MealLog) => void;
}

export const FoodConfirmationModal: React.FC<FoodConfirmationModalProps> = ({
  isOpen,
  onClose,
  analysisResult,
  selectedImage,
  selectedDate,
  onSaveMeal,
}) => {
  if (!isOpen || !analysisResult) return null;

  const [dishName, setDishName] = useState(analysisResult.dishName || 'Refeição');
  const [mealType, setMealType] = useState<MealType>('almoco');
  const [items, setItems] = useState<FoodItem[]>(() =>
    (analysisResult.items || []).map((it, idx) => ({
      id: 'item_' + idx + '_' + Date.now(),
      name: it.name,
      portionGrams: Math.round(it.portionGrams || 100),
      calories: Math.round(it.calories || 0),
      proteinGrams: Number((it.proteinGrams || 0).toFixed(1)),
      carbsGrams: Number((it.carbsGrams || 0).toFixed(1)),
      fatGrams: Number((it.fatGrams || 0).toFixed(1)),
    }))
  );

  // New custom item fields
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientGrams, setNewIngredientGrams] = useState(10);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [isSearchingNutrition, setIsSearchingNutrition] = useState(false);

  // Recalculate totals
  const totalCalories = Math.round(items.reduce((acc, it) => acc + it.calories, 0));
  const totalProtein = Number(items.reduce((acc, it) => acc + it.proteinGrams, 0).toFixed(1));
  const totalCarbs = Number(items.reduce((acc, it) => acc + it.carbsGrams, 0).toFixed(1));
  const totalFat = Number(items.reduce((acc, it) => acc + it.fatGrams, 0).toFixed(1));

  // Handler to update grams proportionally
  const handleGramChange = (id: string, newGrams: number) => {
    if (newGrams <= 0) return;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const ratio = newGrams / (it.portionGrams || 100);
          return {
            ...it,
            portionGrams: newGrams,
            calories: Math.round(it.calories * ratio),
            proteinGrams: Number((it.proteinGrams * ratio).toFixed(1)),
            carbsGrams: Number((it.carbsGrams * ratio).toFixed(1)),
            fatGrams: Number((it.fatGrams * ratio).toFixed(1)),
          };
        }
        return it;
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleAddCustomIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) return;

    setIsSearchingNutrition(true);

    try {
      const response = await fetch('/api/search-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: newIngredientName.trim(),
          portionGrams: newIngredientGrams,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.data) {
        const item: FoodItem = {
          id: 'custom_' + Date.now(),
          name: resData.data.name || newIngredientName,
          portionGrams: Math.round(resData.data.portionGrams || newIngredientGrams),
          calories: Math.round(resData.data.calories || 0),
          proteinGrams: Number((resData.data.proteinGrams || 0).toFixed(1)),
          carbsGrams: Number((resData.data.carbsGrams || 0).toFixed(1)),
          fatGrams: Number((resData.data.fatGrams || 0).toFixed(1)),
        };
        setItems((prev) => [...prev, item]);
      } else {
        // Fallback default estimate if API fails
        const fallbackItem: FoodItem = {
          id: 'custom_' + Date.now(),
          name: newIngredientName,
          portionGrams: newIngredientGrams,
          calories: Math.round(newIngredientGrams * 2), // rough estimate
          proteinGrams: Number((newIngredientGrams * 0.1).toFixed(1)),
          carbsGrams: Number((newIngredientGrams * 0.2).toFixed(1)),
          fatGrams: Number((newIngredientGrams * 0.05).toFixed(1)),
        };
        setItems((prev) => [...prev, fallbackItem]);
      }

      setNewIngredientName('');
      setNewIngredientGrams(10);
      setIsAddingCustom(false);
    } catch (err) {
      console.warn('Error fetching nutrition for custom ingredient:', err);
    } finally {
      setIsSearchingNutrition(false);
    }
  };

  const handleConfirmSave = () => {
    const newMealLog: MealLog = {
      id: 'meal_' + Date.now(),
      userId: 'user',
      dishName,
      mealType,
      date: selectedDate,
      timestamp: Date.now(),
      items,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      imageUrl: selectedImage || undefined,
      summaryTip: analysisResult.summaryTip,
    };

    onSaveMeal(newMealLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Confirmação Nutricional</h2>
              <p className="text-[11px] text-slate-400">Revise e ajuste as porções antes de salvar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Dish Name & Meal Type Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Nome do Prato
              </label>
              <input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Refeição
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-hidden focus:border-emerald-500"
              >
                <option value="cafe">Café da Manhã</option>
                <option value="almoco">Almoço</option>
                <option value="jantar">Jantar</option>
                <option value="lanche">Lanches</option>
              </select>
            </div>
          </div>

          {/* Macro Totals Summary Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-800/90 to-slate-800/50 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Total da Refeição</span>
              <span className="text-base font-extrabold text-emerald-400">{totalCalories} kcal</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-700/60 text-center">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="block text-[10px] text-slate-400 font-medium">Proteínas</span>
                <span className="text-xs font-extrabold text-indigo-400">{totalProtein}g</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="block text-[10px] text-slate-400 font-medium">Carbos</span>
                <span className="text-xs font-extrabold text-amber-400">{totalCarbs}g</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <span className="block text-[10px] text-slate-400 font-medium">Gorduras</span>
                <span className="text-xs font-extrabold text-rose-400">{totalFat}g</span>
              </div>
            </div>
          </div>

          {/* Ingredients List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200">Ingredientes Identificados</h3>
              <button
                type="button"
                onClick={() => setIsAddingCustom(true)}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Ingrediente Oculto</span>
              </button>
            </div>

            {/* Custom Ingredient Add Input */}
            {isAddingCustom && (
              <form onSubmit={handleAddCustomIngredient} className="p-3 rounded-2xl bg-slate-800 border border-emerald-500/40 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-slate-300 font-semibold mb-1">
                      Nome (ex: Azeite de Oliva, Molho)
                    </label>
                    <input
                      type="text"
                      required
                      value={newIngredientName}
                      onChange={(e) => setNewIngredientName(e.target.value)}
                      placeholder="Ex: Azeite de Oliva Extra"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-300 font-semibold mb-1">
                      Qtd (g/ml)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newIngredientGrams}
                      onChange={(e) => setNewIngredientGrams(Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(false)}
                    className="px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSearchingNutrition}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1"
                  >
                    {isSearchingNutrition ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                    <span>Buscar e Adicionar</span>
                  </button>
                </div>
              </form>
            )}

            {items.length === 0 ? (
              <p className="text-center py-4 text-xs text-slate-500">
                Nenhum ingrediente adicionado. Clique no botão acima para adicionar.
              </p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/70 flex items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{item.calories} kcal</span>
                        <span>•</span>
                        <span className="text-indigo-400">P: {item.proteinGrams}g</span>
                        <span className="text-amber-400">C: {item.carbsGrams}g</span>
                        <span className="text-rose-400">G: {item.fatGrams}g</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
                        <input
                          type="number"
                          min="1"
                          max="2000"
                          value={item.portionGrams}
                          onChange={(e) => handleGramChange(item.id, Number(e.target.value))}
                          className="w-12 bg-transparent text-xs font-extrabold text-emerald-400 text-center focus:outline-hidden"
                        />
                        <span className="text-[10px] text-slate-400 font-semibold">g</span>
                      </div>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-colors"
                        title="Remover Ingrediente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Tip Box */}
          {analysisResult.summaryTip && (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-200 block mb-0.5">Dica FocoPeso:</span>
                <p className="text-[11px] leading-relaxed text-emerald-300">{analysisResult.summaryTip}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirmSave}
            disabled={items.length === 0}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Refeição no Diário</span>
          </button>
        </div>
      </div>
    </div>
  );
};

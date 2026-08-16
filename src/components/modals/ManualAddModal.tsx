import React, { useState } from 'react';
import { X, Search, Plus, Loader2, Save, Utensils } from 'lucide-react';
import { MealLog, MealType, FoodItem } from '../../types';

interface ManualAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSaveMeal: (meal: MealLog) => void;
}

export const ManualAddModal: React.FC<ManualAddModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSaveMeal,
}) => {
  if (!isOpen) return null;

  const [dishName, setDishName] = useState('');
  const [mealType, setMealType] = useState<MealType>('lanche');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchGrams, setSearchGrams] = useState(100);
  const [isSearching, setIsSearching] = useState(false);
  const [items, setItems] = useState<FoodItem[]>([]);

  const handleSearchAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const response = await fetch('/api/search-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery.trim(),
          portionGrams: searchGrams,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success && resData.data) {
        const newItem: FoodItem = {
          id: 'manual_item_' + Date.now(),
          name: resData.data.name || searchQuery,
          portionGrams: Math.round(resData.data.portionGrams || searchGrams),
          calories: Math.round(resData.data.calories || 0),
          proteinGrams: Number((resData.data.proteinGrams || 0).toFixed(1)),
          carbsGrams: Number((resData.data.carbsGrams || 0).toFixed(1)),
          fatGrams: Number((resData.data.fatGrams || 0).toFixed(1)),
        };
        setItems((prev) => [...prev, newItem]);
        if (!dishName) setDishName(newItem.name);
      } else {
        // Fallback default estimation
        const fallbackItem: FoodItem = {
          id: 'manual_item_' + Date.now(),
          name: searchQuery,
          portionGrams: searchGrams,
          calories: Math.round(searchGrams * 1.5),
          proteinGrams: Number((searchGrams * 0.08).toFixed(1)),
          carbsGrams: Number((searchGrams * 0.2).toFixed(1)),
          fatGrams: Number((searchGrams * 0.04).toFixed(1)),
        };
        setItems((prev) => [...prev, fallbackItem]);
        if (!dishName) setDishName(searchQuery);
      }

      setSearchQuery('');
      setSearchGrams(100);
    } catch (err) {
      console.warn('Error searching nutrition data:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const totalCalories = Math.round(items.reduce((acc, it) => acc + it.calories, 0));
  const totalProtein = Number(items.reduce((acc, it) => acc + it.proteinGrams, 0).toFixed(1));
  const totalCarbs = Number(items.reduce((acc, it) => acc + it.carbsGrams, 0).toFixed(1));
  const totalFat = Number(items.reduce((acc, it) => acc + it.fatGrams, 0).toFixed(1));

  const handleSave = () => {
    if (items.length === 0) return;

    const newMeal: MealLog = {
      id: 'meal_manual_' + Date.now(),
      userId: 'user',
      dishName: dishName || items[0].name,
      mealType,
      date: selectedDate,
      timestamp: Date.now(),
      items,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
    };

    onSaveMeal(newMeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Registro Manual de Alimento</h2>
              <p className="text-[11px] text-slate-400">Busque no banco nutricional</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Nome da Refeição
              </label>
              <input
                type="text"
                placeholder="Ex: Lanche da Tarde"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Tipo
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-hidden focus:border-teal-500"
              >
                <option value="cafe">Café da Manhã</option>
                <option value="almoco">Almoço</option>
                <option value="jantar">Jantar</option>
                <option value="lanche">Lanches</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchAndAdd} className="space-y-2">
            <label className="block text-[11px] font-semibold text-slate-300">
              Buscar Alimento (Tabela TACO/USDA)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Maçã Fuji, Whey Protein, Ovo..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="w-20">
                <input
                  type="number"
                  min="1"
                  value={searchGrams}
                  onChange={(e) => setSearchGrams(Number(e.target.value))}
                  placeholder="g"
                  className="w-full px-2 py-2 text-xs text-center rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center transition-all cursor-pointer"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* List of Added Items */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-300">Alimentos no Item ({items.length})</h3>
            {items.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-center text-xs text-slate-500">
                Pesquise um alimento acima e clique no botão "+" para adicionar.
              </div>
            ) : (
              <div className="space-y-1.5">
                {items.map((it, idx) => (
                  <div
                    key={it.id}
                    className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{it.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {it.portionGrams}g • {it.calories} kcal • P: {it.proteinGrams}g C: {it.carbsGrams}g G: {it.fatGrams}g
                      </p>
                    </div>
                    <button
                      onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
            onClick={handleSave}
            disabled={items.length === 0}
            className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar no Diário ({totalCalories} kcal)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

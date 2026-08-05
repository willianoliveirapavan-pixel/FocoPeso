import { UserProfile, MacroBreakdown, MealCategoryPlan, FormulaType } from '../types';

export function calculateTMB(
  weight: number,
  height: number,
  age: number,
  gender: 'masculino' | 'feminino',
  formula: FormulaType = 'mifflin'
): number {
  if (weight <= 0 || height <= 0 || age <= 0) return 0;

  if (formula === 'mifflin') {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return Math.round(gender === 'masculino' ? base + 5 : base - 161);
  } else {
    // Harris-Benedict revised
    if (gender === 'masculino') {
      return Math.round(88.362 + 13.397 * weight + 4.799 * height - 5.677 * age);
    } else {
      return Math.round(447.593 + 9.247 * weight + 3.098 * height - 4.330 * age);
    }
  }
}

export function calculateTDEE(tmb: number, activityLevel: number): number {
  return Math.round(tmb * activityLevel);
}

export function calculateMacros(profile: UserProfile): MacroBreakdown {
  const tmb = calculateTMB(
    profile.currentWeight,
    profile.height,
    profile.age,
    profile.gender,
    profile.formula
  );
  
  const tdee = calculateTDEE(tmb, profile.activityLevel);

  let targetCalories = tdee;
  let deficitOrSurplus = 0;

  if (profile.goal === 'lose') {
    deficitOrSurplus = -500;
    targetCalories = Math.max(1200, tdee - 500);
  } else if (profile.goal === 'gain') {
    deficitOrSurplus = 400;
    targetCalories = tdee + 400;
  }

  // Calculate Protein grams based on goal & weight
  let proteinFactor = 2.0; // default for loss/cut
  if (profile.goal === 'gain') proteinFactor = 2.1;
  if (profile.goal === 'maintain') proteinFactor = 1.8;

  let proteinGrams = Math.round(profile.currentWeight * proteinFactor);
  let proteinCalories = proteinGrams * 4;

  // Fats: ~0.9g per kg
  let fatGrams = Math.round(profile.currentWeight * 0.9);
  let fatCalories = fatGrams * 9;

  // Carbs take up remaining calories
  let remainingCalories = targetCalories - (proteinCalories + fatCalories);
  if (remainingCalories < 300) {
    // Adjust if remaining calories are too low
    fatGrams = Math.round((targetCalories * 0.25) / 9);
    fatCalories = fatGrams * 9;
    remainingCalories = targetCalories - (proteinCalories + fatCalories);
  }

  let carbsGrams = Math.max(30, Math.round(remainingCalories / 4));
  let carbsCalories = carbsGrams * 4;

  const totalCalculatedCalories = proteinCalories + fatCalories + carbsCalories;

  return {
    tmb,
    tdee,
    targetCalories,
    proteinGrams,
    carbsGrams,
    fatsGrams: fatGrams,
    proteinPct: Math.round((proteinCalories / totalCalculatedCalories) * 100),
    carbsPct: Math.round((carbsCalories / totalCalculatedCalories) * 100),
    fatsPct: Math.round((fatCalories / totalCalculatedCalories) * 100),
    deficitOrSurplus
  };
}

export function calculateBMI(weight: number, heightCm: number): {
  bmi: number;
  category: string;
  color: string;
  advice: string;
} {
  if (!weight || !heightCm) {
    return { bmi: 0, category: 'Não informado', color: 'text-gray-500', advice: '' };
  }

  const heightM = heightCm / 100;
  const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) {
    return {
      bmi,
      category: 'Abaixo do peso',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      advice: 'Foque em superávit calórico controlado e hipertrofia.'
    };
  } else if (bmi < 25.0) {
    return {
      bmi,
      category: 'Peso Normal',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      advice: 'Ótimo trabalho! Mantenha a constância e boa hidratação.'
    };
  } else if (bmi < 30.0) {
    return {
      bmi,
      category: 'Sobrepeso',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      advice: 'Um leve déficit calórico ajudará a atingir a faixa ideal.'
    };
  } else if (bmi < 35.0) {
    return {
      bmi,
      category: 'Obesidade Grau I',
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      advice: 'Priorize alimentos integrais e rotina de exercícios físicos.'
    };
  } else {
    return {
      bmi,
      category: 'Obesidade Grau II/III',
      color: 'text-red-600 bg-red-50 border-red-200',
      advice: 'Recomendamos acompanhamento médico e nutricional especializado.'
    };
  }
}

export const ACTIVITY_LEVEL_OPTIONS = [
  { value: 1.2, label: 'Sedentário', desc: 'Pouco ou nenhum exercício diário' },
  { value: 1.375, label: 'Levemente Ativo', desc: 'Exercício leve 1 a 3 dias/semana' },
  { value: 1.55, label: 'Moderadamente Ativo', desc: 'Exercício moderado 3 a 5 dias/semana' },
  { value: 1.725, label: 'Muito Ativo', desc: 'Treinos intensos 6 a 7 dias/semana' },
  { value: 1.9, label: 'Extremamente Ativo', desc: 'Trabalho físico pesado ou 2 treinos por dia' }
];

export function generateSuggestedMealPlan(targetCalories: number): MealCategoryPlan[] {
  // Scale factor based on 2000 kcal standard reference
  const factor = targetCalories / 2000;

  return [
    {
      category: 'breakfast',
      title: 'Café da Manhã Energético',
      timeRange: '07:00 - 08:30',
      items: [
        {
          id: 'b1',
          name: 'Ovos Mexidos com Espinafre',
          portion: `${Math.round(2 * factor)} ovos grandes + 30g espinafre`,
          calories: Math.round(180 * factor),
          protein: Math.round(14 * factor),
          carbs: Math.round(2 * factor),
          fat: Math.round(12 * factor),
          category: 'breakfast'
        },
        {
          id: 'b2',
          name: 'Pão Integral ou Torrada de Fermentação Natural',
          portion: `${Math.round(2 * factor)} fatias (50g)`,
          calories: Math.round(130 * factor),
          protein: Math.round(4 * factor),
          carbs: Math.round(24 * factor),
          fat: Math.round(1.5 * factor),
          category: 'breakfast'
        },
        {
          id: 'b3',
          name: 'Mamão Papaia com Aveia e Mel',
          portion: `${Math.round(150 * factor)}g mamão + 1 colher aveia`,
          calories: Math.round(110 * factor),
          protein: Math.round(3 * factor),
          carbs: Math.round(22 * factor),
          fat: Math.round(1 * factor),
          category: 'breakfast'
        }
      ],
      totalCalories: Math.round(420 * factor),
      totalProtein: Math.round(21 * factor),
      totalCarbs: Math.round(48 * factor),
      totalFat: Math.round(14.5 * factor)
    },
    {
      category: 'lunch',
      title: 'Almoço Completo e Balanceado',
      timeRange: '12:00 - 13:30',
      items: [
        {
          id: 'l1',
          name: 'Peito de Frango Grelhado ou Filé de Mignon Suíno',
          portion: `${Math.round(150 * factor)}g (peso cozido)`,
          calories: Math.round(240 * factor),
          protein: Math.round(42 * factor),
          carbs: 0,
          fat: Math.round(6 * factor),
          category: 'lunch'
        },
        {
          id: 'l2',
          name: 'Arroz Integral Temperado com Alho',
          portion: `${Math.round(120 * factor)}g (4 colheres de sopa)`,
          calories: Math.round(155 * factor),
          protein: Math.round(3.5 * factor),
          carbs: Math.round(32 * factor),
          fat: Math.round(1 * factor),
          category: 'lunch'
        },
        {
          id: 'l3',
          name: 'Feijão Preto ou Carioca Cozido',
          portion: `${Math.round(100 * factor)}g (1 concha média)`,
          calories: Math.round(76 * factor),
          protein: Math.round(5 * factor),
          carbs: Math.round(13 * factor),
          fat: Math.round(0.5 * factor),
          category: 'lunch'
        },
        {
          id: 'l4',
          name: 'Salada Colorida (Alface, Tomate, Cenoura) + Azeite Extra Virgem',
          portion: `Prato fundo à vontade + 1 colher chá azeite`,
          calories: Math.round(85 * factor),
          protein: Math.round(2 * factor),
          carbs: Math.round(8 * factor),
          fat: Math.round(5 * factor),
          category: 'lunch'
        }
      ],
      totalCalories: Math.round(556 * factor),
      totalProtein: Math.round(52.5 * factor),
      totalCarbs: Math.round(53 * factor),
      totalFat: Math.round(12.5 * factor)
    },
    {
      category: 'snack',
      title: 'Lanche da Tarde Proteico',
      timeRange: '16:00 - 17:00',
      items: [
        {
          id: 's1',
          name: 'Iogurte Natural Desnatado / Grego Light',
          portion: `${Math.round(170 * factor)}g (1 pote)`,
          calories: Math.round(110 * factor),
          protein: Math.round(12 * factor),
          carbs: Math.round(9 * factor),
          fat: Math.round(2.5 * factor),
          category: 'snack'
        },
        {
          id: 's2',
          name: 'Whey Protein Concentrado ou Proteína Vegetal',
          portion: `1 scoop (30g)`,
          calories: Math.round(120 * factor),
          protein: Math.round(24 * factor),
          carbs: Math.round(3 * factor),
          fat: Math.round(1.5 * factor),
          category: 'snack'
        },
        {
          id: 's3',
          name: 'Castanha-do-Pará e Amêndoas',
          portion: `${Math.round(15 * factor)}g (aprox. 4 unidades)`,
          calories: Math.round(95 * factor),
          protein: Math.round(2.5 * factor),
          carbs: Math.round(2 * factor),
          fat: Math.round(8.5 * factor),
          category: 'snack'
        }
      ],
      totalCalories: Math.round(325 * factor),
      totalProtein: Math.round(38.5 * factor),
      totalCarbs: Math.round(14 * factor),
      totalFat: Math.round(12.5 * factor)
    },
    {
      category: 'dinner',
      title: 'Jantar Leve de Fácil Digestão',
      timeRange: '19:30 - 20:30',
      items: [
        {
          id: 'd1',
          name: 'Filé de Tilápia ou Salmão ao Forno',
          portion: `${Math.round(160 * factor)}g`,
          calories: Math.round(210 * factor),
          protein: Math.round(36 * factor),
          carbs: 0,
          fat: Math.round(6 * factor),
          category: 'dinner'
        },
        {
          id: 'd2',
          name: 'Batata Doce Assada com Alecrim ou Mandioquinha',
          portion: `${Math.round(120 * factor)}g`,
          calories: Math.round(125 * factor),
          protein: Math.round(2 * factor),
          carbs: Math.round(28 * factor),
          fat: Math.round(0.5 * factor),
          category: 'dinner'
        },
        {
          id: 'd3',
          name: 'Brócolis e Couve-Flor no Vapor',
          portion: `${Math.round(120 * factor)}g`,
          calories: Math.round(45 * factor),
          protein: Math.round(3.5 * factor),
          carbs: Math.round(7 * factor),
          fat: 0,
          category: 'dinner'
        }
      ],
      totalCalories: Math.round(380 * factor),
      totalProtein: Math.round(41.5 * factor),
      totalCarbs: Math.round(35 * factor),
      totalFat: Math.round(6.5 * factor)
    },
    {
      category: 'supper',
      title: 'Ceia Reparadora (Opcional)',
      timeRange: '22:00',
      items: [
        {
          id: 'sup1',
          name: 'Chá de Camomila / Passiflora sem Açúcar',
          portion: '200ml',
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          category: 'supper'
        },
        {
          id: 'sup2',
          name: 'Abacate Amassado com Cacau em Pó 100%',
          portion: `${Math.round(50 * factor)}g`,
          calories: Math.round(90 * factor),
          protein: Math.round(1 * factor),
          carbs: Math.round(4 * factor),
          fat: Math.round(7.5 * factor),
          category: 'supper'
        }
      ],
      totalCalories: Math.round(90 * factor),
      totalProtein: Math.round(1 * factor),
      totalCarbs: Math.round(4 * factor),
      totalFat: Math.round(7.5 * factor)
    }
  ];
}

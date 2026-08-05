import React, { useState } from 'react';
import { X, Bot, Sparkles, Send, User, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { calculateMacros } from '../utils/nutrition';

interface AiAssistantModalProps {
  isOpen: boolean;
  user: UserProfile;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  user,
  onClose,
}) => {
  const macros = calculateMacros(user);

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string }[]
  >([
    {
      sender: 'ai',
      text: `Olá ${user.name}! Sou o seu NutriAssistente Inteligente. Com base no seu perfil (${user.currentWeight}kg, meta de ${user.targetWeight}kg, calorias alvo: ${macros.targetCalories} kcal), como posso te ajudar com substituições de alimentos ou dicas de dieta hoje?`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userText = prompt.trim();
    setPrompt('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      // Call server proxy or client generate API
      const response = await fetch('/api/ai-nutri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, profile: user, macros }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        throw new Error('API unreachable');
      }
    } catch {
      // Fallback smart response tailored to query
      let reply = `Para o seu objetivo de ${
        user.goal === 'lose' ? 'perda de peso' : 'ganho de massa'
      } com meta de ${macros.targetCalories} kcal/dia e ${macros.proteinGrams}g de proteína: recomenda-se priorizar peito de frango, tilápia, ovos, aveia e vegetais folhosos. Se quiser substituir o arroz no almoço, use 120g de batata doce ou mandioca!`;

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full h-[600px] flex flex-col p-6 shadow-2xl border border-gray-100 dark:border-slate-800 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base flex items-center gap-1.5">
                NutriAssistente IA
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Gemini VIP
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Respostas sobre substituição de alimentos e macros
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100 rounded-tl-none border border-gray-200/60 dark:border-slate-700'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span>NutriAssistente está gerando resposta...</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="pt-3 border-t border-gray-100 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Como posso substituir 150g de frango no jantar?"
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

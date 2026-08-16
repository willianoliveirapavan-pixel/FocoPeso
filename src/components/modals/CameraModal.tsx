import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X, Sparkles, Loader2, ArrowRight, RefreshCw } from 'lucide-react';
import { AiFoodAnalysisResult } from '../../types';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: AiFoodAnalysisResult, imageBase64: string) => void;
}

// Helper to compress image client-side before sending to server
const compressImage = (file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target?.result as string);
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setErrorMsg(null);
        const compressedBase64 = await compressImage(file);
        setSelectedImage(compressedBase64);
      } catch (err) {
        console.error('Error compressing image:', err);
        const reader = new FileReader();
        reader.onload = (ev) => {
          setSelectedImage(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          notes,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Falha na análise de visão computacional.');
      }

      onAnalysisComplete(resData.data, selectedImage);
      // Reset
      setSelectedImage(null);
      setNotes('');
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setErrorMsg(
        err.message || 'Ocorreu um erro ao analisar a foto. Tente novamente com outra imagem.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Scanner Nutricional FocoPeso</h2>
              <p className="text-[11px] text-slate-400">Tire uma foto ou escolha da galeria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isAnalyzing}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* File Inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileSelect}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {!selectedImage ? (
            /* Upload / Camera Options */
            <div className="space-y-3 py-6">
              <div className="text-center space-y-1 mb-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
                  <Sparkles className="w-8 h-8 animate-pulse text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white pt-2">Fotografe seu Prato</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Nosso sistema identificará cada alimento e estimará as calorias e macronutrientes em segundos.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white flex flex-col items-center justify-center gap-2 font-bold text-xs shadow-lg shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-white" />
                  <span>Tirar Foto Agora</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex flex-col items-center justify-center gap-2 font-semibold text-xs active:scale-98 transition-all cursor-pointer"
                >
                  <ImageIcon className="w-6 h-6 text-teal-400" />
                  <span>Escolher da Galeria</span>
                </button>
              </div>
            </div>
          ) : (
            /* Photo Preview and AI Scanning HUD */
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-4/3 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Prato selecionado"
                  className="w-full h-full object-cover"
                />

                {/* AI HUD Overlay during analysis */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-3">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
                      <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Analisando Ingredientes...</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Estimando porções e macronutrientes da refeição
                      </p>
                    </div>
                  </div>
                )}

                {!isAnalyzing && (
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md"
                    title="Trocar Foto"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Extra Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Observações / Ingredientes Ocultos (Opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isAnalyzing}
                  placeholder="Ex: 1 colher de azeite, frito no ar ou sem óleo..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {selectedImage && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              disabled={isAnalyzing}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analisar Prato Agora</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

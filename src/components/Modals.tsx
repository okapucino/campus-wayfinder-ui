import React from 'react';
import { AlertTriangle, Compass, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warn';
  onUndo?: () => void;
}

interface ToastStackProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastStack: React.FC<ToastStackProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;
  const colorMap = {
    success: 'bg-slate-900/95 text-white border-emerald-500/60',
    info: 'bg-slate-900/95 text-white border-sky-500/60',
    warn: 'bg-amber-950/95 text-amber-100 border-amber-500/60',
  };

  return (
    <div className="pointer-events-none absolute bottom-16 left-3 right-3 z-40 flex flex-col gap-1.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-2 px-3 py-2 rounded-xl border shadow-xl text-[11px] font-semibold ${colorMap[t.type]}`}
        >
          <span className="leading-snug">{t.message}</span>
          {t.onUndo && (
            <button
              type="button"
              onClick={() => {
                t.onUndo?.();
                onDismiss(t.id);
              }}
              className="px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[10px] shrink-0 cursor-pointer"
            >
              Urungkan
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}) => {
  if (!open) return null;
  return (
    <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-[330px] p-4 text-slate-900">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">{title}</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D32F2F] hover:bg-red-700 text-white shadow-sm cursor-pointer"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

interface GuideModalProps {
  open: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-[345px] p-4 text-slate-900">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-[#1A2352] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-sm">Cara Pakai & Kode Ruang</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panduan"
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ol className="mt-3 space-y-2 text-xs text-slate-700">
          <li className="flex gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
            <span className="w-5 h-5 rounded-full bg-[#D32F2F] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
              1
            </span>
            <div>
              <strong className="text-slate-900">Tentukan Titik Awal:</strong> Pilih Parkir Depan,
              Parkir Belakang, atau Gerbang Utama di Beranda.
            </div>
          </li>
          <li className="flex gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
            <span className="w-5 h-5 rounded-full bg-[#D32F2F] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
              2
            </span>
            <div>
              <strong className="text-slate-900">Pilih MatKul / Gedung (G1–G6):</strong> Ketuk
              jadwal kuliahmu atau cari kode ruang (misal{' '}
              <code className="bg-slate-200 px-1 rounded font-bold">R.541</code>).
            </div>
          </li>
          <li className="flex gap-2.5 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            <span className="w-5 h-5 rounded-full bg-[#1A2352] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
              3
            </span>
            <div>
              <strong className="text-slate-900">Pahami Kode Ruang INSTIKI:</strong> Digit 1 =
              Gedung, Digit 2 = Lantai. Contoh: <strong>R.422 (Mushola)</strong> = Gedung 4,
              Lantai 2; <strong>R.541 (Lab DKV)</strong> = Gedung 5, Lantai 4.
            </div>
          </li>
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-[#1A2352] hover:bg-slate-800 text-white font-bold text-xs shadow cursor-pointer"
        >
          Mengerti, Mulai Jelajah
        </button>
      </div>
    </div>
  );
};

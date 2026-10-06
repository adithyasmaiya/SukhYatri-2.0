import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-3 max-w-sm w-[calc(100%-3rem)] pointer-events-none">
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          return (
            <div
              key={t.id}
              className="pointer-events-auto animate-toast-in bg-white rounded-2xl shadow-lift border border-stonewarm p-4 flex items-start gap-3 transition-all"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isSuccess
                    ? 'bg-pine text-sand'
                    : isError
                    ? 'bg-clay text-white'
                    : 'bg-moss text-white'
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-4 h-4" />}
                {isError && <AlertCircle className="w-4 h-4" />}
                {!isSuccess && !isError && <Info className="w-4 h-4" />}
              </div>
              <div
                className="text-sm font-semibold leading-snug text-ink flex-1 pt-1"
                dangerouslySetInnerHTML={{ __html: t.message }}
              />
              <button
                onClick={() => removeToast(t.id)}
                className="text-muted hover:text-ink transition p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

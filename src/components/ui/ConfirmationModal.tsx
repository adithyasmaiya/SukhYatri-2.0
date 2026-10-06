import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <div className="w-12 h-12 rounded-2xl bg-clay/10 text-clay flex items-center justify-center shrink-0 mb-4">
            <Trash2 className="w-6 h-6" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-moss/10 text-moss flex items-center justify-center shrink-0 mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={isLoading ? () => {} : onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        {getIcon()}
        <h3 className="font-display text-xl font-bold text-ink mb-2">{title}</h3>
        <p className="text-sm text-muted mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            className={`flex-1 ${
              variant === 'danger'
                ? 'bg-clay hover:bg-clay/90 text-white border-transparent'
                : variant === 'warning'
                ? 'bg-amber-600 hover:bg-amber-700 text-white border-transparent'
                : 'bg-moss hover:bg-moss/90 text-white'
            }`}
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

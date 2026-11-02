'use client';

import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  isDestructive = true,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex items-start gap-3.5">
        {isDestructive && (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shadow-sm">
            <AlertTriangle className="h-5 w-5" />
          </div>
        )}
        <div>
          <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all disabled:opacity-50 ${
            isDestructive
              ? 'bg-red-600 hover:bg-red-700 shadow-sm'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 shadow-glow'
          }`}
        >
          {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

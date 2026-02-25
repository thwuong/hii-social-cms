import { toast as sonnerToast } from 'sonner';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, Loader2 } from 'lucide-react';
import React from 'react';

/**
 * Custom toast utilities với Carbon Kinetic style
 */

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Icons = {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
};

/**
 * Success toast - màu xanh neon (#00ff66)
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: React.createElement(Icons.CheckCircle2, { className: 'text-toast-success' }),
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  },

  /**
   * Error toast - màu đỏ (#ff3e3e)
   */
  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      icon: React.createElement(Icons.AlertCircle, { className: 'text-toast-error' }),
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  },

  /**
   * Warning toast - màu vàng
   */
  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: React.createElement(Icons.AlertTriangle, { className: 'text-toast-warning' }),
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  },

  /**
   * Info toast - màu trắng
   */
  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: React.createElement(Icons.Info, { className: 'text-toast-info' }),
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  },

  /**
   * Loading toast
   */
  loading: (message: string, options?: { description?: string }) => {
    return sonnerToast.loading(message, {
      description: options?.description,
    });
  },

  /**
   * Promise toast - tự động xử lý loading/success/error
   */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },

  /**
   * Custom toast
   */
  custom: (message: string, options?: ToastOptions) => {
    return sonnerToast(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    });
  },

  /**
   * Dismiss toast
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },
};

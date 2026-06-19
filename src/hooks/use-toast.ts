"use client";

// Minimal toast hook backed by @radix-ui/react-toast
// Compatible with the shadcn/ui toast pattern used in the codebase.

import * as React from "react";

export type ToastVariant = "default" | "destructive";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

type ToastInput = Omit<Toast, "id">;

interface ToastState {
  toasts: Toast[];
}

type Action =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "REMOVE_TOAST"; id: string };

function toastReducer(state: ToastState, action: Action): ToastState {
  switch (action.type) {
    case "ADD_TOAST":
      return { toasts: [action.toast, ...state.toasts].slice(0, 5) };
    case "REMOVE_TOAST":
      return { toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

// Module-level listeners so toast() can be called outside React components.
let count = 0;
const listeners: Array<(action: Action) => void> = [];

function dispatch(action: Action) {
  listeners.forEach((l) => l(action));
}

export function toast(input: ToastInput) {
  const id = String(++count);
  dispatch({ type: "ADD_TOAST", toast: { id, ...input } });
  // Auto-dismiss after 5 s
  setTimeout(() => dispatch({ type: "REMOVE_TOAST", id }), 5000);
}

export function useToast() {
  const [state, localDispatch] = React.useReducer(toastReducer, { toasts: [] });

  React.useEffect(() => {
    listeners.push(localDispatch);
    return () => {
      const idx = listeners.indexOf(localDispatch);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss: (id: string) => dispatch({ type: "REMOVE_TOAST", id }),
  };
}

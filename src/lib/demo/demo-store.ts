"use client";

/**
 * demo-store.ts
 *
 * Client-only state container for Demo Mode. Backed by an in-memory
 * object + a localStorage mirror so visitors can:
 *   - See their changes persist across page refreshes within a session
 *   - Hit a single "Reset Demo" button to restore the canonical sample data
 *   - Never touch the real Prisma database
 *
 * API:
 *   getDemoState()           → current state (synchronous, safe to call
 *                              from any client component, but does NOT
 *                              subscribe to changes).
 *   useDemoState()           → React hook that subscribes to changes
 *                              and re-renders on every mutation.
 *   setDemoState(partial)    → shallow-merge a partial state in.
 *   mutateDemoState(fn)      → run a reducer against current state.
 *   resetDemoState()         → restore the canonical sample dataset.
 *   markChecklistStep(key)   → mark a guided-tour step complete.
 *
 * SSR safety:
 *   - We never read `window`/`localStorage` during module init.
 *   - On the server, `getDemoState()` returns the canonical seed
 *     synchronously, so server components used inside the /demo route
 *     render the same baseline as the first client paint.
 *   - The store hydrates from localStorage in a layout effect so the
 *     first client render is consistent with the server snapshot and
 *     does not cause hydration warnings.
 */

import { useEffect, useSyncExternalStore } from "react";
import { getInitialDemoState } from "./demo-data";
import type {
  DemoBooking,
  DemoChecklistKey,
  DemoProject,
  DemoState,
} from "./demo-types";

const STORAGE_KEY = "plaksha-demo-state-v1";
const TOGGLE_KEY = "plaksha-demo-active-v1";

/** Canonical baseline — also used as the SSR fallback. */
let state: DemoState = getInitialDemoState();

/** In-memory mirror of whether the toggle is on. */
let active = false;

/** Listener registry for `useSyncExternalStore`. */
const listeners = new Set<() => void>();

/** Emit a change to all subscribers. */
function emit() {
  listeners.forEach((l) => l());
}

/** Subscribe used by `useSyncExternalStore`. */
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Hydrate the in-memory state from localStorage. Call once on mount. */
export function hydrateDemoFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DemoState>;
      state = { ...getInitialDemoState(), ...parsed } as DemoState;
    }
    const flag = window.localStorage.getItem(TOGGLE_KEY);
    active = flag === "1";
  } catch (err) {
    // Corrupted localStorage → fall back to baseline.
    console.warn("[demo] Failed to hydrate from localStorage, resetting.", err);
    state = getInitialDemoState();
    active = false;
  }
  emit();
}

/** Persist the current state to localStorage (best-effort). */
function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.localStorage.setItem(TOGGLE_KEY, active ? "1" : "0");
  } catch (err) {
    console.warn("[demo] Failed to persist demo state.", err);
  }
}

/** Synchronous read — safe on the server (returns canonical seed). */
export function getDemoState(): DemoState {
  return state;
}

/** Returns whether the demo toggle is currently on. */
export function isDemoActive(): boolean {
  return active;
}

/** Toggle the demo on/off. */
export function setDemoActive(next: boolean) {
  if (active === next) return;
  active = next;
  if (next) {
    // Hydrate on enable so the user sees their saved sandbox.
    hydrateDemoFromStorage();
  }
  persist();
  emit();
}

/** Reset the demo to the canonical sample dataset. */
export function resetDemoState() {
  state = getInitialDemoState();
  state.lastResetAt = new Date().toISOString();
  active = true;
  persist();
  emit();
}

/** Shallow-merge a partial state. */
export function setDemoState(partial: Partial<DemoState>) {
  state = { ...state, ...partial };
  persist();
  emit();
}

/** Run a reducer against the current state. */
export function mutateDemoState(fn: (draft: DemoState) => DemoState) {
  state = fn(state);
  persist();
  emit();
}

// ─── Convenience mutators ───────────────────────────────────────────────

/** Add a new booking to the sandbox. */
export function addDemoBooking(input: Omit<DemoBooking, "id">): DemoBooking {
  const booking: DemoBooking = {
    ...input,
    id: `b_${Math.random().toString(36).slice(2, 9)}`,
  };
  mutateDemoState((s) => ({ ...s, bookings: [booking, ...s.bookings] }));
  return booking;
}

/** Update a single booking by id. */
export function updateDemoBooking(
  id: string,
  patch: Partial<DemoBooking>
): DemoBooking | null {
  let updated: DemoBooking | null = null;
  mutateDemoState((s) => {
    const bookings = s.bookings.map((b) => {
      if (b.id === id) {
        updated = { ...b, ...patch };
        return updated;
      }
      return b;
    });
    return { ...s, bookings };
  });
  return updated;
}

/** Mark a checklist step complete (idempotent). */
export function markChecklistStep(key: DemoChecklistKey) {
  mutateDemoState((s) => ({
    ...s,
    checklist: { ...s.checklist, [key]: true },
  }));
}

/** Reset a single checklist step. */
export function unmarkChecklistStep(key: DemoChecklistKey) {
  mutateDemoState((s) => ({
    ...s,
    checklist: { ...s.checklist, [key]: false },
  }));
}

/** Update a project's milestone. */
export function toggleDemoMilestone(
  projectId: string,
  milestoneId: string
): DemoProject | null {
  let updated: DemoProject | null = null;
  mutateDemoState((s) => {
    const projects = s.projects.map((p) => {
      if (p.id !== projectId) return p;
      const milestones = p.milestones.map((m) =>
        m.id === milestoneId ? { ...m, done: !m.done } : m
      );
      updated = { ...p, milestones, updatedAt: new Date().toISOString() };
      return updated;
    });
    return { ...s, projects };
  });
  return updated;
}

/** Decrement material stock by some amount, refusing to go negative. */
export function reserveDemoMaterial(materialId: string, quantity: number) {
  mutateDemoState((s) => ({
    ...s,
    materials: s.materials.map((m) => {
      if (m.id !== materialId) return m;
      const next = Math.max(0, m.currentStock - quantity);
      return { ...m, currentStock: Number(next.toFixed(2)) };
    }),
  }));
}

// ─── React bindings ─────────────────────────────────────────────────────

/** Returns the live demo state and re-renders on every mutation. */
export function useDemoState(): DemoState {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}

/** Returns the live "demo active" flag. */
export function useDemoActive(): boolean {
  return useSyncExternalStore(subscribe, getActiveSnapshot, () => false);
}

function getSnapshot(): DemoState {
  return state;
}
function getActiveSnapshot(): boolean {
  return active;
}
function getServerSnapshot(): DemoState {
  return getInitialDemoState();
}

/**
 * Convenience hook — returns `{ state, isActive, ...actions }` for the
 * most common demo operations. Designed for the floating control panel
 * and individual demo pages.
 */
export function useDemo() {
  const state = useDemoState();
  const isActive = useDemoActive();

  // Hydrate once on the first client render.
  useEffect(() => {
    hydrateDemoFromStorage();
  }, []);

  return {
    state,
    isActive,
    activate: () => setDemoActive(true),
    deactivate: () => setDemoActive(false),
    toggle: () => setDemoActive(!isActive),
    reset: resetDemoState,
    markStep: markChecklistStep,
    unmarkStep: unmarkChecklistStep,
    addBooking: addDemoBooking,
    updateBooking: updateDemoBooking,
    toggleMilestone: toggleDemoMilestone,
    reserveMaterial: reserveDemoMaterial,
  };
}

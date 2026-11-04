import { useCallback, useEffect, useState } from "react";
import {
  isExpense,
  storageKey,
  transition,
  type Expense,
  type Status,
} from "./domain";
import { createSeed } from "./seed";

function loadExpenses(): { items: Expense[]; warning: string } {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { items: createSeed(), warning: "" };
    const saved = JSON.parse(raw);
    if (
      !saved ||
      saved.version !== 1 ||
      !Array.isArray(saved.items) ||
      !saved.items.every(isExpense)
    )
      return {
        items: createSeed(),
        warning:
          "Saved demo data could not be read. A fresh sample workspace has been loaded.",
      };
    return { items: saved.items, warning: "" };
  } catch {
    return {
      items: createSeed(),
      warning:
        "Browser storage is unavailable or contains invalid data. Your workspace may not be saved.",
    };
  }
}
export function useExpenses() {
  const [initial] = useState(loadExpenses);
  const [items, setItems] = useState(initial.items);
  const [storageWarning, setStorageWarning] = useState(initial.warning);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, items }));
    } catch {
      setStorageWarning(
        "Your browser could not save this workspace. Changes will last only for this session.",
      );
    }
  }, [items]);
  const save = useCallback(
    (expense: Expense) =>
      setItems((previous) =>
        previous.some((item) => item.id === expense.id)
          ? previous.map((item) => (item.id === expense.id ? expense : item))
          : [expense, ...previous],
      ),
    [],
  );
  const changeStatus = useCallback(
    (id: string, status: Status, reason?: string) => {
      const current = items.find((item) => item.id === id);
      if (!current) throw new Error("This expense could not be found.");
      const updated = transition(current, status, reason);
      setItems((previous) =>
        previous.map((item) => (item.id === id ? updated : item)),
      );
    },
    [items],
  );
  const approveMany = useCallback(
    (ids: string[]) =>
      setItems((previous) =>
        previous.map((item) =>
          ids.includes(item.id) && item.status === "Pending"
            ? transition(item, "Approved")
            : item,
        ),
      ),
    [],
  );
  const reset = useCallback(() => {
    setItems(createSeed());
    setStorageWarning("");
  }, []);
  return { items, save, changeStatus, approveMany, reset, storageWarning };
}

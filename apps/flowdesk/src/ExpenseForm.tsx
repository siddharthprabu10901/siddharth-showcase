import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Info } from "lucide-react";
import {
  categories,
  today,
  validateDraft,
  type Draft,
  type Expense,
  type FieldErrors,
} from "./domain";
import { Modal } from "./Modal";

export function ExpenseForm({
  expense,
  onSave,
  onClose,
}: {
  expense?: Expense;
  onSave: (expense: Expense) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Draft>({
    merchant: expense?.merchant ?? "",
    employee: expense?.employee ?? "Siddharth P",
    category: expense?.category ?? "Travel",
    amount: expense ? String(expense.amount) : "",
    date: expense?.date ?? today(),
    description: expense?.description ?? "",
    receipt: expense?.receipt ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const set = (key: keyof Draft, value: string) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };
  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    const at = new Date().toISOString();
    onSave({
      ...draft,
      merchant: draft.merchant.trim(),
      employee: draft.employee.trim(),
      description: draft.description.trim(),
      receipt: draft.receipt.trim(),
      amount: Math.round(Number(draft.amount) * 100) / 100,
      id: expense?.id ?? `EXP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      status: expense?.status ?? "Pending",
      activity: [
        {
          id: crypto.randomUUID(),
          label: expense
            ? "Expense details updated"
            : "Expense submitted for review",
          at,
        },
        ...(expense?.activity ?? []),
      ],
    });
  }
  const field = (key: keyof Draft) => ({
    id: key,
    name: key,
    value: draft[key],
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => set(key, event.target.value),
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });
  const error = (key: keyof Draft) =>
    errors[key] && (
      <span className="field-error" id={`${key}-error`}>
        {errors[key]}
      </span>
    );
  return (
    <Modal
      title={expense ? "Edit expense" : "New expense"}
      subtitle="A few details now. A smoother review later."
      onClose={onClose}
    >
      <form ref={formRef} onSubmit={submit} noValidate className="expense-form">
        <label>
          Merchant / vendor
          <input
            {...field("merchant")}
            placeholder="e.g. Figma"
            maxLength={80}
            autoFocus
          />
          {error("merchant")}
        </label>
        <div className="form-row">
          <label>
            Amount (INR)
            <input
              {...field("amount")}
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              placeholder="0.00"
            />
            {error("amount")}
          </label>
          <label>
            Category
            <select {...field("category")}>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            {error("category")}
          </label>
        </div>
        <div className="form-row">
          <label>
            Employee
            <input {...field("employee")} maxLength={60} />
            {error("employee")}
          </label>
          <label>
            Expense date
            <input
              {...field("date")}
              type="date"
              min="2000-01-01"
              max={today()}
            />
            {error("date")}
          </label>
        </div>
        <label>
          Business purpose
          <textarea
            {...field("description")}
            placeholder="What was this expense for?"
            rows={3}
            maxLength={500}
          />
          {error("description")}
        </label>
        <label>
          Receipt reference <span className="optional">(optional)</span>
          <input
            {...field("receipt")}
            maxLength={120}
            placeholder="e.g. Invoice #2026-1048"
          />
        </label>
        <p className="form-note">
          <Info size={15} />
          This demo stores a receipt reference, not an uploaded file.
        </p>
        <footer className="modal-footer">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button primary" type="submit">
            {expense ? "Save changes" : "Submit expense"}
            <ArrowRight size={16} />
          </button>
        </footer>
      </form>
    </Modal>
  );
}

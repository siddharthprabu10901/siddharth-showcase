export const statuses = [
  "Pending",
  "Approved",
  "Reimbursed",
  "Rejected",
] as const;
export type Status = (typeof statuses)[number];
export const categories = [
  "Travel",
  "Software",
  "Meals",
  "Office",
  "Learning",
] as const;
export type Category = (typeof categories)[number];
export type View = "Overview" | "All expenses" | "Review queue";
export interface Activity {
  id: string;
  label: string;
  at: string;
}
export interface Expense {
  id: string;
  merchant: string;
  employee: string;
  category: Category;
  amount: number;
  date: string;
  status: Status;
  description: string;
  receipt: string;
  activity: Activity[];
}
export interface Draft {
  merchant: string;
  employee: string;
  category: Category;
  amount: string;
  date: string;
  description: string;
  receipt: string;
}
export type FieldErrors = Partial<Record<keyof Draft, string>>;
export interface Filters {
  query: string;
  status: string;
  category: string;
  sort: string;
}
export const storageKey = "siddharth-showcase.flowdesk.expenses.v1";
export const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
export const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
export const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date.slice(0, 10)}T12:00:00`));
export function validateDraft(
  draft: Draft,
  currentDate = today(),
): FieldErrors {
  const errors: FieldErrors = {};
  if (draft.merchant.trim().length < 2)
    errors.merchant = "Enter a merchant with at least 2 characters.";
  if (draft.employee.trim().length < 2)
    errors.employee = "Enter an employee name.";
  const amount = Number(draft.amount);
  if (
    !draft.amount.trim() ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 10000000
  )
    errors.amount = "Enter an amount between ₹0.01 and ₹1,00,00,000.";
  else if (Math.abs(amount * 100 - Math.round(amount * 100)) > 0.00001)
    errors.amount = "Use no more than two decimal places.";
  const parsed = new Date(`${draft.date}T12:00:00`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(draft.date) ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== draft.date ||
    draft.date > currentDate ||
    draft.date < "2000-01-01"
  )
    errors.date = "Choose a valid expense date between 2000 and today.";
  if (!categories.includes(draft.category))
    errors.category = "Choose a category.";
  if (draft.description.trim().length < 8)
    errors.description = "Add a business purpose with at least 8 characters.";
  return errors;
}
export function filterExpenses(
  expenses: Expense[],
  filters: Filters,
): Expense[] {
  const query = filters.query.trim().toLocaleLowerCase();
  const filtered = expenses.filter(
    (item) =>
      (!query ||
        `${item.id} ${item.merchant} ${item.employee} ${item.description}`
          .toLocaleLowerCase()
          .includes(query)) &&
      (filters.status === "All" || item.status === filters.status) &&
      (filters.category === "All" || item.category === filters.category),
  );
  return filtered.sort((a, b) =>
    filters.sort === "amount-high"
      ? b.amount - a.amount
      : filters.sort === "amount-low"
        ? a.amount - b.amount
        : filters.sort === "oldest"
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
  );
}
export function transition(
  expense: Expense,
  status: Status,
  reason = "",
): Expense {
  const allowed =
    expense.status === "Pending"
      ? ["Approved", "Rejected"]
      : expense.status === "Approved"
        ? ["Reimbursed"]
        : [];
  if (!allowed.includes(status))
    throw new Error(`Cannot change ${expense.status} to ${status}.`);
  if (status === "Rejected" && reason.trim().length < 6)
    throw new Error("Explain the rejection in at least 6 characters.");
  return {
    ...expense,
    status,
    activity: [
      {
        id: crypto.randomUUID(),
        label:
          status === "Rejected"
            ? `Rejected: ${reason.trim()}`
            : status === "Reimbursed"
              ? "Marked as reimbursed (demo only)"
              : "Approved for reimbursement",
        at: new Date().toISOString(),
      },
      ...expense.activity,
    ],
  };
}
export function summary(expenses: Expense[]) {
  const total = (status?: Status) =>
    expenses
      .filter((item) => !status || item.status === status)
      .reduce((sum, item) => sum + item.amount, 0);
  return {
    total: total(),
    pending: total("Pending"),
    approved: total("Approved"),
    reimbursed: total("Reimbursed"),
    pendingCount: expenses.filter((item) => item.status === "Pending").length,
  };
}
const csvCell = (value: unknown) => {
  let text = String(value ?? "");
  if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};
export function toCsv(expenses: Expense[]) {
  return [
    [
      "ID",
      "Merchant",
      "Employee",
      "Category",
      "Amount (INR)",
      "Date",
      "Status",
      "Purpose",
    ],
    ...expenses.map((item) => [
      item.id,
      item.merchant,
      item.employee,
      item.category,
      item.amount,
      item.date,
      item.status,
      item.description,
    ]),
  ]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
}
export function isExpense(value: unknown): value is Expense {
  if (!value || typeof value !== "object") return false;
  const e = value as Partial<Expense>;
  if (
    typeof e.id !== "string" ||
    typeof e.merchant !== "string" ||
    typeof e.employee !== "string" ||
    typeof e.description !== "string" ||
    typeof e.receipt !== "string" ||
    typeof e.amount !== "number" ||
    !Number.isFinite(e.amount) ||
    e.amount <= 0 ||
    !statuses.includes(e.status as Status) ||
    !categories.includes(e.category as Category) ||
    typeof e.date !== "string"
  )
    return false;
  const parsed = new Date(`${e.date}T12:00:00`);
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(e.date) &&
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === e.date &&
    Array.isArray(e.activity) &&
    e.activity.every(
      (a) =>
        a &&
        typeof a.id === "string" &&
        typeof a.label === "string" &&
        typeof a.at === "string" &&
        !Number.isNaN(Date.parse(a.at)),
    )
  );
}

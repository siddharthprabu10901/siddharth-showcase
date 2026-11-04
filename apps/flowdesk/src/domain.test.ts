import { describe, expect, it } from "vitest";
import {
  filterExpenses,
  isExpense,
  money,
  summary,
  toCsv,
  transition,
  validateDraft,
  type Draft,
  type Filters,
} from "./domain";
import { createSeed } from "./seed";

const draft: Draft = {
  merchant: "Figma",
  employee: "Siddharth P",
  category: "Software",
  amount: "1250.50",
  date: "2026-10-01",
  description: "Design software subscription",
  receipt: "",
};
const filters: Filters = {
  query: "",
  status: "All",
  category: "All",
  sort: "newest",
};
describe("expense validation", () => {
  it("accepts a complete draft including paise", () =>
    expect(validateDraft(draft, "2026-11-04")).toEqual({}));
  it.each(["", "0", "-1", "Infinity", "NaN", "10000001"])(
    "rejects invalid amount %s",
    (amount) => expect(validateDraft({ ...draft, amount }).amount).toBeTruthy(),
  );
  it("rejects more than two decimal places", () =>
    expect(validateDraft({ ...draft, amount: "1.234" }).amount).toMatch(
      /decimal/,
    ));
  it.each([
    "2026-02-30",
    "2026-13-01",
    "1999-12-31",
    "2026-11-05",
    "not-a-date",
  ])("rejects invalid date %s", (date) =>
    expect(validateDraft({ ...draft, date }, "2026-11-04").date).toBeTruthy(),
  );
  it("requires meaningful merchant, employee and purpose", () => {
    const errors = validateDraft({
      ...draft,
      merchant: " ",
      employee: " ",
      description: " ",
    });
    expect(Object.keys(errors)).toEqual([
      "merchant",
      "employee",
      "description",
    ]);
  });
});
describe("search, filters and summaries", () => {
  it("searches employee names without case or surrounding whitespace", () => {
    const result = filterExpenses(createSeed(), {
      ...filters,
      query: "  MAYA  ",
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.employee.includes("Maya"))).toBe(true);
  });
  it("combines category and status filters", () =>
    expect(
      filterExpenses(createSeed(), {
        ...filters,
        status: "Pending",
        category: "Software",
      }).map((item) => item.merchant),
    ).toEqual(["Figma"]));
  it("sorts numerically without changing the original array", () => {
    const seed = createSeed();
    const original = seed.map((item) => item.id);
    const result = filterExpenses(seed, { ...filters, sort: "amount-high" });
    expect(result[0].merchant).toBe("IndiGo");
    expect(seed.map((item) => item.id)).toEqual(original);
  });
  it("returns an empty result for an unmatched query", () =>
    expect(
      filterExpenses(createSeed(), { ...filters, query: "unmatched123" }),
    ).toEqual([]));
  it("counts and totals the known fictional seed", () =>
    expect(summary(createSeed())).toEqual({
      total: 59536,
      pending: 37799,
      approved: 9019,
      reimbursed: 11738,
      pendingCount: 6,
    }));
  it("handles an empty workspace", () => expect(summary([]).total).toBe(0));
  it("preserves paise in displayed amounts", () =>
    expect(money(1250.5)).toContain("1,250.50"));
});
describe("approval workflow", () => {
  it("approves and reimburses with an immutable activity history", () => {
    const original = createSeed().find((item) => item.status === "Pending")!;
    const approved = transition(original, "Approved");
    const reimbursed = transition(approved, "Reimbursed");
    expect(original.status).toBe("Pending");
    expect(reimbursed.status).toBe("Reimbursed");
    expect(reimbursed.activity.length).toBe(original.activity.length + 2);
    expect(reimbursed.activity[0].label).toMatch(/demo only/);
  });
  it("blocks skipping review", () =>
    expect(() => transition(createSeed()[0], "Reimbursed")).toThrow(
      /Cannot change/,
    ));
  it("requires a useful rejection reason", () =>
    expect(() => transition(createSeed()[0], "Rejected", "no")).toThrow(
      /6 characters/,
    ));
  it("records a trimmed rejection reason", () =>
    expect(
      transition(createSeed()[0], "Rejected", "  Duplicate invoice  ")
        .activity[0].label,
    ).toBe("Rejected: Duplicate invoice"));
  it("blocks changes after reimbursement", () =>
    expect(() =>
      transition(
        createSeed().find((item) => item.status === "Reimbursed")!,
        "Pending",
      ),
    ).toThrow());
});
describe("safe CSV and saved data", () => {
  it("escapes quotes, commas and newlines", () => {
    const csv = toCsv([
      {
        ...createSeed()[0],
        merchant: 'A "quoted", merchant',
        description: "Line one\nLine two",
      },
    ]);
    expect(csv).toContain('"A ""quoted"", merchant"');
    expect(csv).toContain('"Line one\nLine two"');
  });
  it.each(["=SUM(A1:A2)", " +123", "-100", "@name"])(
    "neutralizes spreadsheet formula text %s",
    (merchant) =>
      expect(toCsv([{ ...createSeed()[0], merchant }])).toContain(
        `"'${merchant}"`,
      ),
  );
  it("recognizes all seed records as valid saved data", () =>
    expect(createSeed().every(isExpense)).toBe(true));
  it.each([
    null,
    {},
    { ...createSeed()[0], amount: -10 },
    { ...createSeed()[0], status: "Unknown" },
    { ...createSeed()[0], date: "2026-02-30" },
    { ...createSeed()[0], activity: [{}] },
  ])("rejects corrupt saved data", (value) =>
    expect(isExpense(value)).toBe(false),
  );
});

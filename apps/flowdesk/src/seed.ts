import type { Category, Expense, Status } from "./domain";

// These fictional records are created relative to today so the demo stays useful.
const rows: [string, string, Category, number, Status, number, string][] = [
  [
    "Figma",
    "Maya Iyer",
    "Software",
    4500,
    "Pending",
    1,
    "Monthly design collaboration subscription",
  ],
  [
    "IndiGo",
    "Arjun Rao",
    "Travel",
    12850,
    "Pending",
    1,
    "Return flight for the customer workshop",
  ],
  [
    "Blue Tokai",
    "Neha Shah",
    "Meals",
    1850,
    "Approved",
    2,
    "Team lunch after the planning workshop",
  ],
  [
    "Notion",
    "Dhruv Menon",
    "Software",
    3200,
    "Reimbursed",
    2,
    "Documentation workspace for the product team",
  ],
  [
    "Coursera",
    "Maya Iyer",
    "Learning",
    3999,
    "Approved",
    3,
    "Accessibility and inclusive design course",
  ],
  [
    "IKEA",
    "Arjun Rao",
    "Office",
    8250,
    "Pending",
    3,
    "Ergonomic desk accessories for the office",
  ],
  [
    "Uber",
    "Neha Shah",
    "Travel",
    640,
    "Reimbursed",
    4,
    "Local travel to the partner office",
  ],
  [
    "Amazon Business",
    "Dhruv Menon",
    "Office",
    2460,
    "Pending",
    4,
    "Stationery and whiteboard supplies",
  ],
  [
    "Slack",
    "Maya Iyer",
    "Software",
    5200,
    "Reimbursed",
    5,
    "Monthly team communication subscription",
  ],
  [
    "Third Wave Coffee",
    "Arjun Rao",
    "Meals",
    980,
    "Rejected",
    5,
    "Duplicate claim from the workshop meeting",
  ],
  [
    "The Learning Co.",
    "Neha Shah",
    "Learning",
    7499,
    "Pending",
    6,
    "Frontend performance workshop registration",
  ],
  [
    "Indian Railways",
    "Dhruv Menon",
    "Travel",
    1820,
    "Approved",
    7,
    "Train ticket for the regional team meetup",
  ],
  [
    "Canva",
    "Maya Iyer",
    "Software",
    999,
    "Reimbursed",
    8,
    "Presentation assets for the quarterly review",
  ],
  [
    "Paper & Co.",
    "Neha Shah",
    "Office",
    1350,
    "Approved",
    9,
    "Printed materials for the onboarding session",
  ],
  [
    "Zomato",
    "Dhruv Menon",
    "Meals",
    2240,
    "Pending",
    10,
    "Dinner for the release support team",
  ],
  [
    "Microsoft",
    "Arjun Rao",
    "Software",
    1699,
    "Reimbursed",
    11,
    "Productivity software subscription",
  ],
];
export function createSeed(): Expense[] {
  return rows.map(
    (
      [merchant, employee, category, amount, status, days, description],
      index,
    ) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return {
        id: `EXP-${String(1048 - index).padStart(4, "0")}`,
        merchant,
        employee,
        category,
        amount,
        status,
        date: day,
        description,
        receipt: `Receipt-${1048 - index}.pdf`,
        activity: [
          {
            id: `seed-${index}`,
            label:
              status === "Pending"
                ? "Expense submitted for review"
                : status === "Rejected"
                  ? "Rejected: duplicate expense claim"
                  : `Expense ${status.toLowerCase()}`,
            at: `${day}T10:00:00.000Z`,
          },
        ],
      };
    },
  );
}

import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});
test("create, persist, edit, approve and reimburse an expense", async ({
  page,
}) => {
  await page.getByRole("button", { name: "New expense", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Merchant / vendor").fill("Interview Supplies");
  await dialog.getByLabel("Amount (INR)").fill("1250.50");
  await dialog
    .getByLabel("Business purpose")
    .fill("Materials for a fictional team workshop");
  await dialog.getByRole("button", { name: "Submit expense" }).click();
  await expect(dialog).toHaveCount(0);
  await page.reload();
  await page.getByLabel("Search expenses").fill("Interview Supplies");
  await page.getByRole("button", { name: /Interview Supplies EXP-/ }).click();
  await expect(dialog).toContainText("₹1,250.50");
  await dialog.getByRole("button", { name: "Edit", exact: true }).click();
  await dialog
    .getByLabel("Business purpose")
    .fill("Updated workshop materials for fictional staff");
  await dialog.getByRole("button", { name: "Save changes" }).click();
  await page.getByLabel("Search expenses").fill("Interview Supplies");
  await page.getByRole("button", { name: /Interview Supplies EXP-/ }).click();
  await dialog.getByRole("button", { name: "Approve expense" }).click();
  await expect(dialog).toContainText("Approved for reimbursement");
  await dialog.getByRole("button", { name: "Mark reimbursed" }).click();
  await expect(dialog).toContainText("Marked as reimbursed (demo only)");
});
test("validation, keyboard dismissal and empty search", async ({ page }) => {
  await page.getByRole("button", { name: "New expense", exact: true }).click();
  await page.getByRole("button", { name: "Submit expense" }).click();
  await expect(
    page.getByText("Enter a merchant with at least 2 characters."),
  ).toBeVisible();
  await expect(page.getByLabel("Merchant / vendor")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "New expense", exact: true }),
  ).toBeFocused();
  await page.getByLabel("Search expenses").fill("no-such-merchant-123");
  await expect(
    page.getByRole("heading", { name: "No expenses found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("button", { name: /Figma EXP-/ })).toBeVisible();
});
test("filters exported CSV and rejects with a reason", async ({ page }) => {
  await page.getByLabel("Filter by category").selectOption("Software");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^flowdesk-expenses-.*\.csv$/);
  await page.getByRole("button", { name: /Figma EXP-/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Reject", exact: true }).click();
  await dialog
    .getByLabel("Reason for rejection")
    .fill("Duplicate sample invoice");
  await dialog.getByRole("button", { name: "Confirm rejection" }).click();
  await expect(dialog).toContainText("Rejected: Duplicate sample invoice");
  await expect(
    dialog.getByRole("button", { name: "Confirm rejection" }),
  ).toHaveCount(0);
});
test("recovers invalid storage and keeps mobile content within the viewport", async ({
  page,
}) => {
  await page.evaluate(() =>
    localStorage.setItem("siddharth-showcase.flowdesk.expenses.v1", "{broken json"),
  );
  await page.reload();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

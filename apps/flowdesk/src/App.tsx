import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Download,
  FileText,
  Inbox,
  LayoutDashboard,
  Menu,
  Plus,
  Receipt,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
  X,
} from "lucide-react";
import {
  categories,
  dateLabel,
  filterExpenses,
  money,
  statuses,
  summary,
  toCsv,
  today,
  type Category,
  type Expense,
  type Filters,
  type View,
} from "./domain";
import { useExpenses } from "./useExpenses";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseDetail, StatusBadge } from "./ExpenseDetail";
import { Modal } from "./Modal";

const defaultFilters: Filters = {
  query: "",
  status: "All",
  category: "All",
  sort: "newest",
};
const categoryColors: Record<Category, string> = {
  Travel: "#417665",
  Software: "#96b5a5",
  Meals: "#e6c882",
  Office: "#aab7cf",
  Learning: "#d6a29b",
};

function CategoryChart({
  expenses,
  onSelect,
}: {
  expenses: Expense[];
  onSelect: (category: Category) => void;
}) {
  const sums = categories.map((category) => ({
    category,
    amount: expenses
      .filter(
        (item) => item.category === category && item.status !== "Rejected",
      )
      .reduce((sum, item) => sum + item.amount, 0),
  }));
  const total = sums.reduce((sum, item) => sum + item.amount, 0);
  let current = 0;
  const stops = sums.map((item) => {
    const start = current;
    current += total ? (item.amount / total) * 100 : 0;
    return `${categoryColors[item.category]} ${start}% ${current}%`;
  });
  return (
    <section className="category-card">
      <div className="section-heading">
        <div>
          <h2>Where it goes</h2>
          <p>Spend by category · excludes rejected</p>
        </div>
        <span className="subtle-icon">
          <Wallet size={18} />
        </span>
      </div>
      <div className="category-content">
        <div
          className="donut"
          role="img"
          aria-label={`Total non-rejected expenses: ${money(total)}`}
          style={{
            background: total
              ? `conic-gradient(${stops.join(",")})`
              : "#e9ece8",
          }}
        >
          <div>
            <span>DEMO SPEND</span>
            <strong>{money(total)}</strong>
            <small>
              {expenses.filter((item) => item.status !== "Rejected").length}{" "}
              expenses
            </small>
          </div>
        </div>
        <div className="category-legend">
          {sums.map((item) => (
            <button
              key={item.category}
              onClick={() => onSelect(item.category)}
              aria-label={`Filter ${item.category} expenses`}
            >
              <span
                className="legend-dot"
                style={{ background: categoryColors[item.category] }}
              />
              <span>{item.category}</span>
              <strong>
                {total ? Math.round((item.amount / total) * 100) : 0}%
              </strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const { items, save, changeStatus, approveMany, reset, storageWarning } =
    useExpenses();
  const [view, setView] = useState<View>("Overview");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [range, setRange] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState<Expense | "new" | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const ranged = useMemo(() => {
    if (range === "all") return items;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - Number(range));
    const date = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, "0")}-${String(cutoff.getDate()).padStart(2, "0")}`;
    return items.filter((item) => item.date >= date);
  }, [items, range]);
  const visible = useMemo(
    () =>
      filterExpenses(ranged, {
        ...filters,
        status: view === "Review queue" ? "Pending" : filters.status,
      }),
    [ranged, filters, view],
  );
  const stats = useMemo(() => summary(ranged), [ranged]);
  const pendingCount = items.filter((item) => item.status === "Pending").length;
  const pageSize = 6;
  const pages = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(page, pages);
  const shown = visible.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const selectable = shown
    .filter((item) => item.status === "Pending")
    .map((item) => item.id);
  const selectedPending = selected.filter((id) =>
    visible.some((item) => item.id === id && item.status === "Pending"),
  );
  const detail = items.find((item) => item.id === detailId);
  useEffect(() => {
    setPage(1);
    setSelected([]);
  }, [filters, range, view]);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(timeout);
  }, [toast]);
  const navigate = (next: View) => {
    setView(next);
    setFilters(defaultFilters);
    setMobileNav(false);
  };
  const toggle = (id: string) =>
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id],
    );
  function exportCsv() {
    if (!visible.length) {
      setToast("No matching expenses to export.");
      return;
    }
    const url = URL.createObjectURL(
      new Blob(["\ufeff", toCsv(visible)], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `flowdesk-expenses-${today()}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setToast(`Exported ${visible.length} matching expenses.`);
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to expenses
      </a>
      {mobileNav && (
        <button
          className="nav-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}
      <aside
        className={`sidebar ${mobileNav ? "is-open" : ""}`}
        aria-label="Workspace navigation"
      >
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            navigate("Overview");
          }}
        >
          <span className="brand-mark">
            f<span />
          </span>
          flowdesk<span className="brand-period">.</span>
        </a>
        <div className="workspace-switch">
          <span className="workspace-avatar">F</span>
          <div>
            <strong>Studio workspace</strong>
            <small>Personal project · INR</small>
          </div>
          <span className="workspace-status" />
        </div>
        <span className="nav-label">WORKSPACE</span>
        <nav>
          {(
            [
              { label: "Overview", icon: LayoutDashboard },
              { label: "All expenses", icon: Receipt },
              { label: "Review queue", icon: Inbox },
            ] as const
          ).map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${view === label ? "active" : ""}`}
              onClick={() => navigate(label)}
              aria-current={view === label ? "page" : undefined}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Review queue" && (
                <span className="nav-count">{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="demo-card">
            <span className="demo-tag">
              <span />A LITTLE HEADS-UP
            </span>
            <h3>A workspace to explore.</h3>
            <p>Try the full workflow. Every expense here is fictional.</p>
            <button onClick={() => setHelp(true)}>
              About this project
              <ArrowUpRight size={16} />
            </button>
          </div>
          <button className="nav-item help-link" onClick={() => setHelp(true)}>
            <CircleHelp size={18} />
            <span>Project guide</span>
          </button>
          <a
            className="profile-link"
            href="https://github.com/siddharthprabu10901"
            target="_blank"
            rel="noreferrer"
          >
            <span className="profile-avatar">SP</span>
            <span>
              <strong>Siddharth P</strong>
              <small>Project creator</small>
            </span>
            <ArrowUpRight size={15} />
          </a>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              className="icon-button mobile-only"
              aria-label="Open navigation"
              onClick={() => setMobileNav(true)}
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <strong>{view}</strong>
          </div>
          <div className="topbar-right">
            <span className="local-badge">
              <span />
              Saved on this browser
            </span>
            <button
              className="icon-button"
              aria-label="Open project guide"
              onClick={() => setHelp(true)}
            >
              <CircleHelp size={19} />
            </button>
            <span className="top-avatar" aria-label="Siddharth P">
              SP
            </span>
          </div>
        </header>
        <main id="main-content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">A CALMER WAY TO MANAGE SPEND</span>
              <h1>
                {view === "Overview"
                  ? "A clear view of every expense."
                  : view === "Review queue"
                    ? "Good decisions start here."
                    : "Every detail. All in one place."}
              </h1>
              <p>
                {view === "Review queue"
                  ? "Review the details and move pending expenses forward."
                  : "Less chasing receipts. More room for the work that matters."}
              </p>
            </div>
            <button className="button primary" onClick={() => setForm("new")}>
              <Plus size={18} />
              New expense
            </button>
          </div>
          {storageWarning && (
            <div className="storage-warning" role="alert">
              {storageWarning}
            </div>
          )}
          <section className="stats-grid" aria-label="Expense summary">
            <article className="stat-card">
              <span className="stat-icon green">
                <Wallet size={19} />
              </span>
              <div>
                <p>Total expenses</p>
                <h2>{money(stats.total)}</h2>
                <small>
                  {ranged.length} sample expenses{" "}
                  <span className="dot-divider">·</span> All statuses
                </small>
              </div>
            </article>
            <article className="stat-card">
              <span className="stat-icon amber">
                <FileText size={19} />
              </span>
              <div>
                <p>Awaiting review</p>
                <h2>{money(stats.pending)}</h2>
                <small>
                  <span className="tiny-dot amber-dot" />
                  {stats.pendingCount} expenses to review
                </small>
              </div>
            </article>
            <article className="stat-card">
              <span className="stat-icon blue">
                <CheckCheck size={19} />
              </span>
              <div>
                <p>Approved to reimburse</p>
                <h2>{money(stats.approved)}</h2>
                <small>Reviewed and ready for the next step</small>
              </div>
            </article>
            <article className="stat-card">
              <span className="stat-icon purple">
                <ArrowDownLeft size={19} />
              </span>
              <div>
                <p>Reimbursed</p>
                <h2>{money(stats.reimbursed)}</h2>
                <small>
                  <span className="tiny-dot green-dot" />
                  Completed in this demo
                </small>
              </div>
            </article>
          </section>
          {view === "Overview" && (
            <div className="insights-grid">
              <CategoryChart
                expenses={ranged}
                onSelect={(category) => {
                  setFilters({ ...defaultFilters, category });
                  setView("All expenses");
                }}
              />
              <section className="review-card">
                <div className="review-card-top">
                  <span className="review-icon">
                    <Inbox size={24} />
                  </span>
                  <span className="review-pill">REVIEW QUEUE</span>
                </div>
                <h2>
                  A small review.
                  <br />A smoother workday.
                </h2>
                <p>
                  {pendingCount
                    ? `${pendingCount} expenses are waiting for a decision. Open the queue to take a closer look.`
                    : "You’re all caught up. Every submitted expense has been reviewed."}
                </p>
                <button
                  className="button review-button"
                  onClick={() => navigate("Review queue")}
                >
                  Review expenses
                  <ArrowUpRight size={17} />
                </button>
                <div className="review-decoration" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </section>
            </div>
          )}
          <section className="expense-section" aria-labelledby="expenses-title">
            <div className="section-heading table-heading">
              <div>
                <h2 id="expenses-title">
                  {view === "Overview"
                    ? "Recent expenses"
                    : view === "Review queue"
                      ? "Pending expenses"
                      : "All expenses"}
                  <span className="count-pill">{visible.length}</span>
                </h2>
                <p>
                  {view === "Review queue"
                    ? "Check each expense before approving or rejecting it."
                    : "The details behind your team’s day-to-day spend."}
                </p>
              </div>
              <button
                className="button secondary export-button"
                onClick={exportCsv}
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
            <div className="filter-bar">
              <label className="search-input">
                <Search size={17} />
                <input
                  value={filters.query}
                  onChange={(event) =>
                    setFilters((previous) => ({
                      ...previous,
                      query: event.target.value,
                    }))
                  }
                  placeholder="Search merchant, employee, or ID…"
                  aria-label="Search expenses"
                />
                {filters.query && (
                  <button
                    className="icon-button"
                    aria-label="Clear search"
                    onClick={() =>
                      setFilters((previous) => ({ ...previous, query: "" }))
                    }
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
              <div className="filter-selects">
                <select
                  aria-label="Filter by status"
                  value={view === "Review queue" ? "Pending" : filters.status}
                  disabled={view === "Review queue"}
                  onChange={(event) =>
                    setFilters((previous) => ({
                      ...previous,
                      status: event.target.value,
                    }))
                  }
                >
                  <option value="All">All statuses</option>
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                <select
                  aria-label="Filter by category"
                  value={filters.category}
                  onChange={(event) =>
                    setFilters((previous) => ({
                      ...previous,
                      category: event.target.value,
                    }))
                  }
                >
                  <option value="All">All categories</option>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
                <select
                  aria-label="Filter by date"
                  value={range}
                  onChange={(event) => setRange(event.target.value)}
                >
                  <option value="all">All dates</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                </select>
                <label className="sort-select">
                  <SlidersHorizontal size={15} />
                  <select
                    aria-label="Sort expenses"
                    value={filters.sort}
                    onChange={(event) =>
                      setFilters((previous) => ({
                        ...previous,
                        sort: event.target.value,
                      }))
                    }
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="amount-high">Amount: high to low</option>
                    <option value="amount-low">Amount: low to high</option>
                  </select>
                </label>
              </div>
            </div>
            {selectedPending.length > 0 && (
              <div className="bulk-bar">
                <strong>
                  {selectedPending.length} pending expense
                  {selectedPending.length > 1 ? "s" : ""} selected
                </strong>
                <button
                  onClick={() => {
                    approveMany(selectedPending);
                    setSelected([]);
                    setToast(`Approved ${selectedPending.length} expenses.`);
                  }}
                >
                  <Check size={15} />
                  Approve selected
                </button>
                <button
                  className="icon-button"
                  aria-label="Clear selection"
                  onClick={() => setSelected([])}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th className="checkbox-cell">
                      <input
                        type="checkbox"
                        aria-label="Select all pending expenses on this page"
                        checked={
                          selectable.length > 0 &&
                          selectable.every((id) => selected.includes(id))
                        }
                        disabled={!selectable.length}
                        onChange={() =>
                          setSelected((previous) =>
                            selectable.every((id) => previous.includes(id))
                              ? previous.filter(
                                  (id) => !selectable.includes(id),
                                )
                              : [...new Set([...previous, ...selectable])],
                          )
                        }
                      />
                    </th>
                    <th>Merchant / expense</th>
                    <th>Submitted by</th>
                    <th>Category</th>
                    <th>Expense date</th>
                    <th className="amount-cell">Amount</th>
                    <th>Status</th>
                    <th className="row-action">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((item) => (
                    <tr
                      key={item.id}
                      className={
                        selected.includes(item.id) ? "selected-row" : ""
                      }
                    >
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          aria-label={`Select ${item.merchant} ${item.id}`}
                          disabled={item.status !== "Pending"}
                          checked={selected.includes(item.id)}
                          onChange={() => toggle(item.id)}
                        />
                      </td>
                      <td>
                        <button
                          className="merchant-button"
                          onClick={() => setDetailId(item.id)}
                        >
                          <span
                            className={`merchant-logo merchant-${item.category.toLowerCase()}`}
                          >
                            {item.merchant.slice(0, 1)}
                          </span>
                          <span>
                            <strong>{item.merchant}</strong>
                            <small>{item.id}</small>
                          </span>
                        </button>
                      </td>
                      <td>
                        <span className="employee-cell">
                          <span className="employee-avatar">
                            {item.employee
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          {item.employee}
                        </span>
                      </td>
                      <td>
                        <span className="category-label">
                          <span
                            style={{
                              background: categoryColors[item.category],
                            }}
                          />
                          {item.category}
                        </span>
                      </td>
                      <td className="date-cell">{dateLabel(item.date)}</td>
                      <td className="amount-cell">{money(item.amount)}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td>
                        <button
                          className="icon-button row-open"
                          aria-label={`View ${item.merchant} expense`}
                          onClick={() => setDetailId(item.id)}
                        >
                          <ArrowUpRight size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!shown.length && (
              <div className="empty-state">
                <span>
                  <Search size={27} />
                </span>
                <h3>No expenses found</h3>
                <p>Try a different search or clear your filters to see more.</p>
                <button
                  className="button secondary"
                  onClick={() => {
                    setFilters(defaultFilters);
                    setRange("all");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
            <footer className="table-footer">
              <span>
                Showing{" "}
                <strong>
                  {visible.length ? (currentPage - 1) * pageSize + 1 : 0}–
                  {Math.min(currentPage * pageSize, visible.length)}
                </strong>{" "}
                of <strong>{visible.length}</strong> expenses
              </span>
              <div className="pagination">
                <button
                  className="icon-button"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                <span>
                  Page {currentPage} of {pages}
                </span>
                <button
                  className="icon-button"
                  aria-label="Next page"
                  disabled={currentPage === pages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </footer>
          </section>
          <footer className="workspace-footer">
            <span>
              <ShieldCheck size={14} />
              Fictional data. Browser-local storage. No real payments.
            </span>
            <button onClick={() => setResetting(true)}>
              <RotateCcw size={13} />
              Reset demo
            </button>
          </footer>
        </main>
      </div>
      {form && (
        <ExpenseForm
          expense={form === "new" ? undefined : form}
          onClose={() => setForm(null)}
          onSave={(expense) => {
            save(expense);
            setForm(null);
            setFilters(defaultFilters);
            setRange("all");
            setPage(1);
            setView("All expenses");
            setToast(
              form === "new"
                ? "Expense submitted. It’s ready for review."
                : "Expense updated.",
            );
          }}
        />
      )}
      {detail && !form && (
        <ExpenseDetail
          expense={detail}
          onClose={() => setDetailId(null)}
          onEdit={() => {
            setDetailId(null);
            setForm(detail);
          }}
          onStatus={(status, reason) => {
            try {
              changeStatus(detail.id, status, reason);
              setToast(`Expense ${status.toLowerCase()}.`);
            } catch (error) {
              setToast(
                error instanceof Error
                  ? error.message
                  : "This change could not be saved.",
              );
            }
          }}
        />
      )}
      {help && (
        <Modal
          title="Meet Flowdesk"
          subtitle="A personal project, built to make frontend skills tangible."
          onClose={() => setHelp(false)}
          wide
        >
          <div className="guide-content">
            <div className="guide-intro">
              <BookOpen size={27} />
              <p>
                A small expense workspace with a complete interaction loop:
                submit, review, approve, and mark reimbursed. Every record is
                fictional.
              </p>
            </div>
            <div className="guide-grid">
              <article>
                <h3>Try the workflow</h3>
                <ol>
                  <li>
                    Create an expense with a merchant, amount and purpose.
                  </li>
                  <li>Search, sort and filter the expense table.</li>
                  <li>Open an expense to approve or reject it.</li>
                  <li>Approve several pending items together.</li>
                  <li>
                    Export the filtered results or refresh to check persistence.
                  </li>
                </ol>
              </article>
              <article>
                <h3>Under the surface</h3>
                <p>
                  React + TypeScript · custom hooks · derived state · validation
                  · native accessible dialogs · localStorage · CSV export · unit
                  and Playwright tests.
                </p>
                <h3>A deliberate scope</h3>
                <p>
                  This is a browser-only demo. There is no sign-in, backend,
                  team sync, file upload, or actual financial transaction.
                </p>
              </article>
            </div>
            <a
              className="button secondary"
              href="https://github.com/siddharthprabu10901"
              target="_blank"
              rel="noreferrer"
            >
              Siddharth on GitHub
              <ArrowUpRight size={16} />
            </a>
          </div>
        </Modal>
      )}
      {resetting && (
        <Modal
          title="Reset this demo workspace?"
          subtitle="This replaces local changes with the original fictional sample data."
          onClose={() => setResetting(false)}
        >
          <div className="reset-content">
            <p>
              Any expenses you created in this browser will be removed. Other
              browsers and devices are unaffected.
            </p>
          </div>
          <footer className="modal-footer">
            <button
              className="button secondary"
              onClick={() => setResetting(false)}
            >
              Keep my changes
            </button>
            <button
              className="button danger"
              onClick={() => {
                reset();
                setResetting(false);
                setDetailId(null);
                setSelected([]);
                setFilters(defaultFilters);
                setRange("all");
                setToast("Demo workspace reset.");
              }}
            >
              Reset demo
            </button>
          </footer>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          <span>{toast}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

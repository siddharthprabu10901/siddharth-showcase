import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clock3,
  FileText,
  Pencil,
  Wallet,
  X,
} from "lucide-react";
import { dateLabel, money, type Expense, type Status } from "./domain";
import { Modal } from "./Modal";

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`status status-${status.toLowerCase()}`}>
      <span />
      {status}
    </span>
  );
}
export function ExpenseDetail({
  expense,
  onClose,
  onEdit,
  onStatus,
}: {
  expense: Expense;
  onClose: () => void;
  onEdit: () => void;
  onStatus: (status: Status, reason?: string) => void;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  return (
    <Modal title="Expense details" subtitle={expense.id} onClose={onClose}>
      <div className="detail-body">
        <div className="detail-merchant">
          <div className="merchant-logo large">
            {expense.merchant.slice(0, 1)}
          </div>
          <div>
            <h3>{expense.merchant}</h3>
            <p>
              {expense.category} · {dateLabel(expense.date)}
            </p>
          </div>
          <StatusBadge status={expense.status} />
        </div>
        <div className="detail-amount">
          {money(expense.amount)}
          <span>INR · sample expense</span>
        </div>
        <dl className="detail-grid">
          <div>
            <dt>Submitted by</dt>
            <dd>{expense.employee}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{expense.category}</dd>
          </div>
        </dl>
        <div className="detail-purpose">
          <span className="eyebrow">BUSINESS PURPOSE</span>
          <p>{expense.description}</p>
        </div>
        <div className="receipt-reference">
          <FileText size={20} />
          <div>
            <strong>{expense.receipt || "No receipt reference"}</strong>
            <small>Reference only · no file attached</small>
          </div>
          <ArrowUpRight size={17} />
        </div>
        <h4 className="timeline-title">Activity</h4>
        <ol className="timeline">
          {expense.activity.map((item) => (
            <li key={item.id}>
              <Clock3 size={14} />
              <div>
                <strong>{item.label}</strong>
                <small>
                  {new Intl.DateTimeFormat("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(new Date(item.at))}
                </small>
              </div>
            </li>
          ))}
        </ol>
        {rejecting && expense.status === "Pending" && (
          <div className="rejection-box">
            <label htmlFor="rejection-reason">
              Reason for rejection
              <textarea
                id="rejection-reason"
                value={reason}
                onChange={(event) => {
                  setReason(event.target.value);
                  setError("");
                }}
                rows={3}
                maxLength={500}
                autoFocus
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "reason-error" : undefined}
              />
            </label>
            {error && (
              <p id="reason-error" className="field-error">
                {error}
              </p>
            )}
            <div>
              <button
                className="button secondary small"
                onClick={() => setRejecting(false)}
              >
                Cancel
              </button>
              <button
                className="button danger small"
                onClick={() => {
                  if (reason.trim().length < 6) {
                    setError("Add a reason with at least 6 characters.");
                    return;
                  }
                  onStatus("Rejected", reason);
                  setRejecting(false);
                }}
              >
                Confirm rejection
              </button>
            </div>
          </div>
        )}
      </div>
      <footer className="modal-footer detail-actions">
        {expense.status === "Pending" && (
          <>
            <button className="button secondary" onClick={onEdit}>
              <Pencil size={15} />
              Edit
            </button>
            <button
              className="button text-danger"
              onClick={() => setRejecting(true)}
              disabled={rejecting}
            >
              <X size={16} />
              Reject
            </button>
            <button
              className="button primary"
              onClick={() => onStatus("Approved")}
            >
              <Check size={16} />
              Approve expense
            </button>
          </>
        )}
        {expense.status === "Approved" && (
          <button
            className="button primary"
            onClick={() => onStatus("Reimbursed")}
          >
            <Wallet size={16} />
            Mark reimbursed
          </button>
        )}
        {(expense.status === "Rejected" || expense.status === "Reimbursed") && (
          <button className="button secondary" onClick={onClose}>
            Close details
          </button>
        )}
      </footer>
    </Modal>
  );
}

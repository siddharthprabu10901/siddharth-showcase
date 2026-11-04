import { professionalCaseStudies } from "./professional";

export const profile = {
  name: "Siddharth P",
  title: "Senior Software Engineer",
  company: "Odessa Technologies",
  location: "Coimbatore, Tamil Nadu",
  email: "siddharthprabu10901@gmail.com",
  linkedin: "https://www.linkedin.com/in/siddharth-p-07a967217",
  github: "https://github.com/siddharthprabu10901/siddharth-showcase",
  projectDemo:
    import.meta.env.VITE_FLOWDESK_URL ||
    "https://siddharthprabu10901.github.io/siddharth-showcase/flowdesk/",
  projectSource:
    import.meta.env.VITE_FLOWDESK_SOURCE_URL ||
    "https://github.com/siddharthprabu10901/siddharth-showcase/tree/main/apps/flowdesk",
};
export const caseStudies = {
  flowdesk: {
    number: "01",
    type: "Independent frontend project",
    title: "Flowdesk",
    subtitle: "An expense workflow, with every state considered.",
    summary:
      "An independent React and TypeScript expense workspace with validated forms, searchable tables and an approval workflow. Developed with AI assistance using original code and fictional sample data.",
    sections: [
      {
        title: "The problem",
        text: "Expense tools need more than a list of amounts. People need to find records quickly, correct mistakes, understand review status and know what happens next. Flowdesk brings those interactions into one small, focused application.",
      },
      {
        title: "The implementation",
        text: "Component-based React UI with TypeScript models, a custom persistence hook, derived filtering and summary state, native modal dialogs, and a reusable validation layer. Pending expenses can be edited, approved or rejected with a reason; approved items can be marked reimbursed in the demo.",
      },
      {
        title: "Quality and edge cases",
        text: "The project includes unit tests for filtering, validation, workflow rules and CSV export, plus Playwright scenarios for the main UI workflow. It handles empty results, malformed saved data, storage failures, invalid amounts, invalid dates and keyboard interaction.",
      },
      {
        title: "Project scope",
        text: "A browser-only frontend application with localStorage persistence and fictional records. Authentication, a shared backend, receipt uploads and real payment processing are outside its scope. React and TypeScript are project-based skills; my production frontend experience is in JavaScript, jQuery and Syncfusion.",
      },
    ],
    tags: ["React", "TypeScript", "Vite", "Playwright", "CSS"],
  },
  ...professionalCaseStudies,
};
export type CaseId = keyof typeof caseStudies;

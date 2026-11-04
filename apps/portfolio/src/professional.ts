export const professionalCaseStudies = {
  "cards": {
    "number": "02",
    "type": "Professional work · Odessa · May–Sep 2026",
    "title": "Configuration-driven card layouts",
    "subtitle": "A reusable framework capability from a customer-widget requirement.",
    "summary": "I built a generic grid type that renders card-based layouts from configuration, supporting enterprise origination interfaces without a separate JavaScript and CSS implementation for each screen.",
    "sections": [
      {
        "title": "The problem",
        "text": "An origination screen needed a customer/contact widget with collapsible sections, compact contact fields and address content. The wider need was a reusable layout capability that product teams could configure for different screens."
      },
      {
        "title": "The design decision",
        "text": "Following architecture review, I developed a generic grid type instead of a single-purpose widget. Its rows, columns and fields are defined through configuration, keeping screen-specific code out of the product implementation."
      },
      {
        "title": "My contribution",
        "text": "Implemented the card-layout rendering within the shared UI framework, worked through product and technical reviews, and prepared HTML/PDF specifications and configuration documentation."
      },
      {
        "title": "Validation and outcome",
        "text": "Product confirmed the required design was implemented and technical review completed in September 2026. Published component specifications and configuration guidance made the shared capability available for other product teams to reuse."
      }
    ],
    "tags": [
      "JavaScript",
      "jQuery",
      "Reusable components",
      "Configuration-driven UI"
    ]
  },
  "workflows": {
    "number": "03",
    "type": "Professional work · Odessa · 2024–2026",
    "title": "Safer navigation through complex workflows",
    "subtitle": "Configurable breadcrumbs, tab closing and wizard actions.",
    "summary": "I delivered shared navigation capabilities for enterprise leasing and finance screens. Breadcrumb implementation spanned four stories and seven pull requests, from October to December 2025.",
    "sections": [
      {
        "title": "The problem",
        "text": "Moving between related records opened more top-level tabs and made it difficult to return to the starting point. Wizard navigation also needed an extension point for product-specific validation and Previous/Next actions."
      },
      {
        "title": "Design decisions",
        "text": "Breadcrumb behaviour is enabled through configuration, with per-screen exclusions and unsaved-change checks. The design supports replacing the current tab content while retaining a trail, and opening related records in a new tab when needed."
      },
      {
        "title": "My contribution",
        "text": "Built breadcrumb layout and controls, enhanced close-tab workflows to expose pages with unsaved changes, added portal support and documented configuration. Separately enhanced wizard step mapping and configurable navigation actions so product rules could execute."
      },
      {
        "title": "Delivery and verification",
        "text": "Breadcrumb delivery covered four stories and seven pull requests across two framework repositories over approximately ten weeks. Core product QA passed in November 2025, with portal support and design-system fixes completed in December. I also addressed a post-release missing-trail edge case."
      },
      {
        "title": "What this demonstrates",
        "text": "Stateful navigation, data-loss prevention, backward-compatible rollout through configuration, phased delivery and follow-through after release."
      }
    ],
    "tags": [
      "JavaScript",
      "jQuery",
      "Navigation",
      "Unsaved-change protection"
    ]
  },
  "grids": {
    "number": "04",
    "type": "Professional work · Odessa · 2025–2026",
    "title": "Configurable enterprise grids",
    "subtitle": "Relevant actions and useful saved views for portal users.",
    "summary": "I implemented row-level action visibility and brought grid user preferences to portal screens, extending shared framework behaviour across different form types.",
    "sections": [
      {
        "title": "The user need",
        "text": "Grid context menus showed actions even when they did not apply to the selected record. Portal grids also lacked the column-management and saved-view capabilities available in core application grids."
      },
      {
        "title": "Analysis and proof of concept",
        "text": "Traced action visibility to a condition evaluated only when a form loaded. For portal preferences, a three-day proof of concept established the feasibility of porting column management and saved views and identified questions to resolve before implementation."
      },
      {
        "title": "My contribution",
        "text": "Extended action visibility to evaluate fields and conditional queries per selected record across browse, transaction and dialog forms. Added portal column search, ordering and show/hide controls, Save/Save As views, favourites and deletion of saved views."
      },
      {
        "title": "Validation and scope",
        "text": "Row-level action behaviour passed testing in September 2025. Portal grid preferences passed QA across transaction, browse and slide-in pages in June 2026. Documented the supported form types, configurations and limits so product teams could apply each capability correctly."
      }
    ],
    "tags": [
      "JavaScript",
      "jQuery",
      "Data grids",
      "Portal UI"
    ]
  },
  "formatting": {
    "number": "05",
    "type": "Professional work · Odessa · Feb–Jun 2026",
    "title": "Consistent regional money formatting",
    "subtitle": "Making the same value read consistently across inputs and grids.",
    "summary": "I investigated inconsistent monetary grouping, defined formatting rules for ten regions and delivered changes that aligned input, display and grid values.",
    "sections": [
      {
        "title": "The problem",
        "text": "The same amount appeared as 1,000,000 in an input and 10,00,000 in display fields or grids. This inconsistency was particularly visible for users working with Indian lakh/crore grouping."
      },
      {
        "title": "Root-cause analysis",
        "text": "Identified separate gaps in field grouping support and grid formatting. The initial defect was expanded into a requirement, with a regional comparison of grouping and separator rules."
      },
      {
        "title": "My contribution",
        "text": "Proposed a formatting standard covering ten regions, obtained regional-team alignment and provided test builds for validation. Implemented consistent treatment across input fields, display fields and grids."
      },
      {
        "title": "Validation and trade-offs",
        "text": "QA confirmed Indian, Western and European test cases, with matching values across inputs, display fields and grids. A follow-up request to format by currency instead of culture was analysed and deferred because of regression risk."
      }
    ],
    "tags": [
      "JavaScript",
      "Number formatting",
      "Internationalisation",
      "Root-cause analysis"
    ]
  },
  "upgrade": {
    "number": "06",
    "type": "Professional work · Odessa · Jun–Jul 2025",
    "title": "A planned Syncfusion component upgrade",
    "subtitle": "From dependency analysis to merge in seventeen days.",
    "summary": "I owned the Syncfusion upgrade from 25.1.39 to 29.2.10 across core application and portal dependencies, with an explicit upgrade procedure and targeted compatibility checks.",
    "sections": [
      {
        "title": "The problem",
        "text": "The shared framework used an older component-library version across the core application and portals. Upgrading required coordination between server-side packages, browser assets and controls with additional dependencies."
      },
      {
        "title": "Analysis before implementation",
        "text": "Inventoried the components and server packages in use, identified dependency considerations and recorded the extra resources required by the PDF viewer. Turned this analysis into a repeatable upgrade procedure."
      },
      {
        "title": "My contribution",
        "text": "Updated server libraries, JavaScript and CSS bundles, and licence configuration. Addressed PDF viewer styling compatibility and listed the workflow canvas, configuration spreadsheet and PDF viewer as impact areas for testing."
      },
      {
        "title": "Delivery and validation",
        "text": "Completed analysis through merge in seventeen days in June 2025. Follow-up testing in July confirmed the identified component areas worked. The seventeen-day figure covers analysis to merge, with validation described separately."
      }
    ],
    "tags": [
      "Syncfusion",
      "JavaScript",
      "Dependency upgrades",
      "Compatibility testing"
    ]
  }
} as const;

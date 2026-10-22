import type {
  ApprovalRequest,
  UserInputRequest,
} from "../../../packages/agent-ui/src/chat/requests.js";
export function permissionRequest(variant = "basic"): ApprovalRequest {
  const request: ApprovalRequest = {
    id: "permission-exact-1",
    kind: "read",
    title: "Request to read project files",
    origin: "runtime",
    details: {
      description:
        "I need to read files in your project to understand the documentation structure and relevant components.",
      resources: [
        { path: "/docs", kind: "folder", access: "Read access" },
        { path: "/src/components", kind: "folder", access: "Read access" },
        { path: "package.json", kind: "file", access: "Read access" },
      ],
    },
    options: [
      { id: "provider/once/7", label: "Allow once", kind: "allow-once" },
      { id: "provider/deny/8", label: "Deny", kind: "deny-once" },
    ],
  };
  if (variant === "terminal") {
    request.kind = "execute";
    request.title = "Request to run a terminal command";
    request.details = {
      description:
        "I need to install the search library using your package manager.",
      command: "npm install @example/search@latest",
      raw: '{"command":"npm install @example/search@latest","cwd":"/workspace/notes"}',
    };
  }
  if (variant === "scoped")
    request.options.push(
      {
        id: "provider/project/9",
        label: "Always allow in this project",
        kind: "allow-always",
        scopeLabel: "Always allow in this project",
      },
      {
        id: "provider/device/10",
        label: "Always allow on this device",
        kind: "allow-always",
        scopeLabel: "Always allow on this device",
      },
    );
  if (variant === "unknown-options")
    request.options = [
      {
        id: "opaque-vendor-choice",
        label: "Review with provider",
        kind: "unknown",
      },
    ];
  if (variant === "long")
    request.details!.resources!.push({
      path: "notes/research/architecture/component-and-workspace-integration/long-captured-reference-document.pdf",
      access: "Read access",
    });
  return request;
}
export function questionRequest(variant = "basic"): UserInputRequest {
  const request: UserInputRequest = {
    id: "question-exact-1",
    title: "Your input is needed",
    questions: [
      {
        id: "environment",
        header: "Environment",
        prompt: "Which environment should I configure for the search feature?",
        description:
          "This will help me set up the correct variables and configuration for your project.",
        allowOther: variant !== "restricted",
        optionLabels: "letters",
        inputMode: "textarea",
        placeholder: "Describe your own answer…",
        secret: false,
        options: [
          {
            id: "dev",
            label: "Development",
            description: "For active development and testing",
            value: "development",
          },
          {
            id: "stage",
            label: "Staging",
            description: "Pre-production environment",
            value: "staging",
          },
          {
            id: "prod",
            label: "Production",
            description: "Live environment for end users",
            value: "production",
          },
        ],
      },
    ],
  };
  const question = request.questions[0];
  if (["multiple", "multiple-other"].includes(variant)) {
    question.id = "components";
    question.header = "Components";
    question.prompt =
      "Which components should I include in the search implementation?";
    question.description =
      "Select all that apply. I will set up the necessary files and code for your project.";
    question.selectionMode = "multiple";
    question.options = [
      {
        id: "api",
        label: "Search API",
        description: "Backend search endpoint and logic",
      },
      {
        id: "ui",
        label: "UI components",
        description: "Search bar, results, and filters",
      },
      {
        id: "docs",
        label: "Documentation",
        description: "Usage examples and integration guide",
      },
      {
        id: "tests",
        label: "Tests",
        description: "Unit and integration tests",
      },
    ];
  }
  if (variant === "numbers") question.optionLabels = "numbers";
  if (variant === "no-labels") question.optionLabels = "none";
  if (["free-text", "character-count", "secret"].includes(variant)) {
    question.options = [];
    question.id = "requirements";
    question.header = "Requirements";
    question.prompt = "Please describe any search requirements or constraints.";
    question.description =
      "Include data sources, filters, performance needs, or specific use cases.";
    question.inputMode = "textarea";
    question.placeholder =
      "e.g. Search across documentation and code, with file type and date filters…";
    if (variant === "character-count") {
      question.maxLength = 1000;
      question.showCharacterCount = true;
    }
    if (variant === "secret") {
      question.secret = true;
      question.prompt = "Provide the temporary access token";
      question.description =
        "This answer stays transient and is never shown in the result.";
      question.placeholder = "Access token";
    }
  }
  if (variant === "several")
    request.questions.push({
      id: "constraints",
      header: "Constraints",
      prompt: "Any additional constraints?",
      inputMode: "textarea",
      required: false,
      allowOther: false,
      secret: false,
    });
  return request;
}

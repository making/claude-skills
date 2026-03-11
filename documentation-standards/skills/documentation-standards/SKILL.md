---
name: documentation-standards
description: >
  Enforces documentation standards when writing or updating README.md, CLAUDE.md, or other
  project documentation. Trigger whenever the user asks to write, update, or review any
  documentation file — including README, CLAUDE.md, architecture docs, or usage guides.
  Always consult this skill before producing any documentation for this project.
---

# Documentation Standards

Apply these rules every time you write or update project documentation.

---

## General Writing Style

- Write from the perspective of the **API user / caller** — explain how to use things, not how
  they are implemented internally.
- Include **plenty of code examples** to make usage easy to understand.
- Write **simply and honestly** — no excessive praise, no marketing language.
- No emojis or flashy expressions.
- No phrases like "powerful", "seamless", "easy-to-use", "delightful", etc.

---

## README.md

- **Specify when this library/tool should be used** — make the scope and intended use case clear
  upfront.
- Explain the "what" and "how" with concrete code examples.
- Keep it factual and concise.

---

## CLAUDE.md

CLAUDE.md is for context that helps Claude (and developers) understand the project. Be selective
about what goes in — only include content that is genuinely hard to recover from reading the code.

### What to include

- **Design decisions (Why)**: Rationale that is NOT obvious from reading the code. For example:
  why a particular approach was chosen over alternatives, known trade-offs accepted.
- **Development workflows (How to)**: Step-by-step procedures that span multiple files or tools
  (e.g., how to run the full test suite, how to build and publish, how to add a new feature).
- **Architecture overview**: High-level pipeline and orchestration that spans multiple classes —
  how the major pieces fit together.

### What NOT to include

- Implementation details that are recoverable from reading the source code
- Per-method or per-class behavior descriptions
- Regex or pattern explanations
- Anything that would go stale quickly as code changes

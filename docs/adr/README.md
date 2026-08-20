# Architecture Decision Records

This directory holds Architecture Decision Records (ADRs) for Polaris.

An ADR captures a significant architectural decision, the context that led to it, and the consequences of choosing one option over another.

## Format

Each ADR is a markdown file named `NNNN-<short-title>.md` where `NNNN` is a zero padded sequence number.

Use the template below. Status is one of: **Proposed**, **Accepted**, **Deprecated**, **Superseded by ADR NNNN**.

```markdown
# NNNN. Title

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR NNNN

## Context

What is the issue that we are seeing that motivates this decision or change?

## Decision

What is the change that we are proposing and/or doing?

## Consequences

What becomes easier or more difficult to do because of this change?

### Positive

- ...

### Negative

- ...

### Risks

- ...
```

## Process

1. Copy the template above into a new file `NNNN-<title>.md`.
2. Fill in the sections.
3. Set status to **Proposed**.
4. Discuss in the relevant PR or issue.
5. Update status to **Accepted** (or **Deprecated** / **Superseded**) once the team agrees.

## Reading order

ADRs are chronological. Later ADRs may supersede earlier ones. Always check the status field.

## When to write an ADR

Write an ADR when:

- Choosing a new technology or library
- Changing how the project is structured
- Establishing a pattern that future code should follow
- Reversing a previous decision

Do not write an ADR for minor implementation details or temporary experiments.

# Architecture Decision Records

## Purpose

This directory contains the Architecture Decision Records (ADRs) for the Book Catalog Service. Each ADR documents an architectural decision, the context in which it was made, the alternatives considered, the selected approach, and its consequences.

Together, these records form a decision log that helps developers understand the system's architecture, the reasoning behind its design, and the trade-offs associated with its technical choices.

## Decision Log

| ADR | Title | Status |
|---|---|---|
| [ADR-0001](0001-backend-architecture.md) | Backend Architecture and Component Boundaries | Proposed — pending review |
| [ADR-0002](0002-initial-storage-strategy.md) | Initial Storage Strategy | Proposed — pending review |
| [ADR-0003](0003-rest-api-contract-and-validation.md) | REST API Contract and Validation | Proposed — pending review |
| [ADR-0004](0004-automated-api-testing.md) | Automated API Testing Strategy | Proposed — pending review |

## ADR Lifecycle and Maintenance

ADRs document individual architectural decisions and the reasoning behind them. Each record begins with a **Proposed** status and remains proposed while awaiting review or while outstanding review actions remain unresolved.

Following review, an ADR may be:

- **Accepted:** The decision is approved and becomes part of the project's documented architectural direction.
- **Rejected:** The decision is not approved, and the reason for rejection is recorded in the ADR.
- **Superseded:** An earlier accepted decision has been replaced by a newer accepted ADR.

Accepted and rejected ADRs should be preserved as part of the project's decision history. Once an ADR has been accepted or rejected, its historical decision record should remain unchanged. If an established decision needs to change, create a new ADR documenting the replacement decision and its rationale. Mark the earlier ADR as superseded once the replacement decision has been accepted.

ADRs should be maintained in this version-controlled directory. Each record should identify its author, version, and changelog so that its history can be understood and reviewed.

## Scope

The current ADR collection documents four initial decisions:

1. **Backend architecture:** The structure and responsibilities of the backend components.
2. **Storage strategy:** The use of in-memory storage for the initial implementation and its limitations.
3. **REST API contract and validation:** Endpoint conventions, request validation, and error handling.
4. **Automated API testing:** The testing tools, test isolation strategy, and current testing approach.

Additional ADRs may be introduced when significant architectural decisions arise, including the selection of a persistent database, deployment architecture, security requirements, or substantial changes to the API contract or testing strategy.

Each new ADR should follow the project's established format and document the relevant context, alternatives, decision, consequences, compliance considerations, and change history.
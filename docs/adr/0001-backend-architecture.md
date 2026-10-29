# ADR-0001: Backend Architecture and Component Boundaries

## Status

Proposed — pending review

## Date

2026-10-29

## Owner

Syed Fardeen

## 1. Context

The Book Catalog Service provides an API for creating, retrieving, searching, and updating book records, including inventory quantities. The backend needs to be straightforward to understand, test, and extend while meeting the requirements of the current project.

An implementation that combines HTTP routing, request handling, business rules, and storage operations in a single module would be simple initially, but could become difficult to maintain as functionality grows. A layered structure introduces some organization while keeping the application relatively lightweight.

## 2. Decision Drivers

The architecture needs to:

- Separate HTTP handling from catalog business rules.
- Make API behavior testable without starting a separate network listener.
- Keep data access behind a distinct module boundary.
- Support future changes to storage and functionality without unnecessarily coupling every component.
- Avoid introducing complexity that is not justified by the project's current scope.

## 3. Alternatives Considered

### Option A: Layered Express Application

Separate routes, controllers, services, and data-access code, with application configuration separated from server startup.

**Advantages**
- Responsibilities are easier to understand and maintain.
- Business rules can be tested through the service layer and API.
- Storage changes have a defined area of the codebase in which to be implemented.
- The Express application can be imported by tests without starting the HTTP listener.

**Disadvantages**
- Requires more files than a single-module implementation.
- Contributors need to understand the responsibilities of each layer.

### Option B: Single-Module Express Application

Place routing, request handling, validation, business logic, and storage operations in one module.

**Advantages**
- Fewer files and minimal initial setup.
- Suitable for a very small prototype.

**Disadvantages**
- Responsibilities become coupled as features grow.
- Business rules are harder to isolate and test.
- Storage changes can affect unrelated request-handling code.

### Option C: More Extensive Framework or Architecture

Adopt a larger framework or introduce additional architectural layers.

**Advantages**
- May provide useful conventions for a substantially larger service.
- Can support more elaborate dependency management and modularity.

**Disadvantages**
- Adds concepts and setup that are not currently required.
- Increases implementation and maintenance overhead.

## 4. Decision

We use **Node.js with Express and a lightweight layered backend architecture**. Each component has a defined responsibility:

| Component | Responsibility |
|---|---|
| `src/routes/` | Maps HTTP methods and paths to controller functions. |
| `src/controllers/` | Processes request parameters and bodies, invokes services, and returns HTTP responses. |
| `src/services/` | Applies catalog business rules, validates book data, and coordinates operations. |
| `src/data/` | Provides the current book-storage operations. |
| `src/app.js` | Configures Express middleware, mounts routes, and exports the application for testing. |
| `src/server.js` | Starts the HTTP server. |
| `src/tests/` | Verifies API behavior through automated tests. |

The design remains intentionally small. It does not introduce a dependency-injection framework or additional architectural layers without a concrete requirement.

## 5. Consequences

### Positive Consequences

- Each component has a clear primary responsibility.
- API tests can import the application without starting the server separately.
- Validation and catalog rules are centralized in the service layer.
- The data module provides a clear starting point for future persistence work.
- The project structure is easier to navigate and explain during a technical review.

### Negative Consequences and Trade-offs

- The layered structure contains more files than a single-module prototype.
- The separation depends on contributors maintaining the intended boundaries.
- The current data module supports the in-memory implementation; it is not yet a fully developed abstraction for interchangeable database providers.
- A future database integration will require implementation and testing work rather than merely changing a configuration value.

## 6. Compliance and Implementation Considerations

- Keep route definitions focused on endpoint mapping.
- Place catalog validation and business rules in the service layer rather than duplicating them in controllers.
- Keep application configuration separate from server startup so tests can import the Express application safely.
- Add or update automated tests when API behavior or business rules change.
- If storage changes, preserve existing API behavior where practical and document intentional contract changes.

## 7. Review Triggers

Review this decision if the service grows to require independently deployed components, substantially more complex domain modules, or additional architectural mechanisms that justify their maintenance cost.

A change in storage technology should also be documented in its own ADR rather than silently changing the decision recorded here.

## 8. Compliance

The implementation should follow the architectural boundaries documented in this ADR. Changes to routing, validation, business rules, data access, or application startup should preserve the separation of responsibilities unless a documented architectural decision justifies a change.

Automated tests should be updated when API behavior or business rules change, and any significant departure from this architecture should be reviewed and documented.

## 9. Notes

- **Author:** Syed Fardeen
- **Version:** 0.1

### Changelog

- **Version 0.1 — 2026-10-28:** Initial proposed version.
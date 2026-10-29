# ADR-0004: Automated API Testing Strategy

## Status

Proposed — pending review

## Date

2026-10-28

## Owner

Syed Fardeen

## 1. Context

The Book Catalog Service exposes HTTP endpoints for managing book records and inventory. Automated tests help verify that these endpoints behave as expected and that validation rules prevent invalid data from entering the catalog.

Manually testing endpoints can be useful during development, but it does not provide a repeatable way to verify behavior after code changes. The project therefore needs a lightweight automated testing approach that can run locally and be repeated before changes are submitted for review.

The backend separates Express application configuration from server startup. This allows tests to exercise the application without needing to start a separate listening server.

## 2. Decision Drivers

- Verify the required API operations and important validation rules.
- Make tests repeatable and straightforward to run.
- Test actual HTTP requests and responses.
- Avoid requiring a running database or other external service for the initial test suite.
- Keep test setup understandable for contributors.
- Provide a foundation for broader testing as the service develops.

## 3. Alternatives Considered

### Option A: Jest and Supertest

Use Jest as the test runner and assertion framework, and Supertest to send HTTP requests to the Express application.

**Advantages**
- Supports automated tests and assertions in one workflow.
- Allows endpoints to be tested through HTTP requests without manually starting the server.
- Integrates with the existing Node.js project.
- Supports setup and cleanup between tests.

**Disadvantages**
- Adds development dependencies that must be maintained.
- Tests require deliberate setup when state is shared in memory.

### Option B: Manual Testing Only

Test endpoints manually using a browser or an API client.

**Advantages**
- Quick for exploratory testing during development.
- Requires no automated test code.

**Disadvantages**
- Results depend on the tester repeating the same steps correctly.
- Regressions can be missed.
- Does not provide a repeatable automated check.

### Option C: A Different Test Framework

Use another JavaScript test runner or a larger testing framework.

**Advantages**
- May provide alternative reporting, conventions, or integrations.

**Disadvantages**
- Requires evaluating and configuring another tool.
- Provides limited additional value for the current project's scope.

## 4. Decision

We use **Jest and Supertest** for automated backend API tests.

Tests import the Express application from `src/app.js` rather than starting the listener in `src/server.js`. This keeps the tests independent of a separately running HTTP server.

Because the current storage implementation is an in-memory store shared by the application, the test setup clears the book store before each test. This prevents records created by one test from affecting another test's expected results.

The test command is:

```bash
npm test
```

Jest runs in-band using the project's configured script, which keeps execution straightforward and avoids unnecessary parallelism for tests that share mutable in-memory state.

## 5. Current Test Coverage

The current suite verifies the following behaviors:

| Test area | Expected behavior |
|---|---|
| Book creation | A valid request creates a book successfully. |
| Book retrieval | A book can be retrieved by its ID. |
| Title search | The list endpoint can filter books by title. |
| Inventory update | A valid inventory quantity can be saved. |
| Negative inventory | A negative quantity is rejected. |
| Book detail update | Book details can be updated without changing the existing ID. |
| Missing book | A request for a nonexistent book returns `404 Not Found`. |
| Missing title | A book without a title is rejected. |
| Negative price | A negative price is rejected. |
| Fractional inventory | A non-integer inventory quantity is rejected. |

These tests focus on core functionality and representative error cases. They do not yet cover every validation rule, every search filter, or every possible malformed request.

## 6. Consequences

### Positive Consequences

- Core API behavior can be checked with a repeatable command.
- Request and response behavior is tested through HTTP-level interactions.
- Tests do not require a separately running server.
- Clearing the in-memory store helps prevent state leakage between tests.
- The test suite can grow alongside new endpoints and business rules.

### Negative Consequences and Limitations

- The current tests do not verify persistence across application restarts because the service has no persistent database.
- The test suite does not yet provide exhaustive validation or boundary-condition coverage.
- Tests that share an in-memory store require reliable setup and cleanup.
- The current suite does not verify database transactions, concurrent inventory updates, deployment configuration, or production infrastructure.

## 7. Future Testing Work

As the service develops, consider adding tests for:

1. Author and genre filtering, including combinations of filters.
2. Missing or malformed request bodies.
3. Invalid author arrays, ISBN values, and publication years.
4. Zero inventory and zero price boundary cases.
5. Updates containing invalid values or attempts to change a book's ID.
6. The behavior of unsupported HTTP methods and unknown routes.
7. Database integration and persistence, if a database is introduced.
8. Concurrent inventory updates, if concurrent access becomes a requirement.

New tests should be added when new requirements or bug fixes change the expected behavior of the API.

## 8. Implementation and Compliance

- Keep tests in the `src/tests` directory.
- Use Jest for test execution and assertions.
- Use Supertest to exercise the Express application.
- Clear the in-memory store before each test.
- Run `npm test` after backend changes and before submitting the implementation for review.
- Update this ADR if the testing strategy changes significantly.

## 9. Review Triggers

Revisit this decision if the project adopts a persistent database, requires integration or end-to-end testing, introduces concurrent operations, or needs additional test infrastructure.

A significant change in testing tools or strategy should be documented in a new ADR or an appropriately reviewed revision while preserving the project's decision history.

## 10. Notes and Change History

- **Version:** 0.1
- **Changelog:**
  - 0.1 — 2026-10-28: Initial proposed version.
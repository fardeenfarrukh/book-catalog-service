# ADR-0002: Initial Storage Strategy

## Status

Proposed — pending review

## Date

2026-10-29

## Owner

Syed Fardeen

## 1. Context

The Book Catalog Service needs to store book records while supporting creation, retrieval, searching, book-detail updates, and inventory updates.

The current implementation stores records in a JavaScript `Map` within `src/data/bookStore.js`. This approach requires no external infrastructure and keeps the initial implementation easy to run and test.

However, in-memory storage is not durable. Records are lost when the Node.js process stops or restarts, and separate application instances do not share the same catalog. These limitations must be considered when deciding whether the implementation is suitable for a particular deployment.

## 2. Decision Drivers

The storage strategy needs to:

- Support the required catalog operations.
- Keep the initial local setup straightforward.
- Allow repeatable automated testing.
- Make storage limitations explicit.
- Provide a clear path toward persistent storage if project requirements demand it.
- Avoid selecting and configuring a database before its requirements and operational constraints have been evaluated.

## 3. Alternatives Considered

### Option A: In-Memory Storage Using a JavaScript `Map`

Store book records in the running Node.js process, using each book's ID as the key.

**Advantages**
- Requires no separate database installation or service.
- Keeps local development and testing simple.
- Supports straightforward record lookup and updates.
- Makes it easy to clear stored records between tests.

**Disadvantages**
- All records are lost when the process restarts.
- Multiple service instances do not share a common catalog.
- Does not provide database transactions, durable constraints, backups, or recovery.
- Is unsuitable when catalog records must survive process failure or deployment.

### Option B: Persistent Database

Store book records in a database that retains data independently of the application process.

**Advantages**
- Records can survive application restarts.
- Database constraints can help enforce data integrity.
- Transactions can support consistent updates, including inventory operations.
- A shared database can support multiple application instances.

**Disadvantages**
- Requires database configuration, schema management, and connection handling.
- Adds migration, security, testing, and operational responsibilities.
- Requires a deliberate database selection based on the application's needs.

### Option C: File-Based Persistence

Store records in files on disk rather than in process memory.

**Advantages**
- Can preserve records across process restarts.
- May avoid operating a separate database service for a small local application.

**Disadvantages**
- Concurrent writes and data recovery require careful handling.
- Querying and maintaining data integrity become more complicated as requirements grow.
- Does not automatically provide the transaction and concurrency guarantees expected from a database.

## 4. Decision

For the initial implementation, we use **an in-memory JavaScript `Map`** and defer persistent storage until its requirements have been evaluated.

This decision prioritizes simple setup, a small implementation footprint, and focused development of the API and business rules.

The in-memory store is a development-stage choice, not a claim that volatile storage is appropriate for production use. The project documentation must clearly state that records are lost when the application process stops or restarts.

No particular database is selected by this ADR.

## 5. Consequences

### Positive Consequences

- The backend can run without external database infrastructure.
- Developers can start the service with minimal configuration.
- Tests can reset the store between cases to prevent data from leaking across tests.
- Storage behavior remains easy to inspect during development.

### Negative Consequences and Trade-offs

- The service does not retain catalog changes across restarts.
- Separate application instances cannot share the same in-memory records.
- The current implementation does not provide durable database constraints, transactional guarantees, or backup and recovery capabilities.
- The service cannot safely rely on its current store for a production catalog requiring persistence.
- A future database integration will require additional implementation, configuration, and testing.

## 6. Follow-Up Work for Persistent Storage

If durable storage becomes a requirement, evaluate the following before selecting a database:

1. **Data integrity:** Determine how book IDs and ISBNs should be constrained and whether ISBN uniqueness is required.
2. **Inventory consistency:** Establish how concurrent inventory updates should be handled and whether transactions are necessary.
3. **Database selection:** Compare suitable database technologies against the application's data model, deployment environment, and operational requirements.
4. **Schema management:** Define how schema changes will be versioned and applied.
5. **Configuration and security:** Determine how database connections and credentials will be configured and protected.
6. **Testing:** Add integration tests that verify persistence, validation, and relevant transaction behavior.
7. **Operations:** Define backup, recovery, monitoring, and deployment expectations where required.

PostgreSQL may be evaluated as a candidate, but its selection requires a separate decision based on these requirements.

## 7. Review Triggers

Revisit this decision before deploying the service for real catalog data, requiring records to survive application restarts, running multiple application instances, or relying on consistent concurrent inventory updates.

When a database is selected, record that decision in a separate ADR and update the implementation and project documentation accordingly.

## 8. Compliance

The implementation and project documentation must accurately describe the limitations of the in-memory storage strategy.

- Keep storage operations within the designated data-access module.
- Ensure automated tests can reset the in-memory store when required for test isolation.
- Do not represent the current implementation as providing persistence, database transactions, durable constraints, or recovery capabilities.
- Evaluate persistence, data integrity, inventory consistency, and operational requirements before selecting a database.
- Document a future database selection in a separate ADR and update the implementation and documentation to reflect the approved decision.

## 9. Notes

- **Author:** Syed Fardeen
- **Version:** 0.1

### Changelog

- **Version 0.1 — 2026-10-28:** Initial proposed version.
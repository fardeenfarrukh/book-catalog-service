const request = require("supertest");
const app = require("../app");
const bookStore = require("../data/bookStore");

// Use the same valid book data for tests that need to create a book.
const sampleBook = {
  title: "The Hobbit",
  authors: ["J.R.R. Tolkien"],
  isbn: "9780547928227",
  genre: "Fantasy",
  price: 19.99,
  publicationYear: 1937,
  inventoryQuantity: 10,
};

// Start each test with an empty store so tests do not affect each other.
beforeEach(() => {
  bookStore.clearBooks();
});

describe("Book Catalog API", () => {
  // Check that a new book can be created and receives an ID.
  test("creates a book", async () => {
    const response = await request(app)
      .post("/books")
      .send(sampleBook);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("The Hobbit");
    expect(response.body.id).toBeDefined();
  });

  // Check that a saved book can be retrieved using its ID.
  test("gets a book by ID", async () => {
    const created = await request(app)
      .post("/books")
      .send(sampleBook);

    const response = await request(app)
      .get(`/books/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
    expect(response.body.title).toBe("The Hobbit");
  });

  // Check that searching by title returns matching books.
  test("searches for books by title", async () => {
    await request(app).post("/books").send(sampleBook);

    const response = await request(app).get("/books?title=hobbit");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("The Hobbit");
  });

  // Check that inventory can be updated to a valid quantity.
  test("updates inventory", async () => {
    const created = await request(app)
      .post("/books")
      .send(sampleBook);

    const response = await request(app)
      .patch(`/books/${created.body.id}/inventory`)
      .send({ inventoryQuantity: 15 });

    expect(response.status).toBe(200);
    expect(response.body.inventoryQuantity).toBe(15);
  });

  // Check that negative inventory is rejected.
  test("rejects negative inventory", async () => {
    const created = await request(app)
      .post("/books")
      .send(sampleBook);

    const response = await request(app)
      .patch(`/books/${created.body.id}/inventory`)
      .send({ inventoryQuantity: -5 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Inventory quantity must be a non-negative integer."
    );
  });

  // Check that updating book details keeps the original ID.
  test("updates book details without changing its ID", async () => {
    const created = await request(app)
      .post("/books")
      .send(sampleBook);

    const response = await request(app)
      .put(`/books/${created.body.id}`)
      .send({
        ...sampleBook,
        title: "The Hobbit - Revised Edition",
        price: 21.99,
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
    expect(response.body.title).toBe("The Hobbit - Revised Edition");
    expect(response.body.price).toBe(21.99);
  });

  // Check that unexpected fields are ignored and the ID cannot be changed.
  test("ignores unexpected fields when updating a book", async () => {
    const created = await request(app)
      .post("/books")
      .send(sampleBook);

    const response = await request(app)
      .put(`/books/${created.body.id}`)
      .send({
        ...sampleBook,
        id: "attempted-id-change",
        admin: true,
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
    expect(response.body.admin).toBeUndefined();

    // Confirm the saved book also contains no unexpected field.
    const retrieved = await request(app)
      .get(`/books/${created.body.id}`);

    expect(retrieved.status).toBe(200);
    expect(retrieved.body.id).toBe(created.body.id);
    expect(retrieved.body.admin).toBeUndefined();
  });

  // Check that requesting a missing book returns a 404 response.
  test("returns 404 when a book does not exist", async () => {
    const response = await request(app).get("/books/missing-book");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Book not found.");
  });

  // Check that a book cannot be created without a title.
  test("rejects a book with a missing title", async () => {
    const response = await request(app)
      .post("/books")
      .send({
        ...sampleBook,
        title: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Title is required.");
  });

  // Check that a missing book object is rejected.
  test("rejects a missing book object", async () => {
    const response = await request(app)
      .post("/books")
      .send(null);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "A valid book object is required."
    );
  });

  // Check that a book cannot have a negative price.
  test("rejects a book with a negative price", async () => {
    const response = await request(app)
      .post("/books")
      .send({
        ...sampleBook,
        price: -5,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Price must be a valid non-negative number."
    );
  });

  // Check that inventory must be a whole number.
  test("rejects a book with a fractional inventory quantity", async () => {
    const response = await request(app)
      .post("/books")
      .send({
        ...sampleBook,
        inventoryQuantity: 2.5,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Inventory quantity must be a non-negative integer."
    );
  });
});

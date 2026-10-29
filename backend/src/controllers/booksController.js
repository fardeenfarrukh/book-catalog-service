const booksService = require("../services/booksService");

// Return all books, with optional search filters.
function getBooks(req, res) {
  const filters = {
    title: req.query.title,
    author: req.query.author,
    genre: req.query.genre,
  };

  res.json(booksService.getBooks(filters));
}

// Return one book using its ID.
function getBookById(req, res) {
  const book = booksService.getBookById(req.params.id);

  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }

  res.json(book);
}

// Validate and create a new book.
function createBook(req, res) {
  const result = booksService.createBook(req.body);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json(result.book);
}

// Update the details of an existing book.
function updateBook(req, res) {
  const result = booksService.updateBook(req.params.id, req.body);

  if (result.error) {
    const status = result.error === "Book not found." ? 404 : 400;
    return res.status(status).json({ error: result.error });
  }

  res.json(result.book);
}

// Update the stock quantity of an existing book.
function updateInventory(req, res) {
  const result = booksService.updateInventory(
    req.params.id,
    req.body?.inventoryQuantity
  );

  if (result.error) {
    const status = result.error === "Book not found." ? 404 : 400;
    return res.status(status).json({ error: result.error });
  }

  res.json(result.book);
}

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  updateInventory,
};

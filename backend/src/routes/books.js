const express = require("express");
const booksController = require("../controllers/booksController");

const router = express.Router();

// Get all books, with optional title, author, and genre filters.
router.get("/", booksController.getBooks);

// Get a specific book by its ID.
router.get("/:id", booksController.getBookById);

// Add a new book.
router.post("/", booksController.createBook);

// Update all details of an existing book.
router.put("/:id", booksController.updateBook);

// Update the inventory quantity of an existing book.
router.patch("/:id/inventory", booksController.updateInventory);

module.exports = router;

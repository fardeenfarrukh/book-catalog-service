const { randomUUID } = require("crypto");
const bookStore = require("../data/bookStore");

// Get all books from storage, then apply any filters provided by the request.
function getBooks(filters = {}) {
  let books = bookStore.getAllBooks();

  // Search titles without worrying about uppercase or lowercase letters.
  if (filters.title) {
    books = books.filter((book) =>
      book.title.toLowerCase().includes(filters.title.toLowerCase())
    );
  }

  // Search all authors, since a book can have more than one author.
  if (filters.author) {
    books = books.filter((book) =>
      book.authors.some((author) =>
        author.toLowerCase().includes(filters.author.toLowerCase())
      )
    );
  }

  // Filter by an exact genre match, ignoring letter case.
  if (filters.genre) {
    books = books.filter(
      (book) => book.genre.toLowerCase() === filters.genre.toLowerCase()
    );
  }

  return books;
}

// Find a book using its ID. The store returns undefined if it isn't found.
function getBookById(id) {
  return bookStore.getBookById(id);
}

// Check the submitted book data before allowing it to be saved.
function validateBook(book) {
  // The request must contain a book object.
  if (!book || typeof book !== "object" || Array.isArray(book)) {
    return "A valid book object is required.";
  }

  // A title must be provided and cannot contain only whitespace.
  if (!book.title || typeof book.title !== "string" || !book.title.trim()) {
    return "Title is required.";
  }

  // Require at least one author, and make sure each author has a valid name.
  if (
    !Array.isArray(book.authors) ||
    book.authors.length === 0 ||
    book.authors.some(
      (author) => typeof author !== "string" || !author.trim()
    )
  ) {
    return "At least one valid author is required.";
  }

  // ISBN must be provided as a non-empty string.
  if (!book.isbn || typeof book.isbn !== "string" || !book.isbn.trim()) {
    return "ISBN is required.";
  }

  // Genre must be provided as a non-empty string.
  if (!book.genre || typeof book.genre !== "string" || !book.genre.trim()) {
    return "Genre is required.";
  }

  // Price must be a number and cannot be negative or infinite.
  if (
    typeof book.price !== "number" ||
    !Number.isFinite(book.price) ||
    book.price < 0
  ) {
    return "Price must be a valid non-negative number.";
  }

  // Publication year must be a whole number between 1 and the current year.
  if (
    !Number.isInteger(book.publicationYear) ||
    book.publicationYear < 1 ||
    book.publicationYear > new Date().getFullYear()
  ) {
    return "Publication year must be a valid year.";
  }

  // Inventory must be a whole number of zero or more.
  if (
    !Number.isInteger(book.inventoryQuantity) ||
    book.inventoryQuantity < 0
  ) {
    return "Inventory quantity must be a non-negative integer.";
  }

  // Return null when every validation check passes.
  return null;
}

// Validate the submitted data, create an ID, and save the new book.
function createBook(bookData) {
  const error = validateBook(bookData);

  // Stop here if any required field is invalid.
  if (error) {
    return { error };
  }

  // Generate a unique ID on the server instead of trusting client input.
  const book = {
    id: randomUUID(),
    title: bookData.title.trim(),
    authors: bookData.authors.map((author) => author.trim()),
    isbn: bookData.isbn.trim(),
    genre: bookData.genre.trim(),
    price: bookData.price,
    publicationYear: bookData.publicationYear,
    inventoryQuantity: bookData.inventoryQuantity,
  };

  // Store the new book and return it to the caller.
  bookStore.addBook(book);
  return { book };
}

// Replace a book's details while keeping its existing ID.
function updateBook(id, bookData) {
  const existingBook = bookStore.getBookById(id);

  // Do not update a book that doesn't exist.
  if (!existingBook) {
    return { error: "Book not found." };
  }

  // Apply the same validation rules used when creating a book.
  const error = validateBook(bookData);

  if (error) {
    return { error };
  }

  // Keep only the supported fields and preserve the existing ID.
  const updatedBook = {
    id: existingBook.id,
    title: bookData.title.trim(),
    authors: bookData.authors.map((author) => author.trim()),
    isbn: bookData.isbn.trim(),
    genre: bookData.genre.trim(),
    price: bookData.price,
    publicationYear: bookData.publicationYear,
    inventoryQuantity: bookData.inventoryQuantity,
  };

  // Save the updated details and return the result.
  bookStore.updateBook(id, updatedBook);
  return { book: updatedBook };
}

// Change the stock quantity without replacing the other book details.
function updateInventory(id, quantity) {
  const book = bookStore.getBookById(id);

  // Return an error if the requested book doesn't exist.
  if (!book) {
    return { error: "Book not found." };
  }

  // Inventory must be a whole number and cannot go below zero.
  if (!Number.isInteger(quantity) || quantity < 0) {
    return { error: "Inventory quantity must be a non-negative integer." };
  }

  // Copy the existing book and change only its inventory quantity.
  const updatedBook = {
    ...book,
    inventoryQuantity: quantity,
  };

  bookStore.updateBook(id, updatedBook);
  return { book: updatedBook };
}

// Allow the controller to use these service functions.
module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  updateInventory,
};

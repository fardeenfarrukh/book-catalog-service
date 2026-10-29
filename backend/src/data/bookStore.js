const books = new Map(); // Stores books in memory, using each book's ID as the key.

function getAllBooks() {
  // Return all stored books as an array.
  return Array.from(books.values());
}

function getBookById(id) {
  // Find a book by its ID. Returns undefined if it doesn't exist.
  return books.get(id);
}

function addBook(book) {
  // Store a new book using its ID and return the saved book.
  books.set(book.id, book);
  return book;
}

function updateBook(id, updatedBook) {
  // Do not create a new entry if the ID does not already exist.
  if (!books.has(id)) {
    return undefined;
  }

  // Replace the existing book's details.
  books.set(id, updatedBook);
  return updatedBook;
}

function deleteBook(id) {
  // Remove a book by ID. Returns false if no book was found.
  return books.delete(id);
}

function clearBooks() {
  // Remove all books, mainly to reset the storage between tests.
  books.clear();
}

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  clearBooks,
};

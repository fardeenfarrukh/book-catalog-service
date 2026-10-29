import { useState } from "react";
import "./App.css";

const sampleBooks = [
  {
    id: "BK-001",
    title: "The Hobbit",
    authors: ["J.R.R. Tolkien"],
    isbn: "9780547928227",
    genre: "Fantasy",
    price: 19.99,
    publicationYear: 1937,
    inventoryQuantity: 12,
  },
  {
    id: "BK-002",
    title: "1984",
    authors: ["George Orwell"],
    isbn: "9780451524935",
    genre: "Fiction",
    price: 14.99,
    publicationYear: 1949,
    inventoryQuantity: 7,
  },
  {
    id: "BK-003",
    title: "Dune",
    authors: ["Frank Herbert"],
    isbn: "9780441172719",
    genre: "Science Fiction",
    price: 18.5,
    publicationYear: 1965,
    inventoryQuantity: 0,
  },
];

const emptyForm = {
  title: "",
  authors: "",
  isbn: "",
  genre: "",
  price: "",
  publicationYear: "",
  inventoryQuantity: "",
};

function App() {
  const [books, setBooks] = useState(sampleBooks);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const genres = [
    "All",
    ...new Set(books.map((book) => book.genre)),
  ];

  const filteredBooks = books.filter((book) => {
    const term = search.toLowerCase().trim();

    const matchesSearch =
      book.title.toLowerCase().includes(term) ||
      book.authors.join(", ").toLowerCase().includes(term) ||
      book.isbn.includes(term);

    return matchesSearch && (genre === "All" || book.genre === genre);
  });

  function handleAddBook(event) {
    event.preventDefault();

    const newBook = {
      ...form,
      id: `BK-${Date.now()}`,
      authors: form.authors.split(",").map((author) => author.trim()),
      price: Number(form.price),
      publicationYear: Number(form.publicationYear),
      inventoryQuantity: Number(form.inventoryQuantity),
    };

    setBooks((current) => [...current, newBook]);
    setForm(emptyForm);
    setShowForm(false);
    setMessage("Book added to the demo.");
  }

  function changeInventory(id, amount) {
    setBooks((current) =>
      current.map((book) =>
        book.id === id
          ? {
              ...book,
              inventoryQuantity: Math.max(
                0,
                book.inventoryQuantity + amount
              ),
            }
          : book
      )
    );
  }

  return (
    <main className="container">
      <header>
        <h1>Book Catalog</h1>
        <p>Manage book details and inventory.</p>
      </header>

      <section className="toolbar">
        <input
          aria-label="Search books"
          placeholder="Search by title, author, or ISBN"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          aria-label="Filter by genre"
          value={genre}
          onChange={(event) => setGenre(event.target.value)}
        >
          {genres.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All genres" : item}
            </option>
          ))}
        </select>

        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add book"}
        </button>
      </section>

      {message && <p role="status">{message}</p>}

      {showForm && (
        <form className="book-form" onSubmit={handleAddBook}>
          <h2>Add a book</h2>

          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>

          <label>
            Author(s), separated by commas
            <input
              required
              value={form.authors}
              onChange={(e) => setForm({ ...form, authors: e.target.value })}
            />
          </label>

          <label>
            ISBN
            <input
              required
              value={form.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })}
            />
          </label>

          <label>
            Genre
            <input
              required
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
            />
          </label>

          <label>
            Price ($)
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </label>

          <label>
            Publication year
            <input
              required
              type="number"
              min="1"
              max={new Date().getFullYear()}
              value={form.publicationYear}
              onChange={(e) =>
                setForm({ ...form, publicationYear: e.target.value })
              }
            />
          </label>

          <label>
            Initial inventory
            <input
              required
              type="number"
              min="0"
              step="1"
              value={form.inventoryQuantity}
              onChange={(e) =>
                setForm({ ...form, inventoryQuantity: e.target.value })
              }
            />
          </label>

          <button type="submit">Save book</button>
        </form>
      )}

      <section className="table-section">
        <h2>Books ({filteredBooks.length})</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title and author</th>
                <th>ISBN</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Adjust stock</th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>
                    <strong>{book.title}</strong>
                    <br />
                    {book.authors.join(", ")}
                    <br />
                    <small>{book.id}</small>
                  </td>
                  <td>{book.isbn}</td>
                  <td>{book.genre}</td>
                  <td>{book.publicationYear}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    {book.inventoryQuantity === 0
                      ? "Out of stock"
                      : book.inventoryQuantity}
                  </td>
                  <td>
                    <button
                      aria-label={`Decrease stock for ${book.title}`}
                      disabled={book.inventoryQuantity === 0}
                      onClick={() => changeInventory(book.id, -1)}
                    >
                      −
                    </button>{" "}
                    <button
                      aria-label={`Increase stock for ${book.title}`}
                      onClick={() => changeInventory(book.id, 1)}
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan="7">No matching books found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer>
        Demo only — data is temporary and not connected to the backend yet.
      </footer>
    </main>
  );
}

export default App;

const express = require("express");
const cors = require("cors");
const booksRouter = require("./routes/books");

const app = express();

// Allow the frontend to send requests to the backend.
app.use(cors());

// Allow Express to read JSON request bodies.
app.use(express.json());

// Show basic information when someone opens the API's root URL.
app.get("/", (req, res) => {
  res.json({
    status: "Backend alive",
    service: "Book Catalog Service",
    endpoints: [
      "GET /books",
      "GET /books/:id",
      "POST /books",
      "PUT /books/:id",
      "PATCH /books/:id/inventory",
    ],
  });
});

// Connect all book routes under the /books path.
app.use("/books", booksRouter);

module.exports = app;

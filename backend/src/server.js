const app = require("./app");

const port = process.env.PORT || 5000;

// Start the backend server.
app.listen(port, () => {
  console.log(`Book Catalog Service running at http://localhost:${port}`);
});

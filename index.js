import express, { request } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book notes",
  password: "123456",
  port: 5434,
});

db.connect();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function get_image(book_title) {
  try {
    // const book_title = "Atomic Habits";
    const id_response = await axios.get(
      `https://openlibrary.org/search.json?title=${book_title}`
    );
    const result = id_response.data;
    const cover_id = result.docs[0].cover_i;
    const book_name = result.docs[0].title;
    const author_name = result.docs[0].author_name[0];
    const img_url = `https://covers.openlibrary.org/b/id/${cover_id}-M.jpg`;

    return { book_title: book_name, author_name: author_name, image: img_url };
  } catch (err) {
    console.log(err);
    return null;
  }
}

app.get("/", async (req, res) => {
    
    try {
    const result = await db.query("SELECT * FROM books");
    const books = result.rows;

    console.log(books);
    res.render("index.ejs", { books });
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Server error");
  }
});

app.get("/add_book", (req, res) => {
  res.render("add_book.ejs");
});

app.post("/add_book", async (req, res) => {
  const { title, author, rating, notes, summary } = req.body;
  const { book_title, author_name, image } = await get_image(title);
  const finalTitle = book_title;
  const finalAuthor = author || author_name;
  const date = new Date().toISOString().split("T")[0];

  const insertResult = await db.query(
    "INSERT INTO books (book_title, author, date_read, rating, cover_url, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
    [finalTitle, finalAuthor, date, rating, image, notes, summary]
  );
  res.redirect("/add_book");
});

app.get("/book/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [bookId]);
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }

    const book = result.rows[0];
    if (!book.summary) {
      book.summary = "No summary available.";
    }

    res.render("book_detail.ejs", { book });
  } 
  catch (err) {
    console.error("Error fetching book details", err);
    res.status(500).send("Server error");
  }
});

// ROUTE: Show Edit Book Info Form
app.get("/edit/book/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [bookId]);
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    const book = result.rows[0];
    res.render("edit_book_info.ejs", { book });
  } catch (err) {
    console.error("Error fetching book info for editing", err);
    res.status(500).send("Server error");
  }
});

// ROUTE: Submit Book Info Update
app.post("/edit/book/:id", async (req, res) => {
  const bookId = req.params.id;
  const { book_title, author, date_read, rating, notes } = req.body;
  try {
    await db.query(
      `UPDATE books SET book_title = $1, author = $2, date_read = $3, rating = $4, notes = $5 WHERE id = $6`,
      [book_title, author, date_read, rating, notes, bookId]
    );
    res.redirect(`/book/${bookId}`);
  } catch (err) {
    console.error("Error updating book info", err);
    res.status(500).send("Server error");
  }
});

// ROUTE: Show Edit Summary Form
app.get("/edit/summary/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await db.query("SELECT id, summary FROM books WHERE id = $1", [bookId]);
    if (result.rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    const book = result.rows[0];
    res.render("edit_summary.ejs", { book });
  } catch (err) {
    console.error("Error fetching summary for editing", err);
    res.status(500).send("Server error");
  }
});

// ROUTE: Submit Summary Update
app.post("/edit/summary/:id", async (req, res) => {
  const bookId = req.params.id;
  const { summary } = req.body;
  try {
    await db.query("UPDATE books SET summary = $1 WHERE id = $2", [summary, bookId]);
    res.redirect(`/book/${bookId}`);
  } catch (err) {
    console.error("Error updating summary", err);
    res.status(500).send("Server error");
  }
});

// ROUTE: Delete Book
app.post("/delete/book/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    await db.query("DELETE FROM books WHERE id = $1", [bookId]);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting book", err);
    res.status(500).send("Server error");
  }
});



app.listen(port, (req, res) => {
  console.log(`App is running on port ${port}`);
});

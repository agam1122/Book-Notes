# 📚 Book Notes Web App

This is a personal book tracking and note-taking web application where you can:

- Add books you've read
- Attach notes and summaries
- Rate books
- Automatically fetch book cover images via Open Library API
- View, edit, or delete entries

Built with:
- **Node.js + Express** (backend)
- **PostgreSQL** (database)
- **EJS** (templating)
- **Bootstrap** (frontend styling)

---

## 🚀 Features

- Add books with title, author, rating, notes, and summaries
- Automatically fetch cover image using Open Library API
- View detailed book info
- Edit or delete existing books
- Responsive Bootstrap-based layout

---

## 🛠 Setup Instructions (Local)

### 1. Clone the Repository

```bash
git clone https://github.com/agam1122/Book-Notes.git
cd Book-Notes
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup PostgreSQL Database

Ensure PostgreSQL is installed and running.

#### Create a database:

```sql
CREATE DATABASE "book notes";
```

#### Create `books` table:

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  book_title TEXT NOT NULL,
  author TEXT,
  date_read TEXT,
  rating DOUBLE PRECISION,
  cover_url TEXT,
  notes TEXT,
  summary TEXT
);
```

### 4. Configure DB Connection

In `index.js`, update your PostgreSQL credentials:

```js
const db = new pg.Client({
  user: "your_username",
  host: "localhost",
  database: "book notes",
  password: "your_password",
  port: 5432,
});
```

### 5. Run the Application

```bash
node index.js
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
Book-Notes/
│
├── public/               # Static assets (CSS, images)
├── views/                # EJS templates
│   ├── index.ejs
│   ├── book_detail.ejs
│   ├── add_book.ejs
│   └── edit.ejs (etc.)
├── index.js              # Main Express app
├── package.json
└── README.md
```

---

## 🌐 APIs Used

* [Open Library API](https://openlibrary.org/developers/api) for fetching book cover images

---

## 🙌 Contributing

Feel free to fork and submit PRs for improvements or bug fixes.

---


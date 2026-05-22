import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import path from "path";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import db from "./db.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Update POST route for /api/prices to remove product_name handling
app.post("/api/prices", (req, res) => {
  const { price, record_date } = req.body;

  // Validation logic
  if (!price || typeof price !== "number" || price <= 0) {
    return res.status(400).json({ error: "Invalid or missing price" });
  }

  if (!record_date || !/\d{4}-\d{2}-\d{2}/.test(record_date)) {
    return res.status(400).json({
      error: "Invalid or missing record_date. Expected format: YYYY-MM-DD",
    });
  }

  const query = `INSERT INTO price_records (price, record_date) VALUES (?, ?)`;
  const params = [price, record_date];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error inserting data:", err.message);
      return res.status(500).json({ error: "Failed to add price record" });
    }

    res.status(201).json({
      message: "Price record added successfully",
      recordId: this.lastID,
      price,
      record_date,
    });
  });
});

// Update GET route for /api/prices to remove product_name handling
app.get("/api/prices", (req, res) => {
  const query = `SELECT price, record_date FROM price_records`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching data:", err.message);
      return res.status(500).json({ error: "Failed to fetch price records" });
    }

    res.status(200).json({
      message: "Price records fetched successfully",
      data: rows,
    });
  });
});

export default app;

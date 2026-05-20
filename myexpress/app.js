import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import db from "./db.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Update POST route for /api/prices with validation logic
app.post("/api/prices", (req, res) => {
  const { product_name, price, record_date } = req.body;

  // Validation logic
  if (
    !product_name ||
    typeof product_name !== "string" ||
    product_name.trim() === ""
  ) {
    return res.status(400).json({ error: "Invalid or missing product_name" });
  }

  if (!price || typeof price !== "number" || price <= 0) {
    return res.status(400).json({ error: "Invalid or missing price" });
  }

  if (!record_date || !/\d{4}-\d{2}-\d{2}/.test(record_date)) {
    return res
      .status(400)
      .json({
        error: "Invalid or missing record_date. Expected format: YYYY-MM-DD",
      });
  }

  const query = `INSERT INTO price_records (product_name, price, record_date) VALUES (?, ?, ?)`;
  const params = [product_name, price, record_date];

  db.run(query, params, function (err) {
    if (err) {
      console.error("Error inserting data:", err.message);
      return res.status(500).json({ error: "Failed to add price record" });
    }

    res.status(201).json({
      message: "Price record added successfully",
      recordId: this.lastID,
    });
  });
});

// Add GET route for /api/prices
app.get("/api/prices", (req, res) => {
  const query = `SELECT * FROM price_records`;

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

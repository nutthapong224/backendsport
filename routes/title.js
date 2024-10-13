const express = require("express");
const router = express.Router();
const db = require("../db"); // Assuming db.js is in the parent directory

// Get all titles
router.get("/", async (req, res) => {
  const sql = "SELECT * FROM title";
  try {
    const [results] = await db.query(sql); // Use promise-based query method
    res.json(results);
  } catch (err) {
    console.error("Error fetching titles:", err);
    res.status(500).json({ error: "Failed to retrieve titles" });
  }
});

// Get a single title by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM title WHERE title_id = ?";
  try {
    const [result] = await db.query(sql, [id]); // Use promise-based query method
    if (result.length === 0) {
      res.status(404).json({ message: "Title not found" });
    } else {
      res.json(result[0]);
    }
  } catch (err) {
    console.error("Error fetching title:", err);
    res.status(500).json({ error: "Failed to retrieve title" });
  }
});

module.exports = router;

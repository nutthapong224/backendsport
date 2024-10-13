const express = require("express");
const router = express.Router();
const db = require("../db"); // Assuming db.js is in the parent directory

// Get all sport types
router.get("/", async (req, res) => {
  const sql = "SELECT * FROM sporttypes";
  try {
    const [results] = await db.query(sql); // Use promise-based query method
    res.json(results);
  } catch (err) {
    console.error("Error fetching sport types:", err);
    res.status(500).json({ error: "Failed to retrieve sport types" });
  }
});

// Get a single sport type by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM sporttypes WHERE sporttypes_id = ?";
  try {
    const [result] = await db.query(sql, [id]); // Use promise-based query method
    if (result.length === 0) {
      res.status(404).json({ message: "Sport type not found" });
    } else {
      res.json(result[0]);
    }
  } catch (err) {
    console.error("Error fetching sport type:", err);
    res.status(500).json({ error: "Failed to retrieve sport type" });
  }
});

module.exports = router;

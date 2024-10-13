const express = require("express");
const router = express.Router();
const db = require("../db"); 

// Get all campuses
router.get("/", async (req, res) => {
  const sql = "SELECT * FROM campus";
  try {
    const [results] = await db.query(sql); 
    res.json(results);
  } catch (err) {
    console.error("Error fetching campuses:", err);
    res.status(500).json({ error: "Failed to retrieve campuses" });
  }
});



module.exports = router;

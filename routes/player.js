const express = require("express");
const router = express.Router();
const db = require("../db"); // Adjust this according to your file structure

// POST route to create a new player
router.post("/create", async (req, res) => {
  const { title, fname, lname, campus, sporttypes, img } = req.body;

  try {
    const query = `
      INSERT INTO players (title, fname, lname, campus, sporttypes, img)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const values = [title, fname, lname, campus, sporttypes, img];

    await db.query(query, values);
    res.status(201).json({ message: "Player created successfully" });
  } catch (err) {
    console.error("Error creating player:", err);
    res
      .status(500)
      .json({ message: "Error creating player", error: err.message });
  }
});

// GET route to retrieve all players
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM players";
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error retrieving players:", err);
    res
      .status(500)
      .json({ message: "Error retrieving players", error: err.message });
  }
});

router.get("/search", async (req, res) => {
  const { fname, lname, campus, sporttypes } = req.query; // Include sporttypes in the destructuring

  try {
    const query = `
      SELECT * FROM players
      WHERE fname LIKE ? AND lname LIKE ? AND campus = ? AND sporttypes = ?
    `;
    const values = [
      `%${fname}%`,
      `%${lname}%`,
      campus,
      sporttypes, 
    ];

    const [rows] = await db.query(query, values);
    res.status(200).json(rows); // Ensure this is an array
  } catch (err) {
    console.error("Error searching players:", err);
    res
      .status(500)
      .json({ message: "Error searching players", error: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../db"); // Adjust this according to your file structure

// POST route to create a new coach
router.post("/create", async (req, res) => {
  const { coach_fname, coach_lname, coach_img, sporttypes, title, campus } =
    req.body;

  try {
    const query = `
      INSERT INTO coach (coach_fname, coach_lname, coach_img, sporttypes, title, campus)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const values = [
      coach_fname,
      coach_lname,
      coach_img,
      sporttypes,
      title,
      campus,
    ];

    await db.query(query, values);
    res.status(201).json({ message: "Coach created successfully" });
  } catch (err) {
    console.error("Error creating coach:", err);
    res
      .status(500)
      .json({ message: "Error creating coach", error: err.message });
  }
});

// GET route to retrieve all coaches
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM coach";
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error retrieving coaches:", err);
    res
      .status(500)
      .json({ message: "Error retrieving coaches", error: err.message });
  }
});

router.get("/search", async (req, res) => {
  const { coach_fname, coach_lname, campus, sporttypes } = req.query; // Include campus in the destructuring

  try {
    const query = `
      SELECT * FROM coach
      WHERE coach_fname LIKE ? AND coach_lname LIKE ? AND campus = ? AND sporttypes = ?
    `;
    const values = [
      `%${coach_fname}%`,
      `%${coach_lname}%`,
      campus, // Assuming campus is a direct match, not a LIKE query
      sporttypes,
    ];

    const [rows] = await db.query(query, values);
    res.status(200).json(rows); // Ensure this is an array
  } catch (err) {
    console.error("Error searching coaches:", err);
    res
      .status(500)
      .json({ message: "Error searching coaches", error: err.message });
  }
});

module.exports = router;

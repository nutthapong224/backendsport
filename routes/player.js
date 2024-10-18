const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const db = require("../db"); // Adjust this according to your file structure

// Configure multer for storage in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Change this path as necessary
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.random().toString(36).substring(2, 15); // Create a unique filename
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Add the unique suffix to the original filename
  },
});

const upload = multer({ storage });

// Serve static files from the uploads directory
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// POST route to create a new player
router.post("/create", upload.single("img"), async (req, res) => {
  const { title, fname, lname, campus, sporttypes, studentid } = req.body;

  // Get the image path
  const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !fname || !lname || !campus || !studentid) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const query = `
      INSERT INTO players (title, fname, lname, campus, sporttypes, img, studentid)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [
      title,
      fname,
      lname,
      campus || null,
      sporttypes || null,
      imgPath,
      studentid,
    ];

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

// Search route
router.get("/search", async (req, res) => {
  const { fname, lname, campus, sporttypes } = req.query;

  try {
    const query = `
      SELECT * FROM players
      WHERE fname LIKE ? AND lname LIKE ? AND campus = ? AND sporttypes = ?
    `;
    const values = [`%${fname}%`, `%${lname}%`, campus, sporttypes];

    const [rows] = await db.query(query, values);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error searching players:", err);
    res
      .status(500)
      .json({ message: "Error searching players", error: err.message });
  }
});

module.exports = router;

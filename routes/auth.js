const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt
const express = require("express");
const router = express.Router();
const db = require("../db"); // Adjust as needed
// Use a strong secret key, stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret_key";

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists in the database
    const query = `SELECT * FROM admin WHERE username = ?`;
    const [userRows] = await db.query(query, [username]);

    if (userRows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = userRows[0];

    // Verify if the password matches the stored hashed password using bcryptjs
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role, // Optional: include additional data like user role
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    // Send the token as a response
    return res.status(200).json({
      message: "Login successful",
      token, // Return the JWT token
    });
  } catch (err) {
    console.error("Error logging in:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
}); 
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const queryCheck = `SELECT * FROM admin WHERE username = ?`;
    const [existingUser] = await db.query(queryCheck, [username]);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const queryInsert = `INSERT INTO admin (username, password) VALUES (?, ?)`;
    await db.query(queryInsert, [username, hashedPassword]);

    // After successful registration, generate a JWT token
    const token = jwt.sign(
      {
        username: username,
    
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    // Respond with a success message and the JWT token
    res.status(201).json({
      message: "Account created successfully",
      token, // Return the JWT token
    });
  } catch (err) {
    console.error("Error registering:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

// Logout route (for client-side token removal)
router.post("/logout", (req, res) => {
  // On the client-side, simply remove the token
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;

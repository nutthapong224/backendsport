// server.js
const express = require("express");
const bodyParser = require("body-parser");
const playerRoutes = require("./routes/player");
const coachRoutes = require("./routes/coach");
const titleRoutes = require("./routes/title"); // Add this line for title rou
const campusRoutes = require("./routes/campus"); // Adjust the path as necessary
const sportTypesRouter = require("./routes/sportypes");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
// Middleware to parse JSON
app.use(bodyParser.json());

// Routes
app.use("/api/players", playerRoutes); // Keep this if you have player routes
app.use("/api/coaches", coachRoutes); // Correctly set the route for coaches
app.use("/api/titles", titleRoutes); // Set the route for titles
app.use("/api/campuses", campusRoutes); // Set up the route for campuses
app.use("/api/sporttypes", sportTypesRouter);
// Root route


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

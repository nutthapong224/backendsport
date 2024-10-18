const express = require("express");
const playerRoutes = require("./routes/player");
const playersRoutes = require("./routes/players");
const coachRoutes = require("./routes/coach");
const titleRoutes = require("./routes/title");
const campusRoutes = require("./routes/campus");
const sportTypesRoutes = require("./routes/sportypes");
const AuthRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const cluster = require("cluster");
const os = require("os");
const fs = require("fs");

const PORT = process.env.PORT || 3000;
const numCPUs = os.cpus().length;

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

if (cluster.isMaster) {
  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // If a worker dies, log it
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use("/static", express.static(path.join(__dirname, "public/static")));

  // Serve static files from the uploads directory
  app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // This line serves the uploaded images

  // API Routes
  app.use("/api/player", playersRoutes); // Single player operations
  app.use("/api/players", playerRoutes); // Multiple players
  app.use("/api/coaches", coachRoutes);
  app.use("/api/titles", titleRoutes);
  app.use("/api/campuses", campusRoutes);
  app.use("/api/sporttypes", sportTypesRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api", AuthRoutes);

  // Handle 404 for undefined routes
  app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

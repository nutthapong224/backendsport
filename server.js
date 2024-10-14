const express = require("express");
const bodyParser = require("body-parser");
const playerRoutes = require("./routes/player");
const coachRoutes = require("./routes/coach");
const titleRoutes = require("./routes/title");
const campusRoutes = require("./routes/campus");
const sportTypesRouter = require("./routes/sportypes");
const cors = require("cors");
const compression = require("compression");
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const PORT = process.env.PORT || 3000;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const app = express();

  app.use(cors());
  app.use(compression());
  app.use(bodyParser.json({ limit: '10mb' }));

  // Routes
  app.use("/api/players", playerRoutes);
  app.use("/api/coaches", coachRoutes);
  app.use("/api/titles", titleRoutes);
  app.use("/api/campuses", campusRoutes);
  app.use("/api/sporttypes", sportTypesRouter);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

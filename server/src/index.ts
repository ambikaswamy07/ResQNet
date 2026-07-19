import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.routes";
import incidentRoutes from "./routes/incident.routes";
import volunteerRoutes from "./routes/volunteer.routes";
import dispatcherRoutes from "./routes/dispatcher.routes";
import hospitalRoutes from "./routes/hospital.route";

import { initializeSocket } from "./sockets/socket";

dotenv.config();

const app = express();

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://resqnet-client-tz0n.onrender.com",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

initializeSocket(io);

const PORT = process.env.PORT || 5000;

// ======================================
// Middleware
// ======================================

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ======================================
// Routes
// ======================================

app.use("/api/auth", authRoutes);

app.use("/api/incidents", incidentRoutes);

app.use("/api/volunteers", volunteerRoutes);

app.use("/api/dispatcher", dispatcherRoutes);

app.use("/api/hospitals", hospitalRoutes);

// ======================================
// Health Check
// ======================================

app.get("/status", (req, res) => {

  res.status(200).json({

    success: true,

    message: "🚑 ResQNet API Running Successfully",

    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",

    socket: "Enabled",

    timestamp: new Date().toISOString(),

  });

});

// ======================================
// MongoDB
// ======================================

const connectDB = async () => {

  try {

    await mongoose.connect(
      process.env.MONGODB_URI as string
    );

    console.log("✅ MongoDB Connected");

  } catch (error) {

    console.error("❌ MongoDB Connection Failed:");

    console.error(error);

    throw error;

  }

};

// ======================================
// Start Server
// ======================================

const startServer = async () => {
  try {
    console.log("Step 1: Connecting to MongoDB...");

    await connectDB();

    console.log("Step 2: Starting server...");

    server.listen(PORT, () => {
      console.log("");
      console.log("==========================================");
      console.log("🚑 ResQNet Server Started");
      console.log(`🌐 API     : http://localhost:${PORT}`);
      console.log(`⚡ Socket  : ws://localhost:${PORT}`);
      console.log("==========================================");
    });
  } catch (err) {
    console.error("❌ SERVER START ERROR:");
    console.error(err);
  }
};

startServer();
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import { Server } from "socket.io";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import roomRouter from "./routes/roomRoutes.js";
import authRouter from "./routes/authRoute.js";
import socketHandler from "./sockets/socket.js";
import { protectRoute } from "./controllers/authController.js";
import handler from "./controllers/aichatController.js";

const app = express();

const server = http.createServer(app);

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_CONNECTION_URL', 'FRONTEND_URL', 'SESSION_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Security Middleware
app.use(helmet());
app.use(compression());

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Request logger (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later."
});
app.use("/api", apiLimiter);

// Stricter rate limiting for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts, please try again later."
});
app.use("/api/auth", authLimiter);

// Session middleware for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "UP", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get("/dummy", (req, res) => {
  res.json({ msg: "Api is working" });
});

app.use("/api/room", protectRoute, roomRouter);
app.use("/api/auth", authRouter);
app.post("/api/chat-ai", protectRoute, handler);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"],
  },
});
socketHandler(io);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_CONNECTION_URL, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Error Handling Middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  console.error(`[Error] ${err.message}`, err.stack);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

app.use(notFound);
app.use(errorHandler);

// Start Server
server.listen(process.env.PORT, () => {
  console.log("🚀 Server is running on port " + process.env.PORT);
});

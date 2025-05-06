import express from "express";
import path from "path";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import portfolioRoutes from "./routes/portfolioRoutes";
import cryptoRoutes from "./routes/cryptoRoutes";
import watchlistRoutes from "./routes/watchlistRoutes";

// Create Express app
const app = express();

// Get allowed origins from environment variable or use defaults
// Ensure dotenv.config() is called in server.ts before this module is imported
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["https://cryptotrack-oitv.onrender.com", "http://localhost:5173"];

console.log("CORS allowed origins:", allowedOrigins);

// Improved CORS configuration with preflight handling
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initial health check route (can be overridden in server.ts catch block if needed)
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy (app configured)",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/crypto", cryptoRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Static File Serving Configuration & Development Root Route
// This relies on process.env.NODE_ENV, set by dotenv.config() in server.ts
if (process.env.NODE_ENV === "production") {
  // Production mode: Serve from client/build
  const staticPath = path.join(__dirname, "../client/build");
  console.log(`Serving static files from: ${staticPath}`);

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../client", "build", "index.html")
    );
  });
} else {
  // Development mode: API status endpoint
  app.get("/", (_req, res) => {
    res.json({
      status: "API is running (app configured)",
      mode: process.env.NODE_ENV || "development",
      // MongoDB status will be determined by server.ts
    });
  });
}

export default app;
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/Database";

// Connect to MongoDB Atlas
connectDB()
  .then(() => {
    console.log("MongoDB Atlas connection established successfully");



    // Start server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} in ${
          process.env.NODE_ENV || "development"
        } mode`
      );
      console.log(`http://localhost:${PORT}`);
    });

    // Handle server shutdown gracefully
    process.on("SIGINT", () => {
      console.log("SIGINT signal received: closing HTTP server");
      server.close(() => {
        console.log("HTTP server closed. Database connections cleaned (if applicable).");
        // If connectDB returns a mongoose connection or similar, you might want to close it here:
        // mongoose.connection.close(() => {
        //   console.log('MongoDB connection closed.');
        //   process.exit(0);
        // });
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    console.error(
      "Error during server startup (after DB connection attempt or in .then() block):",
      error
    );

    // Set up basic routes for error state on the imported app
    // This /health route will override the one in app.ts if this catch block is hit
    app.get("/health", (_req, res) => {
      res.status(503).json({
        success: false,
        message: "Server error or database connection failed during startup",
        timestamp: new Date().toISOString(),
      });
    });

    // Update root route for development to reflect error state
    if (process.env.NODE_ENV !== "production") {
      app.get("/", (_req, res) => {
        res.status(503).json({
          status: "API is running in limited mode due to startup error",
          mode: process.env.NODE_ENV || "development",
          mongodb: "connection_failed_or_error_during_startup",
          error: error.message || "Unknown error",
        });
      });
    }

    // Start server even if DB connection fails or another error occurs in the .then() block
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(
        `Server running in limited mode on port ${PORT} due to startup error.`
      );
    });
  });
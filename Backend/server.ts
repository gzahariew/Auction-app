// src/index.ts
import "reflect-metadata"; // Make sure this is at the very top of your entry file
import express from "express";
import { AppDataSource } from "./src/data-source"; // Your TypeORM data source
import userRoutes from "./routes/userRoutes"; // <--- You import the router
import auctionRoutes from "./routes/auctionRoutes";
import bidRoutes from "./routes/bidRoutes"

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Async function to handle server startup and database connection
async function startServer() {
  try {
    // 1. Initialize TypeORM Data Source (connect to DB)
    await AppDataSource.initialize();
    console.log("Database connected successfully!");

    // 2. Define API Routes (now that DB connection is ready)
    // src/index.ts

    app.use("/api/user", userRoutes); // <--- You mount it under a base path!

    app.use("/api/auctions", auctionRoutes);

    app.use("/api/bid", bidRoutes);

    // Basic welcome route
    app.get("/", (req, res) => {
      res.send("Welcome to the TypeORM Express App!");
    });
    // 3. Start the Express server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error during server startup or database connection:", error);
    // Exit the process if database connection fails
    process.exit(1);
  }
}

// Call the async function to start everything
startServer();

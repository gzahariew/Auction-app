import "reflect-metadata"; // Make sure this is at the very top of your entry file
import express from "express";
import { AppDataSource } from "./src/data-source"; // Your TypeORM data source
import userRoutes from "./routes/userRoutes"; // <--- You import the router
import auctionRoutes from "./routes/auctionRoutes";
import bidRoutes from "./routes/bidRoutes";
import http from "http"; // Node.js built-in module to create an HTTP server
import { Server as SocketIOServer } from "socket.io";

const app = express();
const port = 3000; // You can use config.port here if you prefer

// Middleware to parse JSON request bodies
app.use(express.json());

let server: http.Server;
let io: SocketIOServer; // 'io' will be assigned later in startServer()

app.use("/api/user", userRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bid", bidRoutes);

async function startServer() {
  try {
    // 1. Initialize TypeORM Data Source (connect to DB)
    // Use await directly for cleaner async flow.
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    // 2. Define HTTP server using the Express app.
    server = http.createServer(app);

    // 3. Initialize Socket.IO and attach it to the 'server' instance.
    io = new SocketIOServer(server, {
      cors: {
        origin: "http://localhost:3000", // IMPORTANT: Adjust this to your FRONTEND'S URL!
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // 4. Set up Socket.IO connection handlers.
    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on("joinAuctionRoom", (auctionId: string) => {
        socket.join(auctionId);
        console.log(`Socket ${socket.id} joined room: ${auctionId}`);
        socket.emit("joinedAuctionRoom", auctionId); // Optional: confirm join to client
      });

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    // 5. Start listening for HTTP and Socket.IO connections.
    // This happens ONLY after the database is successfully initialized and Socket.IO is set up.
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`Socket.IO is listening for real-time connections`);
    });
  } catch (error) {
    console.error("Error during server startup or database connection:", error);
    // Exit the process if database connection fails
    process.exit(1);
  }
}

// Call the async function to start everything
startServer();

// --- EXPORT THE SOCKET.IO INSTANCE ---
// This allows other modules (like your bidService) to import 'io'
// and use it to emit events. It's declared 'let' and assigned inside startServer,
// so it will be available after startServer has run.
export { io };

// src/index.ts
import "reflect-metadata"; // Make sure this is at the very top of your entry file
import express from 'express';
import { AppDataSource } from './src/data-source'; // Your TypeORM data source

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

        // Basic welcome route
        app.get('/', (req, res) => {
            res.send('Welcome to the TypeORM Express App!');
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
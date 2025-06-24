import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Auction } from "./entity/Auction";
import { Bid } from "./entity/Bid";

export const AppDataSource = new DataSource({
  type: "sqlite", // Correctly specifies SQLite
  database: "database.sqlite", // This is the ONLY essential "connection" detail for SQLite
  // It's the path to your database file.
  synchronize: true, // For development, automatically creates/updates schema
  logging: ["query", "error"], // Optional: logs SQL queries and errors
  entities: [User, Auction, Bid], // List all your entity classes here
  migrations: [],
  subscribers: [],
      extra: {
        // This will run 'PRAGMA foreign_keys = ON;' every time a connection is opened.
        // It's essential because SQLite disables FKs by default for backwards compatibility.
        // For production, consider adding more robust error handling or ensuring this runs once on startup.
        'sqlite_pragma_foreign_keys': true, // TypeORM's specific way to enable it
    }
});

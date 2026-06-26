import mongoose from "mongoose";
import { env } from "./env";

let isConnected = false;

/**
 * Connect to MongoDB Atlas (or local MongoDB).
 * Safe to call multiple times — reuses existing connection.
 */
export async function connectDatabase(): Promise<void> {
  if (isConnected) return;

  try {
    await mongoose.connect(env.DATABASE_URL);
    isConnected = true;
    console.log("✓ MongoDB connected");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      console.warn("MongoDB disconnected");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

/**
 * Disconnect gracefully. Call during shutdown.
 */
export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log("✓ MongoDB disconnected");
}

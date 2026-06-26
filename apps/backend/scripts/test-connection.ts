import mongoose from "mongoose";
import { config } from "dotenv";
config();

async function main() {
  const url = process.env["DATABASE_URL"];
  console.log(`Connecting to: ${url?.replace(/:[^:@]+@/, ":****@")}`);

  try {
    await mongoose.connect(url!, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log("✓ Connected successfully");
    const admin = mongoose.connection.db!.admin();
    const info = await admin.serverInfo();
    console.log(`  MongoDB version: ${info.version}`);
    await mongoose.disconnect();
    console.log("✓ Disconnected");
  } catch (err: unknown) {
    const e = err as Error & { cause?: unknown };
    console.error("✗ Connection failed:", e.message);
    if (e.cause) console.error("  Cause:", e.cause);
    process.exit(1);
  }
}

main();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { errorHandler } from "./middleware/error-handler";
import { apiRouter } from "./routes";

const app = express();

// ── Middleware ────────────────────────────────────────────────

// Security headers
app.use(helmet());

// CORS — allow frontend origin in development
app.use(
  cors({
    origin: env.NODE_ENV === "production" ? process.env["FRONTEND_URL"] : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging
if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// ── Routes ───────────────────────────────────────────────────

app.use("/api", apiRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Error handling ───────────────────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────
async function main() {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(`✓ Server listening on http://localhost:${env.PORT}`);
      console.log(`  Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await disconnectDatabase();
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await disconnectDatabase();
  process.exit(0);
});

export default app;

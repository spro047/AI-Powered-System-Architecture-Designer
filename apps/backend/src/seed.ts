/**
 * Database seeder — populates demo data for development.
 *
 * Usage: npx tsx src/seed.ts
 *
 * Prerequisites:
 *   1. MongoDB Atlas connection string set in .env
 *   2. Connection is valid and reachable
 */

import mongoose from "mongoose";
import { config } from "dotenv";
import { User, Project } from "./models";

config();

async function main() {
  const dbUrl = process.env["DATABASE_URL"];
  if (!dbUrl) {
    console.error("DATABASE_URL not set in .env");
    process.exit(1);
  }

  await mongoose.connect(dbUrl);
  console.log("✓ Connected to MongoDB");

  // Wipe existing data for clean seed
  await Promise.all([User.deleteMany({}), Project.deleteMany({})]);

  // Create a demo user
  const user = await User.create({
    email: "demo@archigen.dev",
    name: "Demo User",
    // bcrypt hash of "password123" — replace in production
    password: "$2b$10$dummyhashchangemeinproduction",
  });
  console.log(`✓ Demo user: ${user.email} (${user._id})`);

  // Create a sample project with embedded components
  const project = await Project.create({
    title: "E-Commerce Platform (Sample)",
    description: "Sample architecture generated from: Build a scalable e-commerce platform with microservices",
    pattern: "Microservices",
    ownerId: user._id,
    components: [
      { id: "comp-001", label: "Web App", type: "WebApp", x: 100, y: 50, width: 200, height: 120 },
      { id: "comp-002", label: "API Gateway", type: "APIGateway", x: 100, y: 250, width: 200, height: 120 },
      { id: "comp-003", label: "User Service", type: "BackendService", x: 0, y: 450, width: 200, height: 120 },
      { id: "comp-004", label: "Product Service", type: "BackendService", x: 250, y: 450, width: 200, height: 120 },
      { id: "comp-005", label: "Order Service", type: "BackendService", x: 500, y: 450, width: 200, height: 120 },
      { id: "comp-006", label: "PostgreSQL", type: "Database", x: 0, y: 650, width: 200, height: 120 },
      { id: "comp-007", label: "Redis", type: "Cache", x: 250, y: 650, width: 200, height: 120 },
      { id: "comp-008", label: "MongoDB", type: "Database", x: 500, y: 650, width: 200, height: 120 },
    ],
    connections: [
      { id: "conn-001", type: "http", sourceId: "comp-001", targetId: "comp-002" },
      { id: "conn-002", type: "http", sourceId: "comp-002", targetId: "comp-003" },
      { id: "conn-003", type: "http", sourceId: "comp-002", targetId: "comp-004" },
      { id: "conn-004", type: "http", sourceId: "comp-002", targetId: "comp-005" },
      { id: "conn-005", type: "data-flow", sourceId: "comp-003", targetId: "comp-006" },
      { id: "conn-006", type: "data-flow", sourceId: "comp-004", targetId: "comp-006" },
      { id: "conn-007", type: "data-flow", sourceId: "comp-005", targetId: "comp-008" },
      { id: "conn-008", type: "cache", sourceId: "comp-003", targetId: "comp-007" },
    ],
  });
  console.log(`✓ Sample project: ${project.title} (${project._id})`);
  console.log(`  Components: ${project.components.length}, Connections: ${project.connections.length}`);

  // Add an initial version snapshot
  await Project.findByIdAndUpdate(project._id, {
    $push: {
      versions: {
        version: 1,
        label: "Initial generation",
        snapshot: {
          components: project.components,
          connections: project.connections,
        },
      },
    },
  });
  console.log("✓ Initial version snapshot created");

  console.log("\n── Seed complete ──");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

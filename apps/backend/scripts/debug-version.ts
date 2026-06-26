import mongoose from "mongoose";
import { config } from "dotenv";
config();

async function main() {
  await mongoose.connect(process.env["DATABASE_URL"]!);
  const db = mongoose.connection.db!;

  const projectId = "6a3cef75dd08736aa970e768";

  const before = await db.collection("projects").findOne(
    { _id: new mongoose.Types.ObjectId(projectId) },
    { projection: { versions: 1 } },
  );
  console.log("Versions before:", before?.versions?.length ?? 0);

  // Try direct driver push (no Mongoose schema interference)
  const result = await db.collection("projects").updateOne(
    { _id: new mongoose.Types.ObjectId(projectId) },
    {
      $push: {
        versions: {
          version: 1,
          label: "Test version",
          snapshot: { components: [], connections: [] },
          createdAt: new Date(),
        },
      },
    },
  );
  console.log("Push result:", result.modifiedCount, "modified");

  const after = await db.collection("projects").findOne(
    { _id: new mongoose.Types.ObjectId(projectId) },
    { projection: { versions: { $slice: -1 } } },
  );
  console.log("Last version:", JSON.stringify(after?.versions?.[0] ?? "NONE"));

  // Cleanup
  await db.collection("projects").updateOne(
    { _id: new mongoose.Types.ObjectId(projectId) },
    { $pop: { versions: 1 } },
  );
  console.log("Cleaned up test version");

  await mongoose.disconnect();
}

main().catch(console.error);

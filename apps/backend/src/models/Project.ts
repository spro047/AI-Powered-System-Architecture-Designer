import mongoose from "mongoose";

// ── Embedded sub-schemas ─────────────────────────────────────

const componentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true },
    description: String,
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 200 },
    height: { type: Number, default: 120 },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { _id: false },
);

const connectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: String,
    type: { type: String, default: "default" },
    sourceId: { type: String, required: true },
    targetId: { type: String, required: true },
  },
  { _id: false },
);

const versionSchema = new mongoose.Schema(
  {
    version: { type: Number, required: true },
    label: String,
    snapshot: mongoose.Schema.Types.Mixed,
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } },
);

const aiHistorySchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    response: mongoose.Schema.Types.Mixed,
    pattern: String,
    status: { type: String, default: "success" },
    errorMessage: String,
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } },
);

// ── Top-level schema ─────────────────────────────────────────

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    pattern: {
      type: String,
      enum: ["Monolithic", "Microservices", "Layered", "EventDriven", "Serverless", null],
      default: null,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    components: { type: [componentSchema], default: [] },
    connections: { type: [connectionSchema], default: [] },
    versions: { type: [versionSchema], default: [] },
    aiGenerationHistory: { type: [aiHistorySchema], default: [] },
  },
  { timestamps: true },
);

projectSchema.index({ ownerId: 1, updatedAt: -1 });

export const Project = mongoose.model("Project", projectSchema);

import { Project } from "../models";
import { getComponentByType, getComponentLibrary } from "../data/component-library";
import { AppError } from "../middleware/error-handler";
import type { CreateComponentInput, UpdateComponentInput } from "../validators/component.validator";

// ── Library ──────────────────────────────────────────────────

export function getLibrary() {
  return getComponentLibrary();
}

// ── Project-level CRUD ──────────────────────────────────────

export async function addComponent(projectId: string, data: CreateComponentInput, userId: string) {
  const project = await Project.findById(projectId).select("ownerId").lean();
  if (!project) throw new AppError({ status: 404, message: "Project not found." });
  assertOwnership(project.ownerId.toString(), userId);

  const libraryEntry = getComponentByType(data.type);
  if (!libraryEntry) {
    throw new AppError({
      status: 400,
      message: `Unknown component type "${data.type}". See GET /api/components for valid types.`,
    });
  }

  const newComponent = {
    id: crypto.randomUUID(),
    label: data.label,
    type: data.type,
    description: data.description ?? null,
    x: data.x,
    y: data.y,
    width: data.width,
    height: data.height,
    metadata: data.metadata ?? null,
  };

  await Project.findByIdAndUpdate(projectId, {
    $push: { components: newComponent },
  });

  return newComponent;
}

export async function updateComponent(
  projectId: string,
  componentId: string,
  data: UpdateComponentInput,
  userId: string,
) {
  const project = await Project.findById(projectId).select("ownerId components").lean();
  if (!project) throw new AppError({ status: 404, message: "Project not found." });
  assertOwnership(project.ownerId.toString(), userId);

  const exists = project.components?.some((c) => c.id === componentId);
  if (!exists) throw new AppError({ status: 404, message: "Component not found in this project." });

  if (data.type) {
    const libraryEntry = getComponentByType(data.type);
    if (!libraryEntry) {
      throw new AppError({
        status: 400,
        message: `Unknown component type "${data.type}". See GET /api/components for valid types.`,
      });
    }
  }

  const update: Record<string, unknown> = {};
  if (data.label !== undefined) update["components.$.label"] = data.label;
  if (data.type !== undefined) update["components.$.type"] = data.type;
  if (data.description !== undefined) update["components.$.description"] = data.description;
  if (data.x !== undefined) update["components.$.x"] = data.x;
  if (data.y !== undefined) update["components.$.y"] = data.y;
  if (data.width !== undefined) update["components.$.width"] = data.width;
  if (data.height !== undefined) update["components.$.height"] = data.height;
  if (data.metadata !== undefined) update["components.$.metadata"] = data.metadata;

  return Project.findOneAndUpdate(
    { _id: projectId, "components.id": componentId },
    { $set: update },
    { new: true, lean: true },
  );
}

export async function deleteComponent(projectId: string, componentId: string, userId: string) {
  const project = await Project.findById(projectId).select("ownerId components").lean();
  if (!project) throw new AppError({ status: 404, message: "Project not found." });
  assertOwnership(project.ownerId.toString(), userId);

  const exists = project.components?.some((c) => c.id === componentId);
  if (!exists) throw new AppError({ status: 404, message: "Component not found in this project." });

  await Project.findByIdAndUpdate(projectId, {
    $pull: { components: { id: componentId } },
  });
}

// ── Helpers ──────────────────────────────────────────────────

function assertOwnership(projectOwnerId: string, userId: string): void {
  if (projectOwnerId !== userId) {
    throw new AppError({ status: 403, message: "You do not own this project." });
  }
}

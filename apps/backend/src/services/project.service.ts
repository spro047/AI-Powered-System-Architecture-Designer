import { Project } from "../models";
import { AppError } from "../middleware/error-handler";
import type {
  CreateProjectInput,
  UpdateProjectInput,
  SaveCanvasInput,
  CreateVersionInput,
  SaveCanvasComponent,
  SaveCanvasConnection,
} from "../validators/project.validator";

// ── Helpers ──────────────────────────────────────────────────

function assertOwnership(projectOwnerId: string, userId: string): void {
  if (projectOwnerId !== userId) {
    throw new AppError({ status: 403, message: "You do not own this project." });
  }
}

/** Ensure every component has a UUID id (generate one if missing). */
function ensureIds(
  components: SaveCanvasComponent[],
  connections: SaveCanvasConnection[],
): { components: SaveCanvasComponent[]; connections: SaveCanvasConnection[] } {
  const comps = components.map((c) => ({ ...c, id: c.id ?? crypto.randomUUID() }));
  const keptIds = new Set(comps.map((c) => c.id));
  const conns = connections.filter((c) => keptIds.has(c.sourceId) && keptIds.has(c.targetId));
  return { components: comps, connections: conns };
}

// ── CRUD ─────────────────────────────────────────────────────

export async function createProject(data: CreateProjectInput, userId: string) {
  return Project.create({
    title: data.title,
    description: data.description ?? null,
    pattern: data.pattern ?? null,
    ownerId: userId,
  });
}

export async function listProjects(userId: string) {
  return Project.find({ ownerId: userId })
    .select("title description pattern createdAt updatedAt")
    .sort({ updatedAt: -1 })
    .lean();
}

export async function getProjectById(projectId: string, userId: string) {
  const project = await Project.findById(projectId).lean();
  if (!project) {
    throw new AppError({ status: 404, message: "Project not found." });
  }
  assertOwnership(project.ownerId.toString(), userId);
  return project;
}

export async function updateProjectMeta(projectId: string, data: UpdateProjectInput, userId: string) {
  const project = await Project.findById(projectId).select("ownerId").lean();
  if (!project) throw new AppError({ status: 404, message: "Project not found." });
  assertOwnership(project.ownerId.toString(), userId);

  const update: Record<string, unknown> = {};
  if (data.title !== undefined) update["title"] = data.title;
  if (data.description !== undefined) update["description"] = data.description;
  if (data.pattern !== undefined) update["pattern"] = data.pattern;

  return Project.findByIdAndUpdate(projectId, { $set: update }, { new: true, lean: true });
}

export async function deleteProject(projectId: string, userId: string) {
  const project = await Project.findById(projectId).select("ownerId").lean();
  if (!project) throw new AppError({ status: 404, message: "Project not found." });
  assertOwnership(project.ownerId.toString(), userId);

  await Project.findByIdAndDelete(projectId);
}

// ── Save canvas (full state replacement) ────────────────────

export async function saveCanvas(
  projectId: string,
  data: SaveCanvasInput,
  userId: string,
) {
  const project = await Project.findById(projectId).select("ownerId").lean();
  if (!project) throw new AppError({ status: 404, message: "Project not found." });
  assertOwnership(project.ownerId.toString(), userId);

  const update: Record<string, unknown> = {};
  if (data.title !== undefined) update["title"] = data.title;
  if (data.description !== undefined) update["description"] = data.description;
  if (data.pattern !== undefined) update["pattern"] = data.pattern;

  if (data.components !== undefined || data.connections !== undefined) {
    const { components, connections } = ensureIds(
      data.components ?? [],
      data.connections ?? [],
    );
    update["components"] = components;
    update["connections"] = connections;
  }

  return Project.findByIdAndUpdate(
    projectId,
    { $set: update },
    { new: true, lean: true },
  );
}

// ── Version snapshots ────────────────────────────────────────

export async function createVersion(projectId: string, data: CreateVersionInput, userId: string) {
  const project = await Project.findById(projectId).select("ownerId components connections").lean();
  if (!project) throw new AppError({ status: 404, message: "Project not found." });
  assertOwnership(project.ownerId.toString(), userId);

  // Compute next version number from the existing versions array
  const full = await Project.findById(projectId)
    .select("versions")
    .slice("versions", -1)
    .lean();
  const latest = full?.versions?.[full.versions.length - 1]?.version ?? 0;
  const nextVersion = latest + 1;

  await Project.findByIdAndUpdate(projectId, {
    $push: {
      versions: {
        version: nextVersion,
        label: data.label ?? null,
        snapshot: {
          components: project.components,
          connections: project.connections,
        },
      },
    },
  });

  return { version: nextVersion, label: data.label ?? null, createdAt: new Date() };
}

export async function listVersions(projectId: string, userId: string) {
  const project = await Project.findById(projectId).select("ownerId versions").lean();
  if (!project) throw new AppError({ status: 404, message: "Project not found." });
  assertOwnership(project.ownerId.toString(), userId);

  return (project.versions ?? []).slice().reverse();
}

"use client";

import { useEffect } from "react";
import { useProject } from "@/components/project-provider";

/**
 * Auto-loads the user's most recent project on first mount.
 * Renders nothing — purely a side-effect component.
 */
export function AutoLoader() {
  const { projectList, loadProject, loadProjectList, projectId, loading } =
    useProject();

  useEffect(() => {
    if (projectId !== null || loading) return;

    const init = async () => {
      /* Fetch project list if not yet loaded */
      const list = projectList.length === 0 ? await loadProjectList() : projectList;

      /* If there are existing projects, load the most recent one */
      const sorted = [...(list as unknown as any[]) ?? []].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      if (sorted.length > 0) {
        await loadProject(sorted[0]!._id);
      }
    };

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

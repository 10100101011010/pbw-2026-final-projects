import { apiRequest } from "./api";
import type { LecturerFeedback, RevisionVersion, SessionNote, SessionWorkspace } from "./types";

export const workspaceService = {
  list: () => apiRequest<SessionWorkspace[]>("/workspaces"),
  get: (id: string) => apiRequest<SessionWorkspace>(`/workspaces/${id}`),
  addNote: (id: string, input: { title: string; notes: string }) =>
    apiRequest<SessionNote>(`/workspaces/${id}/notes`, { method: "POST", body: input }),
  addFeedback: (id: string, input: { feedback: string; visibility: "STUDENT_VISIBLE" | "PRIVATE"; file?: File }) => {
    const form = new FormData();
    form.append("feedback", input.feedback);
    form.append("visibility", input.visibility);
    if (input.file) form.append("file", input.file);
    return apiRequest<LecturerFeedback>(`/workspaces/${id}/feedback`, { method: "POST", body: form });
  },
  addRevision: (id: string, input: { title: string; description?: string; file: File }) => {
    const form = new FormData();
    form.append("title", input.title);
    if (input.description) form.append("description", input.description);
    form.append("file", input.file);
    return apiRequest<RevisionVersion>(`/workspaces/${id}/revisions`, { method: "POST", body: form });
  }
};

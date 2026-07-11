import { MessageSquarePlus, Paperclip, Send, Upload } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { Field, Input, Select, Textarea } from "../components/ui/input";
import { PageHeader } from "../components/ui/page";
import { Skeleton } from "../components/ui/skeleton";
import { StatusBadge } from "../components/ui/status-badge";
import { useToast } from "../components/ui/toast-context";
import { useAuth } from "../features/auth/auth-context";
import { useAddFeedback, useAddRevision, useAddSessionNote, useWorkspaces } from "../features/workspaces/queries";
import { formatDateTime, getErrorMessage } from "../lib/utils";
import type { LecturerFeedback, RevisionVersion, SessionNote, SessionWorkspace } from "../services/types";
import { workspaceTitle } from "./page-helpers";

const uploadHint = "PDF, Word, PowerPoint, image, or text file, up to 10 MB.";

export function WorkspacePage() {
  const { role } = useAuth();
  const workspaces = useWorkspaces();

  if (!role) return null;

  return (
    <>
      <PageHeader
        eyebrow="Session Workspace"
        title="Supervision Documentation"
        description="Session notes, lecturer feedback, revision versions, and attached files."
      />
      {workspaces.isLoading ? <WorkspaceSkeleton /> : null}
      {workspaces.isError ? (
        <EmptyState
          title="Workspaces unavailable"
          description={getErrorMessage(workspaces.error)}
          actionLabel="Try again"
          onAction={() => void workspaces.refetch()}
        />
      ) : null}
      {workspaces.data?.length ? (
        <div className="grid gap-5">
          {workspaces.data.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} role={role} />
          ))}
        </div>
      ) : null}
      {workspaces.data && !workspaces.data.length ? (
        <EmptyState
          illustration="bimbingan-3"
          title="No session workspace"
          description="Approved bookings create workspaces for supervision documentation."
        />
      ) : null}
    </>
  );
}

function Timeline<T extends { id: string }>({ items, renderItem }: { items: T[]; renderItem: (item: T) => ReactNode }) {
  return (
    <div className="grid gap-0">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            {index < items.length - 1 ? <span className="w-px flex-1 bg-border" aria-hidden="true" /> : null}
          </div>
          <div className="flex-1 pb-4 last:pb-0">{renderItem(item)}</div>
        </div>
      ))}
    </div>
  );
}

function WorkspaceCard({ workspace, role }: { workspace: SessionWorkspace; role: "STUDENT" | "LECTURER" }) {
  const { notify } = useToast();
  const addNote = useAddSessionNote();
  const addFeedback = useAddFeedback();
  const addRevision = useAddRevision();

  const submitNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      await addNote.mutateAsync({
        id: workspace.id,
        title: String(form.get("title")),
        notes: String(form.get("notes"))
      });
      formElement.reset();
      notify({ title: "Session note saved", variant: "success" });
    } catch (error) {
      notify({ title: "Note failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = form.get("file");
    try {
      await addFeedback.mutateAsync({
        id: workspace.id,
        feedback: String(form.get("feedback")),
        visibility: String(form.get("visibility")) as "STUDENT_VISIBLE" | "PRIVATE",
        file: file instanceof File && file.size > 0 ? file : undefined
      });
      formElement.reset();
      notify({ title: "Feedback saved", variant: "success" });
    } catch (error) {
      notify({ title: "Feedback failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  const submitRevision = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      notify({ title: "File required", description: "Choose a revision file before uploading.", variant: "destructive" });
      return;
    }
    try {
      await addRevision.mutateAsync({
        id: workspace.id,
        title: String(form.get("title")),
        description: String(form.get("description") || ""),
        file
      });
      formElement.reset();
      notify({ title: "Revision uploaded", variant: "success" });
    } catch (error) {
      notify({ title: "Revision failed", description: getErrorMessage(error), variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>{workspaceTitle(workspace, role)}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{formatDateTime(workspace.createdAt)}</p>
          </div>
          <StatusBadge status={workspace.status} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="grid gap-4">
          <section className="rounded-lg border p-4">
            <h3 className="font-display text-sm font-bold tracking-tight">Session Notes</h3>
            <div className="mt-4">
              {workspace.notes?.length ? (
                <Timeline<SessionNote>
                  items={workspace.notes}
                  renderItem={(note) => (
                    <article className="rounded-lg bg-muted/35 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold tracking-tight">{note.title}</p>
                        <span className="whitespace-nowrap text-xs text-muted-foreground">{formatDateTime(note.createdAt)}</span>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{note.notes}</p>
                    </article>
                  )}
                />
              ) : (
                <p className="text-sm text-muted-foreground">No session notes recorded.</p>
              )}
            </div>
          </section>

          <section className="rounded-lg border p-4">
            <h3 className="font-display text-sm font-bold tracking-tight">Lecturer Feedback</h3>
            <div className="mt-4">
              {workspace.feedback?.length ? (
                <Timeline<LecturerFeedback>
                  items={workspace.feedback}
                  renderItem={(feedback) => (
                    <article className="rounded-lg bg-muted/35 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <StatusBadge status={feedback.visibility} />
                        <span className="whitespace-nowrap text-xs text-muted-foreground">{formatDateTime(feedback.createdAt)}</span>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{feedback.feedback}</p>
                      {feedback.attachments?.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={`${import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1"}/workspaces/attachments/${attachment.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                        >
                          <Paperclip className="h-4 w-4" aria-hidden="true" />
                          {attachment.originalFilename}
                        </a>
                      ))}
                    </article>
                  )}
                />
              ) : (
                <p className="text-sm text-muted-foreground">No feedback recorded.</p>
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-4">
          <section className="rounded-lg border p-4">
            <h3 className="font-display text-sm font-bold tracking-tight">Revision Versions</h3>
            <div className="mt-4">
              {workspace.revisions?.length ? (
                <Timeline<RevisionVersion>
                  items={workspace.revisions}
                  renderItem={(revision) => (
                    <article className="rounded-lg bg-muted/35 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold tracking-tight">
                          Version {revision.versionNumber}: {revision.title}
                        </p>
                        <StatusBadge status={revision.status} />
                      </div>
                      {revision.description ? <p className="mt-1 text-sm text-muted-foreground">{revision.description}</p> : null}
                      {revision.attachments?.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={`${import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1"}/workspaces/attachments/${attachment.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                        >
                          <Paperclip className="h-4 w-4" aria-hidden="true" />
                          {attachment.originalFilename}
                        </a>
                      ))}
                    </article>
                  )}
                />
              ) : (
                <p className="text-sm text-muted-foreground">No revision versions uploaded.</p>
              )}
            </div>
          </section>

          {role === "LECTURER" ? (
            <section className="grid gap-4 rounded-lg border p-4">
              <form className="grid gap-3" onSubmit={(event) => void submitNote(event)}>
                <h3 className="font-display text-sm font-bold tracking-tight">Add Session Note</h3>
                <Field label="Title" htmlFor={`note-title-${workspace.id}`}>
                  <Input id={`note-title-${workspace.id}`} name="title" minLength={3} maxLength={120} required placeholder="Note title" />
                </Field>
                <Field label="Notes" htmlFor={`note-notes-${workspace.id}`}>
                  <Textarea id={`note-notes-${workspace.id}`} name="notes" minLength={3} maxLength={8000} required placeholder="Session notes" />
                </Field>
                <Button type="submit" disabled={addNote.isPending}>
                  <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                  Save Note
                </Button>
              </form>
              <form className="grid gap-3 border-t pt-4" onSubmit={(event) => void submitFeedback(event)}>
                <h3 className="font-display text-sm font-bold tracking-tight">Add Feedback</h3>
                <Field label="Feedback" htmlFor={`feedback-text-${workspace.id}`}>
                  <Textarea
                    id={`feedback-text-${workspace.id}`}
                    name="feedback"
                    minLength={3}
                    maxLength={8000}
                    required
                    placeholder="Feedback for revision"
                  />
                </Field>
                <Field label="Visibility" htmlFor={`feedback-visibility-${workspace.id}`}>
                  <Select id={`feedback-visibility-${workspace.id}`} name="visibility" defaultValue="STUDENT_VISIBLE">
                    <option value="STUDENT_VISIBLE">Student visible</option>
                    <option value="PRIVATE">Private</option>
                  </Select>
                </Field>
                <Field label="Attachment (optional)" htmlFor={`feedback-file-${workspace.id}`} hint={uploadHint}>
                  <Input id={`feedback-file-${workspace.id}`} name="file" type="file" />
                </Field>
                <Button type="submit" disabled={addFeedback.isPending}>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Save Feedback
                </Button>
              </form>
            </section>
          ) : (
            <section className="rounded-lg border p-4">
              <form className="grid gap-3" onSubmit={(event) => void submitRevision(event)}>
                <h3 className="font-display text-sm font-bold tracking-tight">Upload Revision</h3>
                <Field label="Title" htmlFor={`revision-title-${workspace.id}`}>
                  <Input
                    id={`revision-title-${workspace.id}`}
                    name="title"
                    minLength={3}
                    maxLength={160}
                    required
                    placeholder="Revision title"
                  />
                </Field>
                <Field label="Description (optional)" htmlFor={`revision-description-${workspace.id}`}>
                  <Textarea id={`revision-description-${workspace.id}`} name="description" maxLength={2000} placeholder="Revision description" />
                </Field>
                <Field label="File" htmlFor={`revision-file-${workspace.id}`} hint={uploadHint}>
                  <Input id={`revision-file-${workspace.id}`} name="file" type="file" required />
                </Field>
                <Button type="submit" disabled={addRevision.isPending}>
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  Upload Revision
                </Button>
              </form>
            </section>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="grid gap-5">
      {[0, 1].map((index) => (
        <Card key={index}>
          <CardContent className="grid gap-5 pt-6 xl:grid-cols-2">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

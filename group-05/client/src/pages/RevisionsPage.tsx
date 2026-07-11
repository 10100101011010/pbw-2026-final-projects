import { FileText, FileUp, Paperclip } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { Field, Input, Textarea } from "../components/ui/input";
import { PageHeader } from "../components/ui/page";
import { Skeleton } from "../components/ui/skeleton";
import { StatusBadge } from "../components/ui/status-badge";
import { useToast } from "../components/ui/toast-context";
import { useAuth } from "../features/auth/auth-context";
import { useAddRevision, useWorkspaces } from "../features/workspaces/queries";
import { formatDateTime, getErrorMessage } from "../lib/utils";
import type { SessionWorkspace } from "../services/types";
import { workspaceTitle } from "./page-helpers";

const uploadHint = "PDF, Word, PowerPoint, image, or text file, up to 10 MB.";

export function RevisionsPage() {
  const { role } = useAuth();
  const workspaces = useWorkspaces();

  if (!role) return null;

  return (
    <>
      <PageHeader
        eyebrow="Revisions"
        title="Revision History"
        description="Versioned thesis revision files and feedback-linked attachments."
      />
      {workspaces.isLoading ? <RevisionsSkeleton /> : null}
      {workspaces.isError ? (
        <EmptyState
          title="Revision history unavailable"
          description={getErrorMessage(workspaces.error)}
          actionLabel="Try again"
          onAction={() => void workspaces.refetch()}
        />
      ) : workspaces.data?.length ? (
        <div className="grid gap-5">
          {workspaces.data.map((workspace) => (
            <RevisionWorkspace key={workspace.id} workspace={workspace} role={role} />
          ))}
        </div>
      ) : workspaces.data ? (
        <EmptyState
          illustration="bimbingan-3"
          title="No workspaces yet"
          description="Approved supervision sessions will create workspaces where revisions can be uploaded."
        />
      ) : null}
    </>
  );
}

function RevisionWorkspace({ workspace, role }: { workspace: SessionWorkspace; role: "STUDENT" | "LECTURER" }) {
  const { notify } = useToast();
  const addRevision = useAddRevision();

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
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>{workspaceTitle(workspace, role)}</CardTitle>
          <StatusBadge status={workspace.status} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="grid gap-0">
          {workspace.revisions?.length ? (
            workspace.revisions.map((revision, index) => (
              <div key={revision.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {index < workspace.revisions!.length - 1 ? <span className="w-px flex-1 bg-border" aria-hidden="true" /> : null}
                </div>
                <article className="flex-1 pb-4 last:pb-0">
                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="flex items-center gap-2 font-semibold tracking-tight">
                          <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                          Version {revision.versionNumber}: {revision.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(revision.createdAt)}</p>
                        {revision.description ? <p className="mt-2 text-sm">{revision.description}</p> : null}
                      </div>
                      <StatusBadge status={revision.status} />
                    </div>
                    {revision.attachments?.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={`${import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1"}/workspaces/attachments/${attachment.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                      >
                        <Paperclip className="h-4 w-4" aria-hidden="true" />
                        {attachment.originalFilename}
                      </a>
                    ))}
                  </div>
                </article>
              </div>
            ))
          ) : (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No revisions in this workspace.</p>
          )}
        </div>
        {role === "STUDENT" ? (
          <form className="grid content-start gap-3 rounded-lg border p-4" onSubmit={(event) => void submitRevision(event)}>
            <h3 className="font-display text-sm font-bold tracking-tight">Upload Revision</h3>
            <Field label="Title" htmlFor={`revision-title-${workspace.id}`}>
              <Input id={`revision-title-${workspace.id}`} name="title" minLength={3} maxLength={160} required placeholder="Revision title" />
            </Field>
            <Field label="Description (optional)" htmlFor={`revision-description-${workspace.id}`}>
              <Textarea id={`revision-description-${workspace.id}`} name="description" maxLength={2000} placeholder="Revision description" />
            </Field>
            <Field label="File" htmlFor={`revision-file-${workspace.id}`} hint={uploadHint}>
              <Input id={`revision-file-${workspace.id}`} name="file" type="file" required />
            </Field>
            <Button type="submit" disabled={addRevision.isPending}>
              <FileUp className="h-4 w-4" aria-hidden="true" />
              Upload
            </Button>
          </form>
        ) : (
          <div className="rounded-lg border bg-muted/25 p-4 text-sm leading-relaxed text-muted-foreground">
            Student revision submissions and attachment history are preserved here.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RevisionsSkeleton() {
  return (
    <div className="grid gap-5">
      {[0, 1].map((index) => (
        <Card key={index}>
          <CardContent className="grid gap-4 pt-6 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

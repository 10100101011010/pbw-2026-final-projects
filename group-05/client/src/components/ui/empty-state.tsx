import type { ReactNode } from "react";
import bimbingan1 from "../../assets/images/bimbingan-1-800.webp";
import bimbingan2 from "../../assets/images/bimbingan-2-800.webp";
import bimbingan3 from "../../assets/images/bimbingan-3-800.webp";
import { Button } from "./button";

const illustrations = {
  "bimbingan-1": bimbingan1,
  "bimbingan-2": bimbingan2,
  "bimbingan-3": bimbingan3
} as const;

type EmptyStateProps = {
  icon?: ReactNode;
  illustration?: keyof typeof illustrations;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, illustration, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/35 p-8 text-center">
      {illustration ? (
        <img
          src={illustrations[illustration]}
          alt=""
          className="mb-5 h-28 w-28 rounded-full object-cover shadow-panel sm:h-32 sm:w-32"
        />
      ) : icon ? (
        <div className="mb-4 text-muted-foreground">{icon}</div>
      ) : null}
      <h3 className="font-display text-h4 font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button type="button" variant="outline" size="sm" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

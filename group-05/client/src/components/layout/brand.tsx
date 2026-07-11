import { Link } from "react-router-dom";
import logoFull from "../../assets/images/logo-full-800.png";
import logoMark from "../../assets/images/logo-mark-192.png";
import { cn } from "../../lib/utils";

type BrandProps = {
  compact?: boolean;
  className?: string;
};

export function Brand({ compact, className }: BrandProps) {
  if (compact) {
    return (
      <Link to="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label="GTGS home">
        <img src={logoMark} alt="Universitas Gunadarma" className="h-9 w-9 object-contain" />
      </Link>
    );
  }

  return (
    <Link to="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label="GTGS home">
      <img src={logoFull} alt="Universitas Gunadarma" className="h-8 w-auto object-contain" />
      <span className="text-sm font-extrabold tracking-[0.2em] text-primary">GTGS</span>
    </Link>
  );
}

import type { StudentProfile, StudentSupervisor, User } from "../../generated/prisma/client.js";

export type EligibilityResult = {
  eligible: boolean;
  status: "ELIGIBLE" | "INCOMPLETE" | "NOT_ELIGIBLE";
  reasons: string[];
  checks: {
    officialEmail: boolean;
    minimumSks: boolean;
    piRequirement: boolean;
    hasSupervisor: boolean;
  };
};

export const STUDENT_EMAIL_SUFFIX = "@student.gunadarma.ac.id";

export const calculateEligibility = (
  user: Pick<User, "email">,
  profile: Pick<StudentProfile, "completedSks" | "piCompleted" | "isSarMag">,
  supervisors: Pick<StudentSupervisor, "isActive">[]
): EligibilityResult => {
  const checks = {
    officialEmail: user.email.toLowerCase().endsWith(STUDENT_EMAIL_SUFFIX),
    minimumSks: profile.completedSks >= 144,
    piRequirement: profile.piCompleted || profile.isSarMag,
    hasSupervisor: supervisors.filter((supervisor) => supervisor.isActive).length > 0
  };

  const reasons: string[] = [];
  if (!checks.officialEmail) reasons.push("Official Gunadarma student email is required.");
  if (!checks.minimumSks) reasons.push("Minimum 144 completed SKS required.");
  if (!checks.piRequirement) reasons.push("Penulisan Ilmiah must be completed unless the student is Sarjana-Magister.");
  if (!checks.hasSupervisor) reasons.push("At least one assigned supervisor is required.");

  return {
    eligible: Object.values(checks).every(Boolean),
    status: Object.values(checks).every(Boolean) ? "ELIGIBLE" : checks.officialEmail ? "INCOMPLETE" : "NOT_ELIGIBLE",
    reasons,
    checks
  };
};

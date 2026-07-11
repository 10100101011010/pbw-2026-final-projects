import type { ApiUser, LecturerProfile, StudentProfile, UserRole } from "../services/types";

export const getUserProfile = (user?: ApiUser | null): StudentProfile | LecturerProfile | null => {
  if (!user) return null;
  return user.profile ?? user.studentProfile ?? user.lecturerProfile ?? null;
};

export const getUserDisplayName = (user?: ApiUser | null) => getUserProfile(user)?.fullName ?? user?.email ?? "GTGS User";

export const getUserSubtitle = (user?: ApiUser | null) => {
  const profile = getUserProfile(user);
  if (!profile) return user?.role === "LECTURER" ? "Thesis Supervisor" : "Student";
  if ("npm" in profile) return `${profile.npm} | ${profile.studyProgram}`;
  return `${profile.academicTitle} | ${profile.department}`;
};

export const getDashboardPath = (role?: UserRole | null) => (role === "LECTURER" ? "/lecturer/dashboard" : "/student/dashboard");

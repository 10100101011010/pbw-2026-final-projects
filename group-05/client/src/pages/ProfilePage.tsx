import { Mail, ShieldCheck, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { PageGrid, PageHeader } from "../components/ui/page";
import { StatusBadge } from "../components/ui/status-badge";
import { useAuth } from "../features/auth/auth-context";
import { getUserDisplayName, getUserProfile, getUserSubtitle } from "../lib/user";

export function ProfilePage() {
  const { user, role } = useAuth();
  const profile = getUserProfile(user);

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title={getUserDisplayName(user)}
        description="Official academic identity used by GTGS authorization, eligibility checks, and supervision records."
      />
      <PageGrid className="lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <UserRound className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="font-semibold tracking-tight">{getUserDisplayName(user)}</p>
                <p className="text-sm text-muted-foreground">{getUserSubtitle(user)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm font-semibold">{user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <StatusBadge status={user?.status ?? "UNKNOWN"} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{role === "LECTURER" ? "Lecturer Profile" : "Student Profile"}</CardTitle>
          </CardHeader>
          <CardContent>
            {profile ? (
              <dl className="grid gap-4 sm:grid-cols-2">
                {"npm" in profile ? (
                  <>
                    <div>
                      <dt className="text-sm font-semibold text-muted-foreground">NPM</dt>
                      <dd className="mt-1 font-semibold tracking-tight">{profile.npm}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-muted-foreground">Study Program</dt>
                      <dd className="mt-1 font-semibold tracking-tight">{profile.studyProgram}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-muted-foreground">Completed SKS</dt>
                      <dd className="mt-1 font-semibold tracking-tight">{profile.completedSks}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-muted-foreground">Academic Status</dt>
                      <dd className="mt-1">
                        <StatusBadge status={profile.academicStatus} />
                      </dd>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <dt className="text-sm font-semibold text-muted-foreground">Lecturer Code</dt>
                      <dd className="mt-1 font-semibold tracking-tight">{profile.lecturerCode}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-muted-foreground">Department</dt>
                      <dd className="mt-1 font-semibold tracking-tight">{profile.department}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-muted-foreground">Academic Title</dt>
                      <dd className="mt-1 font-semibold tracking-tight">{profile.academicTitle}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-muted-foreground">Office</dt>
                      <dd className="mt-1 font-semibold tracking-tight">{profile.officeLocation ?? "Not set"}</dd>
                    </div>
                  </>
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">Profile data is not available for this account.</p>
            )}
          </CardContent>
        </Card>
      </PageGrid>
    </>
  );
}

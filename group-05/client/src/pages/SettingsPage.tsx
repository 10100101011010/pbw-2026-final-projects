import { Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "../app/theme-context";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { PageHeader } from "../components/ui/page";
import { cn } from "../lib/utils";

const themeOptions: { value: Theme; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" }
];

export function SettingsPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <>
      <PageHeader eyebrow="Settings" title="Interface Settings" description="Personal display preferences for this browser." />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Theme selection">
            {themeOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={theme === option.value ? "primary" : "outline"}
                onClick={() => setTheme(option.value)}
                className={cn("min-w-28", theme === option.value && "shadow-sm")}
              >
                {option.value === "dark" ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
                {option.label}
              </Button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Current resolved theme: {resolvedTheme}.</p>
        </CardContent>
      </Card>
    </>
  );
}

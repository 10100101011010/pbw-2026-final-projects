import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import loginImage from "../assets/images/bimbingan-2-1600.webp";
import { Brand } from "../components/layout/brand";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Field, Input } from "../components/ui/input";
import { useToast } from "../components/ui/toast-context";
import { useAuth } from "../features/auth/auth-context";
import { getDashboardPath } from "../lib/user";
import { getErrorMessage } from "../lib/utils";

const rememberedEmailKey = "gtgs_remembered_email";

const loginSchema = z.object({
  email: z.string().email("Enter a valid official email."),
  password: z.string().min(8, "Password must contain at least 8 characters."),
  remember: z.boolean()
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LocationState = {
  from?: {
    pathname?: string;
  };
};

const devAccounts = [
  { label: "Student", email: "ayu@student.gunadarma.ac.id" },
  { label: "Lecturer", email: "diana@staff.gunadarma.ac.id" }
];

export function LoginPage() {
  const { isAuthenticated, isLoading, login, role } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const rememberedEmail = window.localStorage.getItem(rememberedEmailKey) ?? "";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: rememberedEmail,
      password: "",
      remember: Boolean(rememberedEmail)
    }
  });

  useEffect(() => {
    document.title = "Login | GTGS";
  }, []);

  if (!isLoading && isAuthenticated) {
    return <Navigate to={getDashboardPath(role)} replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const current = await login({ email: values.email, password: values.password });
      if (values.remember) {
        window.localStorage.setItem(rememberedEmailKey, values.email);
      } else {
        window.localStorage.removeItem(rememberedEmailKey);
      }
      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname ?? getDashboardPath(current.role), { replace: true });
      notify({ title: "Welcome back", description: "Your GTGS session is ready.", variant: "success" });
    } catch (error) {
      notify({ title: "Login failed", description: getErrorMessage(error), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <img src={loginImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="absolute inset-0 bg-slate-950/35" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          <Brand className="text-white" />
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/75">Universitas Gunadarma</p>
            <h1 className="mt-4 font-display text-h1 font-bold tracking-tight">Structured thesis guidance starts here.</h1>
            <p className="mt-4 text-base leading-relaxed text-white/84">
              View validated academic status, request supervision slots, review approvals, and preserve each session as formal
              supervision history.
            </p>
          </motion.div>
          <p className="text-sm text-white/76">Asia/Jakarta scheduling. Student and lecturer roles only.</p>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
            <Brand />
            <Link to="/" className="text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground">
              Home
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Login to GTGS</CardTitle>
              <CardDescription>Use your official Gunadarma account to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <Field label="Email" htmlFor="email" error={form.formState.errors.email?.message}>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input id="email" type="email" autoComplete="email" className="pl-9" {...form.register("email")} />
                  </div>
                </Field>
                <Field label="Password" htmlFor="password" error={form.formState.errors.password?.message}>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="pl-9 pr-10"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  </div>
                </Field>
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <input type="checkbox" className="h-4 w-4 rounded border-input accent-primary" {...form.register("remember")} />
                    Remember me
                  </label>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Login"}
                </Button>
              </form>

              {import.meta.env.DEV ? (
                <div className="mt-6 rounded-xl border bg-muted/35 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Development accounts</p>
                  <div className="mt-3 grid gap-2">
                    {devAccounts.map((account) => (
                      <Button
                        key={account.email}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          form.setValue("email", account.email, { shouldValidate: true });
                          form.setValue("password", "Password123!", { shouldValidate: true });
                        }}
                      >
                        Fill {account.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

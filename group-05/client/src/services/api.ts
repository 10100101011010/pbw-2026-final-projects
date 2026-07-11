import type { ApiEnvelope, AuthResponse } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";
const ACCESS_TOKEN_KEY = "gtgs_access_token";

const readStoredToken = () => window.localStorage.getItem(ACCESS_TOKEN_KEY);

let accessToken = readStoredToken();

export const tokenStore = {
  get: () => accessToken,
  set: (token: string) => {
    accessToken = token;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clear: () => {
    accessToken = null;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
};

const isFormData = (body: ApiRequestOptions["body"]): body is FormData => body instanceof FormData;

const createHeaders = (body: ApiRequestOptions["body"], headers?: HeadersInit) => {
  const next = new Headers(headers);
  if (!isFormData(body) && body !== undefined && !next.has("Content-Type")) {
    next.set("Content-Type", "application/json");
  }
  if (accessToken) {
    next.set("Authorization", `Bearer ${accessToken}`);
  }
  return next;
};

const serializeBody = (body: ApiRequestOptions["body"]) => {
  if (body === undefined || body === null) return undefined;
  return isFormData(body) || typeof body === "string" ? body : JSON.stringify(body);
};

type ValidationIssue = { path?: string; message?: string };

const buildErrorMessage = (envelope: ApiEnvelope<unknown> | null) => {
  const error = envelope?.error;
  const details = error?.details as { issues?: ValidationIssue[] } | undefined;
  const issues = details?.issues;
  if (Array.isArray(issues) && issues.length > 0) {
    return issues
      .map((issue) => (issue.path ? `${issue.path}: ${issue.message ?? "Invalid value."}` : (issue.message ?? "Invalid value.")))
      .join(" ");
  }
  return error?.message ?? "Unable to complete the request.";
};

const refreshAccessToken = async () => {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: "{}"
  });
  if (!response.ok) return false;
  const envelope = (await response.json()) as ApiEnvelope<AuthResponse>;
  tokenStore.set(envelope.data.accessToken);
  return true;
};

export const apiRequest = async <T>(path: string, options: ApiRequestOptions = {}, retry = true): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: createHeaders(options.body, options.headers),
    body: serializeBody(options.body)
  });

  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return apiRequest<T>(path, options, false);
    tokenStore.clear();
    window.dispatchEvent(new Event("gtgs:unauthorized"));
  }

  const envelope = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || !envelope?.success) {
    throw new Error(buildErrorMessage(envelope));
  }
  return envelope.data;
};

import { apiRequest, tokenStore } from "./api";
import type { ApiUser, AuthResponse } from "./types";

export type LoginInput = {
  email: string;
  password: string;
};

export const authService = {
  async login(input: LoginInput) {
    const result = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: input
    });
    tokenStore.set(result.accessToken);
    return result.user;
  },
  async me() {
    return apiRequest<ApiUser>("/auth/me");
  },
  async refresh() {
    const result = await apiRequest<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: {}
    });
    tokenStore.set(result.accessToken);
    return result.user;
  },
  async logout() {
    await apiRequest<{ loggedOut: boolean }>("/auth/logout", {
      method: "POST",
      body: {}
    }).catch(() => undefined);
    tokenStore.clear();
  },
  hasToken() {
    return Boolean(tokenStore.get());
  }
};

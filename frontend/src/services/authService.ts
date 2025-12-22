import { api } from "./api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
}

export const authService = {
  async register(data: RegisterData) {
    const res = await api.post<AuthResponse>("/auth/register", data);

    localStorage.setItem("token", res.data.accessToken);

    return res.data;
  },

  async login(data: LoginData) {
    const res = await api.post<AuthResponse>("/auth/login", data);

    localStorage.setItem("token", res.data.accessToken);

    return res.data;
  },

  async getCurrentUser() {
    const res = await api.get("/users/me");
    return res.data;
  },

  logout() {
    localStorage.removeItem("token");
  },
};

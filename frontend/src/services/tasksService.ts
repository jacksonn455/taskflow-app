import { api } from "./api";

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  done: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export const tasksService = {
  async getTasks(): Promise<Task[]> {
    const res = await api.get("/tasks");
    return res.data;
  },

  async getStats(): Promise<TaskStats> {
    const res = await api.get("/tasks/stats");
    return res.data;
  },

  async createTask(data: CreateTaskData): Promise<Task> {
    const res = await api.post("/tasks", data);
    return res.data;
  },

  async updateTask(id: string, data: CreateTaskData): Promise<Task> {
    // 🔥 backend usa PATCH
    const res = await api.patch(`/tasks/${id}`, data);
    return res.data;
  },

  async markAsDone(id: string): Promise<Task> {
    // 🔥 backend usa POST + mark-done
    const res = await api.post(`/tasks/${id}/mark-done`);
    return res.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

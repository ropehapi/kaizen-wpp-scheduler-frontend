import axios from "axios";
import type {
  Schedule,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  APIResponse,
  PaginatedResponse,
  ScheduleStatus,
} from "@/types/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  headers: { "Content-Type": "application/json" },
});

// JWT interceptor (ready for future auth)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.error || error.message || "Erro inesperado";
    return Promise.reject(new Error(message));
  }
);

export const schedulesApi = {
  list: async (params?: {
    status?: ScheduleStatus;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await api.get<PaginatedResponse<Schedule[]>>(
      "/schedules",
      { params }
    );
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<APIResponse<Schedule>>(`/schedules/${id}`);
    return data;
  },

  create: async (payload: CreateScheduleRequest) => {
    const { data } = await api.post<APIResponse<Schedule>>(
      "/schedules",
      payload
    );
    return data;
  },

  update: async (id: string, payload: UpdateScheduleRequest) => {
    const { data } = await api.put<APIResponse<Schedule>>(
      `/schedules/${id}`,
      payload
    );
    return data;
  },

  cancel: async (id: string) => {
    const { data } = await api.patch<APIResponse<Schedule>>(
      `/schedules/${id}/cancel`
    );
    return data;
  },
};

export default api;

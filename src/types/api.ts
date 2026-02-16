// Types derived from OpenAPI contract

export type ScheduleStatus = "scheduled" | "sent" | "canceled";
export type ScheduleType = "once" | "recurring";
export type Frequency = "daily" | "weekly" | "monthly";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  scheduleId: string;
}

export interface Schedule {
  id: string;
  message: string;
  scheduledAt: string;
  status: ScheduleStatus;
  type: ScheduleType;
  frequency?: Frequency;
  contacts: Contact[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequest {
  name: string;
  phone: string;
}

export interface CreateScheduleRequest {
  message: string;
  scheduledAt: string;
  type: ScheduleType;
  frequency?: Frequency;
  contacts: CreateContactRequest[];
}

export interface UpdateScheduleRequest {
  message?: string;
  scheduledAt?: string;
  type?: ScheduleType;
  frequency?: Frequency;
  contacts?: CreateContactRequest[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface APIResponse<T = unknown> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = unknown> {
  data?: T;
  error?: string;
  pagination?: PaginationInfo;
}

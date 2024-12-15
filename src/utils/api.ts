import axios from "axios";
import { IPaginatedRecords, Task } from "./types";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getTasks = async ({ search = "", sort = "", page = 1, limit = 10, sortBy = "", status = "" }) => {
  const { data } = await api.get("/task", { params: { search, sort, page, limit, sortBy, status } });
  return data as IPaginatedRecords<Task>;
};

export const getTask = async (id: string): Promise<Task> => {
  const response = await api.get(`/task/${id}`);
  return response.data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const response = await api.post("/task", task);
  return response.data;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  const response = await api.put(`/task/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/task/${id}`);
};

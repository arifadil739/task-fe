import { Task } from '@/utils/types'
import { create } from 'zustand'

interface TaskStore {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (updatedTask: Task) => void
  deleteTask: (id: string) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
    })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task._id !== id) })),
}))


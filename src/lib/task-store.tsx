import { ColumnType, TaskType } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateID_v1 } from "./gen-ids";

interface TaskState {
  tasks: TaskType[];
  activeColumn: ColumnType | null;
  activeTask: TaskType | null;
  setActiveColumn: (activeColumn: ColumnType | null) => void;
  setActiveTask: (activeTask: TaskType | null) => void;
  createTask: (columnId: string | number) => void;
  updateTask: (taskId: string | number, content: string) => void;
  deleteTask: (taskId: string | number) => void;
  reorderTasks: (tasks: TaskType[]) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      activeColumn: null,
      activeTask: null,
      setActiveColumn: (activeColumn) => set({ activeColumn }),
      setActiveTask: (activeTask) => set({ activeTask }),
      createTask: (columnId) => {
        // append task to tasks array end
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: generateID_v1(),
              columnId: columnId,
              content: `Task ${state.tasks.length + 1}`,
            },
          ],
        }));
      },
      updateTask: (taskId, content) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, content } : { ...task },
          ),
        }));
      },
      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
      },
      reorderTasks: (tasks) => set({ tasks: tasks }),
    }),

    { name: "kanban-store", skipHydration: true },
  ),
);

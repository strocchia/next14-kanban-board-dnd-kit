"use client";

import {
  ReactNode,
  useState,
  useEffect,
  createContext,
  useContext,
  SetStateAction,
} from "react";
import { Doc, Id } from "@/../convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DragStartEvent, DragEndEvent, DragOverEvent } from "@dnd-kit/core";

export type ColumnProps = {
  id: string | number;
  title: string;
};

export type TaskProps = {
  _id: Id<"dnd_tasks">;
  // id?: string | number;
  columnId: string | number;
  content: string;
};

interface Props {
  tasks: TaskProps[];
  setTasks: (state: SetStateAction<TaskProps[]>) => void;
  activeTask?: TaskProps | null;
  activeColumn?: ColumnProps | null;
  createTask: (columnId: string | number) => void;
  updateTask: (taskId: Id<"dnd_tasks">, content: string) => void;
  deleteTask: (taskId: Id<"dnd_tasks">) => void;
  onDragStart: (start_evt: DragStartEvent) => void;
  onDragEnd: (end_evt: DragEndEvent) => void;
  onDragOver: (over_evt: DragOverEvent) => void;
}

export const TaskContext = createContext<Props>({} as Props);

export default function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  const [activeColumn, setActiveColumn] = useState<ColumnProps | null>(null);
  const [activeTask, setActiveTask] = useState<TaskProps | null>(null);

  const retrieve = useQuery(api.tasks.getTasks);
  const create = useMutation(api.tasks.createTask);
  const update = useMutation(api.tasks.updateTask);
  const remove = useMutation(api.tasks.deleteTask);

  useEffect(() => {
    if (retrieve) setTasks(retrieve);
  }, [retrieve]);

  const createTask = (columnId: string | number) => {
    const newTask: TaskProps = {
      _id: "" as Id<"dnd_tasks">,
      columnId: columnId as string,
      content: `Task ${tasks.length + 1}`,
    };

    // append task to tasks array end
    setTasks((tasks) => [...tasks, newTask]);

    // save back to convex db
    create({ columnId: newTask.columnId as string, content: newTask.content });
  };

  const updateTask = (taskId: Id<"dnd_tasks">, content: string) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task._id === taskId ? { ...task, content } : { ...task },
      ),
    );

    // reflect in convex database as well
    update({ id: taskId, content: content });
  };

  const deleteTask = (taskId: Id<"dnd_tasks">) => {
    setTasks((tasks) => tasks.filter((task) => task._id !== taskId));

    // reflect deletion in convex database
    remove({ id: taskId });
  };

  const onDragStart = (evt: DragStartEvent) => {
    console.log(evt);
  };
  const onDragEnd = (evt: DragEndEvent) => {
    console.log(evt);
  };
  const onDragOver = (evt: DragOverEvent) => {
    console.log(evt);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        activeTask,
        activeColumn,
        createTask,
        updateTask,
        deleteTask,
        onDragStart,
        onDragEnd,
        onDragOver,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => {
  return useContext(TaskContext);
};

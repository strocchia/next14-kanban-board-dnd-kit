"use client";

import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { useTaskStore } from "./task-store";
import { arrayMove } from "@dnd-kit/sortable";
import { ReactNode, createContext } from "react";

interface DragProps {
  onDragStart: (start_evt: DragStartEvent) => void;
  onDragEnd: (end_evt: DragEndEvent) => void;
  onDragOver: (over_evt: DragOverEvent) => void;
}

export const DragProviderContext = createContext<DragProps>({} as DragProps);

export const DragHelpers = ({ children }: { children: ReactNode }) => {
  const tasks = useTaskStore((state) => state.tasks);
  const setActiveColumn = useTaskStore((state) => state.setActiveColumn);
  const setActiveTask = useTaskStore((state) => state.setActiveTask);
  const reorderTasks = useTaskStore((state) => state.reorderTasks);

  const onDragStart = (start_evt: DragStartEvent) => {
    console.log(start_evt);

    const active_data = start_evt.active.data.current;

    if (!active_data) return;

    if (active_data.type === "Column") {
      setActiveColumn(active_data.column);
      return;
    }

    if (active_data.type === "Task") {
      setActiveTask(active_data.task);
      return;
    }
  };

  const onDragEnd = (end_evt: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
  };

  const onDragOver = (over_evt: DragOverEvent) => {
    if (!over_evt.over) return;

    const activeId = over_evt.active.id;
    const overId = over_evt.over.id;

    if (activeId === overId) return;

    // dragging task over task
    if (
      over_evt.active.data.current?.type === "Task" &&
      over_evt.over.data.current?.type === "Task"
    ) {
      const activeIndex = tasks.findIndex((tsk) => tsk.id === activeId);
      const overIndex = tasks.findIndex((tsk) => tsk.id === overId);

      console.log(tasks[activeIndex], tasks[overIndex]);

      tasks[activeIndex].columnId = tasks[overIndex].columnId;

      reorderTasks(arrayMove(tasks, activeIndex, overIndex));
    }

    // dragging task over column (i.e. empty space where no task exists)
    if (
      over_evt.active.data.current?.type === "Task" &&
      over_evt.over.data.current?.type === "Column"
    ) {
      const activeIndex = tasks.findIndex((tsk) => tsk.id === activeId);

      tasks[activeIndex].columnId = overId;

      reorderTasks(arrayMove(tasks, activeIndex, activeIndex));
    }
  };

  return (
    <DragProviderContext.Provider
      value={{
        onDragStart,
        onDragEnd,
        onDragOver,
      }}
    >
      {children}
    </DragProviderContext.Provider>
  );
};

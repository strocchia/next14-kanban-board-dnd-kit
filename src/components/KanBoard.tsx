"use client";

import React, { useState, useMemo, useEffect, useContext } from "react";
import { ColumnType, TaskType } from "@/types";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import Column from "./Column";
import { createPortal } from "react-dom";
import { generateID_v2 } from "@/lib/gen-ids";
import TaskCard from "./TaskCard";

import { useTaskStore } from "@/lib/task-store";
import { DragHelpers, DragProviderContext } from "@/lib/drag-helpers";

type Props = {};

const defaultCols: ColumnType[] = [
  { id: "todo", title: "Todo" },
  { id: "progress", title: "WIP" },
  { id: "done", title: "Done" },
  { id: "backlog", title: "Backlog" },
];

const defaultTasks: TaskType[] = [
  // { id: generateID_v2().toString(), columnId: "todo", content: "Do something" },
  // {
  //   id: generateID_v2().toString(),
  //   columnId: "todo",
  //   content: "Do something else",
  // },
  // {
  //   id: generateID_v2().toString(),
  //   columnId: "todo",
  //   content: "Analyze code architecture",
  // },
];

export default function KanBoard({}: Props) {
  const [columns, setColumns] = useState<ColumnType[]>(defaultCols);
  const columnIds = columns?.map((col) => col.id);

  // const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  // const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 10px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const tasks = useTaskStore((state) => state.tasks);
  const activeTask = useTaskStore((state) => state.activeTask);
  const activeColumn = useTaskStore((state) => state.activeColumn);
  const createTask = useTaskStore((state) => state.createTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const { onDragStart, onDragOver, onDragEnd } =
    useContext(DragProviderContext);

  useEffect(() => {
    // manually rehydrate
    useTaskStore.persist.rehydrate();
  }, []);

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-y-hidden overflow-x-scroll px-10">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnIds}>
              {columns.map((col, index) => (
                <Column
                  key={col.id || index}
                  column={col}
                  createTask={createTask}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>

          {/* <button
            className="flex gap-4 h-[60px] w-[350px] min-w-80 cursor-pointer rounded-lg bg-mainBgColor border-2 border-colBgColor p-4 ring-0 ring-teal-500 hover:ring-1"
            onClick={() => console.log("nothing to see here...")}
          >
            <PlusIcon />
            Add Column
          </button> */}
        </div>

        <DragOverlay>
          {activeColumn && (
            <Column
              column={activeColumn}
              createTask={createTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
              tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
            />
          )}
          {activeTask && (
            <TaskCard
              task={activeTask}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          )}
        </DragOverlay>

        {/* {createPortal(
          <DragOverlay>
            {activeColumn && <Column column={activeColumn} />}

            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>,
          document.body,
        )} */}
      </DndContext>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
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
import PlusIcon from "./icons/PlusIcon1";
import Column from "./Column";
import { createPortal } from "react-dom";
import { generateID_v1, generateID_v2, generateID_v3 } from "@/lib/gen-ids";
import TaskCard from "./TaskCard";

type Props = {};

const defaultCols: ColumnType[] = [
  { id: "todo", title: "Todo" },
  { id: "progress", title: "WIP" },
  { id: "done", title: "Done" },
  { id: "backlog", title: "Backlog" },
];

const defaultTasks: TaskType[] = [
  { id: generateID_v1().toString(), columnId: "todo", content: "Do something" },
  {
    id: generateID_v1().toString(),
    columnId: "todo",
    content: "Do something else",
  },
  {
    id: generateID_v1().toString(),
    columnId: "todo",
    content: "Analyze code architecture",
  },
];

export default function KanBoard({}: Props) {
  const [columns, setColumns] = useState<ColumnType[]>(defaultCols);
  const columnIds = columns?.map((col) => col.id);

  const [tasks, setTasks] = useState<TaskType[]>(defaultTasks);

  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  //
  // Drag functions
  //

  const onDragStart = (start_evt: DragStartEvent) => {
    // console.log("Drag start", start_evt);

    const active_data = start_evt.active.data.current;

    if (!active_data) return;

    // const active_id = start_evt.active.id as string;
    // if (
    //   active_id === "todo" ||
    //   active_id === "progress" ||
    //   active_id === "done"
    // )

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
    // console.log("Drag end event fired", end_evt);
    setActiveColumn(null);
    setActiveTask(null);
    console.log("Set active column and task to null");

    // if (!end_evt.over) return;
    // const activeColumnId = end_evt.active.id;
    // const overColumnId = end_evt.over.id;
    // if (activeColumnId === overColumnId) return;
  };

  const onDragOver = (over_evt: DragOverEvent) => {
    // console.log(over_evt);

    if (!over_evt.over) return;

    const activeId = over_evt.active.id;
    const overId = over_evt.over.id;

    if (activeId === overId) return;

    // dragging task over task
    if (
      over_evt.active.data.current?.type === "Task" &&
      over_evt.over.data.current?.type === "Task"
    ) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((tsk) => tsk.id === activeId);
        const overIndex = tasks.findIndex((tsk) => tsk.id === overId);

        console.log(tasks[activeIndex], tasks[overIndex]);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // dragging task over column (i.e. empty space where no task exists)
    if (
      over_evt.active.data.current?.type === "Task" &&
      over_evt.over.data.current?.type === "Column"
    ) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((tsk) => tsk.id === activeId);

        tasks[activeIndex].columnId = overId;

        console.log("Task over Column", { activeIndex });

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  //
  // Task helper functions
  //

  const createTask = (columnId: string | number) => {
    const newTask: TaskType = {
      //   id: generateID_v3(),
      id: generateID_v1(),
      columnId: columnId,
      content: `Task ${tasks.length + 1}`,
    };

    // append task
    setTasks([
      ...tasks,
      {
        id: generateID_v1(),
        columnId: columnId,
        content: `Task ${tasks.length + 1}`,
      },
    ]);

    // // prepend task
    // setTasks([
    //   {
    //     id: generateID_v3(),
    //     columnId: columnId,
    //     content: `Task ${tasks.length + 1}`,
    //   },
    //   ...tasks,
    // ]);
  };

  const updateTask = (taskId: string | number, content: string) => {
    const newTasks = tasks.map((task) =>
      task.id !== taskId ? { ...task } : { ...task, content },
    );

    setTasks(newTasks);
  };

  const deleteTask = (taskId: string | number) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
  };

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

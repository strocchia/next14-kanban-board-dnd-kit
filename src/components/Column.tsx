import { ColumnType, TaskType } from "@/types";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from "react";
import PlusIcon from "./icons/PlusIcon1";
import TaskCard from "./TaskCard";

type Props = {
  column: ColumnType;
  tasks: TaskType[];
  createTask: (columnId: string | number) => void;
  updateTask: (taskId: string | number, content: string) => void;
  deleteTask: (taskId: string | number) => void;
};

export default function Column({
  column,
  tasks,
  createTask,
  updateTask,
  deleteTask,
}: Props) {
  const [isEditMode, setEditMode] = useState(false);

  const taskIds = tasks?.map((task) => task.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md border-2 border-rose-500 bg-colBgColor opacity-50"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="my-auto flex h-[80vh] max-h-screen w-[22vw] flex-col rounded-md bg-colBgColor"
    >
      {/* Column title */}
      <div
        className="flex h-[60px] rounded-md rounded-b-none border border-colBgColor bg-mainBgColor p-4 text-base font-bold"
        {...attributes}
        {...listeners}
      >
        <div className="flex gap-2">{column.title}</div>
      </div>

      {/* Column content */}
      <div className="flex flex-grow flex-col gap-4 overflow-y-auto p-2">
        <SortableContext items={taskIds}>
          {tasks.map((task, idx) => (
            <TaskCard
              key={task.id || idx}
              task={task}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          ))}
        </SortableContext>
      </div>

      {/* Column footer */}
      <button
        className="flex items-center gap-2 rounded-md border-colBgColor p-4 hover:bg-mainBgColor active:bg-black"
        onClick={() => createTask(column.id)}
      >
        <PlusIcon />
        Add a task
      </button>
    </div>
  );
}

import { TaskType } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { TrashIcon } from "./icons/TrashIcon";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  task: TaskType;
  updateTask: (taskId: string | number, content: string) => void;
  deleteTask: (taskId: string | number) => void;
};

export default function TaskCard({ task, updateTask, deleteTask }: Props) {
  const [mouseOver, setMouseOver] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleEditMode = () => {
    setMouseOver(false);
    setEditMode((prev) => !prev);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-md border border-rose-500 bg-mainBgColor p-2 text-left opacity-30 ring-0 ring-teal-500 hover:ring-1 hover:ring-inset"
      />
    );
  }

  if (isEditMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-md bg-mainBgColor p-2 text-left ring-0 ring-teal-500 hover:ring-1 hover:ring-inset"
      >
        <textarea
          className="h-5/6 w-full resize-none rounded border-none bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onChange={(e) => updateTask(task.id, e.target.value)}
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
          }}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task relative flex h-[100px] min-h-[100px] cursor-grab flex-col items-center rounded-md bg-mainBgColor p-2 text-left ring-0 ring-teal-500 hover:ring-1 hover:ring-inset"
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onClick={() => toggleEditMode()}
    >
      <span className="mb-2 text-xs text-gray-400">#{task.id}</span>
      <p className="my-auto h-5/6 w-full overflow-auto whitespace-pre-wrap">
        {task.content}
      </p>

      {mouseOver && (
        <button
          className="absolute right-4 rounded bg-colBgColor stroke-white p-2 opacity-60 hover:opacity-100"
          onClick={() => deleteTask(task.id)}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

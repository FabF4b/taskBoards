import { type TaskStatus } from "./../../../context/boardContext";
import TaskCard from "./TaskCard";
import NewTaskDialog from "./NewTaskDialog";
import { useDroppable } from "@dnd-kit/react";
import type { Task } from "./../../../lib/supabase/tasks.api";

type StatusColumnProps = {
  readonly color: string;
  readonly border: string;
  readonly tasks: Task[];
  readonly children?: React.ReactNode;
  readonly title: string;
  readonly shadow: string;
  readonly id: TaskStatus;
  readonly boardId: string;
};

export default function StatusColumn({
  color,
  border,
  id,
  shadow,
  title,
  tasks,
  boardId,
  children,
}: StatusColumnProps) {
  const { isDropTarget, ref } = useDroppable({ id: id });

  return (
    <div
      className={
        isDropTarget
          ? ` ${shadow} border-taube h-fit rounded-2xl border-2 shadow-2xl/25 transition-all ease-in-out select-none`
          : `border-taube h-fit rounded-2xl border-2 transition-all ease-in-out select-none`
      }
    >
      <div
        className={`bg-greyblue border-taube flex gap-4 rounded-t-2xl border-b-2 p-4 text-lg font-bold ${color} select-none`}
      >
        <h2>{title}:</h2>
        <em>{tasks.length}</em>
      </div>
      <div
        ref={ref}
        className={
          isDropTarget
            ? `${border} scrollbar-thumb-greyblue flex max-h-[70vh] flex-col gap-6 overflow-y-auto border-2 border-dashed p-6 transition-all ease-in-out`
            : `scrollbar-thumb-greyblue flex max-h-[70vh] flex-col gap-6 overflow-y-auto border-2 border-transparent p-6 transition-all ease-in-out`
        }
      >
        {tasks.length === 0 ? (
          <p className="p-4 text-zinc-500 italic">kein Aufgaben vorhanden</p>
        ) : (
          <>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </>
        )}

        {children}
      </div>
      <NewTaskDialog status={id} color={color} boardId={boardId} />
    </div>
  );
}

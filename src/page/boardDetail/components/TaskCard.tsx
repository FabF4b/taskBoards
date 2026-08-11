import { useDraggable } from "@dnd-kit/react";
import { useState } from "react";
import { Dialog, DialogContent } from "../../../components/ui/dialog";
import EditTaskDialog from "./EditTaskDialog";
import { Calendar, CircleUser } from "lucide-react";
import type { Task } from "./../../../lib/supabase/tasks.api";

type TaskCardProps = {
  readonly task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  const { ref } = useDraggable({ id: task.id });
  const [openDialog, setOpenDialog] = useState(false);

  const prioColors = {
    niedrig: "text-yellow-200/70",
    mittel: "text-amber-500/70",
    hoch: "text-rose-700/70",
  } as const;

  const prioDot = {
    niedrig: "•",
    mittel: "••",
    hoch: "•••",
  } as const;

  type Priority = keyof typeof prioColors;

  function getPrioColor(status: Priority) {
    return prioColors[status];
  }

  function getPrioDot(status: Priority) {
    return prioDot[status];
  }

  function checkDeadline(date: string) {
    const today = new Date();
    const dueDate = new Date(date);

    return dueDate < today;
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <button
        type="button"
        ref={ref}
        onClick={() => setOpenDialog(true)}
        className="border-greyblue hover:bg-taube/15 hover:border-taube grid grid-cols-[1fr_auto] items-start rounded-2xl border p-4 text-left transition select-none"
      >
        <div className="flex flex-col">
          <div className="flex">
            <h3 className="px-2">{task.title}</h3>
            {task.priority && (
              <div className="group relative">
                <p className={`${getPrioColor(task.priority as Priority)}`}>
                  {getPrioDot(task.priority as Priority)}
                </p>
                <span className="bg-taube border-greyblue absolute bottom-0 left-8 rounded-2xl px-4 py-2 text-sm opacity-0 transition-opacity group-hover:opacity-100">
                  Priorität:{" "}
                  <span
                    className={`${getPrioColor(task.priority as Priority)} uppercase`}
                  >
                    {task.priority}
                  </span>
                </span>
              </div>
            )}
          </div>
          <p className="px-2 text-sm text-pretty text-zinc-500">
            {task.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 text-sm font-light text-zinc-600">
          {task.inCharge && (
            <p className="flex items-center gap-2">
              {task.inCharge}
              <CircleUser className="size-4" />
            </p>
          )}
          {task.dueDate && (
            <p
              className={
                checkDeadline(task.dueDate)
                  ? "flex gap-2 text-red-800/80"
                  : "flex gap-2"
              }
            >
              {new Date(task.dueDate).toLocaleDateString("de-DE", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}
              <Calendar className="size-4" />
            </p>
          )}
        </div>
      </button>
      <DialogContent>
        <EditTaskDialog task={task} setOpenDialog={setOpenDialog} />
      </DialogContent>
    </Dialog>
  );
}

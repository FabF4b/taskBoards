import { useBoardContext } from "./../../../context/boardContext";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "./../../../components/ui/dialog";
import { Button } from "./../../../components/ui/button";
import { Input } from "./../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./../../../components/ui/select";
import { useState } from "react";
import { ACTION } from "./../../../context/boardContextProvider";
import { ArrowDown } from "lucide-react";
import {
  deleteTask,
  updateTask,
  type Task,
} from "./../../../lib/supabase/tasks.api";

type EditTaskProps = {
  task: Task;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditTaskDialog({ task, setOpenDialog }: EditTaskProps) {
  const { state, dispatch } = useBoardContext();
  const [deleteCheck, setDeleteCheck] = useState(false);

  const [editTask, setEditTask] = useState<Task>({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
    inCharge: task.inCharge,
    priority: task.priority,
    boardId: task.boardId,
    created_at: task.created_at,
  });

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setEditTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSelect(name: "priority" | "inCharge", value: string | null) {
    setEditTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit() {
    try {
      const updatedTask = await updateTask(task.id, editTask);
      dispatch({
        type: ACTION.UPDATETASK,
        payload: updatedTask,
      });
    } catch (error) {
      console.error("Fehler beim Laden!", error);
    } finally {
      setOpenDialog(false);
    }
  }

  async function handleDelete() {
    try {
      deleteTask(task.id);
      dispatch({
        type: ACTION.DELETETASK,
        payload: task,
      });
    } catch (error) {
      console.error("Fehler beim Laden!", error);
    } finally {
      setOpenDialog(false);
      setDeleteCheck(false);
    }
  }

  return (
    <DialogContent className="bg-taube border-snow/10 text-snow border-2 p-6">
      <DialogHeader>
        <DialogTitle className="">Aufgabe bearbeiten</DialogTitle>
        <DialogDescription className="text-snow/69 text-pretty">
          Bearbeite oder lösche die Aufgabe für diese Spalte
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <h2>Titel</h2>
        <Input
          name="title"
          className="bg-snow text-midnight mb-2"
          value={editTask.title}
          onChange={handleInput}
        />
        <h2>Beschreibung</h2>
        <Input
          name="description"
          className="bg-snow text-midnight mb-2"
          value={editTask.description ?? ""}
          onChange={handleInput}
        />
        <h2>Priorität</h2>
        <Select
          value={editTask.priority}
          onValueChange={(value) => handleSelect("priority", value)}
        >
          <SelectTrigger className="bg-snow text-midnight mb-2 w-full">
            <SelectValue>{editTask.priority}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Priorität</SelectLabel>
              <SelectItem value="hoch">Hoch</SelectItem>
              <SelectItem value="mittel">Mittel</SelectItem>
              <SelectItem value="niedrig">Niedrig</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <h2>Zugewiesen an</h2>
        <Select
          value={editTask.inCharge}
          onValueChange={(value) => handleSelect("inCharge", value)}
        >
          <SelectTrigger className="bg-snow text-midnight mb-2 w-full">
            <SelectValue>{editTask.inCharge}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Zuständige Person</SelectLabel>
              <SelectItem value={`${state.user.username}`}>
                {state.user.username}
              </SelectItem>
              <SelectItem value="Niemand">Niemand</SelectItem>
              <SelectItem value="Alle">Alle</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <h2>Deadline</h2>
        <Input
          type="date"
          name="dueDate"
          value={editTask.dueDate ?? ""}
          onChange={handleInput}
          className="bg-snow text-midnight mb-2"
        />
        <DialogFooter className="mt-4 flex sm:items-center sm:justify-between">
          {!deleteCheck ? (
            <Button
              onClick={() => setDeleteCheck(true)}
              variant="destructive"
              className="text-rose-600"
            >
              Aufgabe löschen
            </Button>
          ) : (
            <ArrowDown />
          )}
          <div className="flex gap-3">
            <Button
              onClick={() => setOpenDialog(false)}
              variant="ghost"
              className="px-3 py-1.25"
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSubmit}
              className="from-orange via-pink to-cyan rounded-2xl bg-linear-to-r p-0.5 font-semibold saturate-75 hover:saturate-150"
            >
              <p className="hover:bg-taube/95 text-snow rounded-2xl px-3 py-1.25 transition ease-in-out hover:text-white">
                Update
              </p>
            </Button>
          </div>
        </DialogFooter>
      </div>
      {deleteCheck && (
        <Button
          onClick={handleDelete}
          variant="destructive"
          className="absolute top-147 flex h-14 w-full justify-center border-transparent text-rose-600 uppercase transition"
        >
          aufgabe löschen
        </Button>
      )}
    </DialogContent>
  );
}

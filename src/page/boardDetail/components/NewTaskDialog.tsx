import { Button } from "./../../../components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
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
import {
  useBoardContext,
  type Priority,
  type TaskStatus,
} from "./../../../context/boardContext";
import { ACTION } from "./../../../context/boardContextProvider";
import { insertTask, type Task } from "./../../../lib/supabase/tasks.api";

type NewTaskProps = {
  color: string;
  status: TaskStatus;
  boardId: string;
};

type SelectName = "priority" | "inCharge";

export type CreatedTask = Omit<Task, "id" | "created_at">;

function createEmptyTask(status: TaskStatus, boardId: string): CreatedTask {
  return {
    title: "",
    description: "",
    status: status,
    dueDate: "",
    inCharge: "",
    priority: "",
    boardId: boardId,
  };
}

export default function NewTaskDialog({
  color,
  status,
  boardId,
}: NewTaskProps) {
  const { state, dispatch } = useBoardContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState(() =>
    createEmptyTask(status, boardId),
  );
  const activeButton = newTask.title.trim().length > 0;

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSelect(name: SelectName, value: string) {
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit() {
    const taskToInsert = {
      ...newTask,
      dueDate: newTask.dueDate === "" ? null : newTask.dueDate,
    };

    try {
      const insertedTask = await insertTask(taskToInsert);
      dispatch({ type: ACTION.ADDTASK, payload: insertedTask });
    } catch (error) {
      console.error("Fehler beim Laden!", error);
    } finally {
      setOpenDialog(false);
      setNewTask(createEmptyTask(status, boardId));
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger
        className={`bg-greyblue border-taube hover:bg-taube ${color} flex w-full justify-center rounded-b-2xl border-t text-xl font-semibold transition`}
      >
        +
      </DialogTrigger>
      <DialogContent className="bg-taube text-snow border-snow/10 border-2 p-6">
        <DialogHeader>
          <DialogTitle className="">Neue Aufgabe ertsellen</DialogTitle>
          <DialogDescription className="text-snow/69 text-pretty">
            Erstelle eine neue Aufgabe für diese Spalte
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <h2>Titel</h2>
          <Input
            name="title"
            className="bg-snow text-midnight mb-2"
            placeholder="Aufgabe..."
            onChange={handleInput}
            value={newTask.title}
          />

          <h2>Beschreibung</h2>
          <Input
            name="description"
            className="bg-snow text-midnight mb-2"
            placeholder="Beschreibung..."
            onChange={handleInput}
            value={newTask.description ?? ""}
          />
          <h2>Priorität</h2>
          <Select
            value={newTask.priority}
            onValueChange={(value) =>
              handleSelect("priority", value as Priority)
            }
          >
            <SelectTrigger className="bg-snow text-midnight mb-2 w-full">
              <SelectValue placeholder="Stufe auswählen" />
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
            value={newTask.inCharge}
            onValueChange={(value) =>
              handleSelect("inCharge", value as Priority)
            }
          >
            <SelectTrigger className="bg-snow text-midnight mb-2 w-full">
              <SelectValue placeholder="Person auswählen" />
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
            value={newTask.dueDate ?? ""}
            onChange={handleInput}
            className="bg-snow text-midnight mb-2"
          />
          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button
              onClick={() => setOpenDialog(false)}
              variant="ghost"
              className="hover:bg-snow px-3 py-1.25"
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!activeButton}
              className="from-orange via-pink to-cyan rounded-2xl bg-linear-to-r p-0.5 font-semibold saturate-75 hover:saturate-150"
            >
              <p className="hover:bg-taube/95 text-snow rounded-2xl px-3 py-1.25 transition ease-in-out hover:text-white">
                Erstellen
              </p>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

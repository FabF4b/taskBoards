import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useBoardContext } from "@/context/boardContext";
import { ACTION } from "@/context/boardContextProvider";
import { insertBoard, type Board } from "@/lib/supabase/boards.api";

function createEmptyBoard(): Board {
  return {
    id: "",
    created_at: "",
    title: "",
    description: "",
    tasks: [],
  };
}

export default function NewBoardDialog() {
  const { dispatch } = useBoardContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [newBoard, setNewBoard] = useState(() => createEmptyBoard());
  const activeButton = newBoard.title.trim().length > 1;

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setNewBoard((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function handleSubmit() {
    try {
      const createdBoard = await insertBoard(newBoard);
      dispatch({ type: ACTION.ADDBOARD, payload: createdBoard });
    } catch (error) {
      console.error("Fehler beim Laden!", error);
    } finally {
      setOpenDialog(false);
      setNewBoard(createEmptyBoard);
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger className="from-orange via-pink to-cyan group rounded-2xl bg-linear-to-r p-0.5 font-semibold saturate-75 hover:saturate-150">
        <p className="group-hover:bg-greyblue/96 text-snow rounded-2xl px-4 py-2 text-xl transition ease-in-out group-hover:text-white">
          + Board hinzufügen
        </p>
      </DialogTrigger>
      <DialogContent className="bg-taube text-snow border-snow/10 border-2 p-6">
        <div className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="mb-4">Neues Board ertsellen</DialogTitle>
            <DialogDescription className="text-snow/69 text-pretty">
              Gib dem Board einen Namen. Es werden automatisch drei Spalten
              angelegt{" "}
              <span className="font-light text-amber-200">
                (offen, in Bearbeitung, erledigt)
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              name="title"
              className="bg-snow text-midnight"
              placeholder="Boardname..."
              onChange={handleInput}
            />
            <Input
              name="description"
              className="bg-snow text-midnight"
              placeholder="Beschreibung..."
              onChange={handleInput}
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button
                onClick={() => setOpenDialog(false)}
                variant="ghost"
                className="hover:bg-snow"
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

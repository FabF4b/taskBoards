import { Button } from "./../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "./../../../components/ui/dialog";

import { useBoardContext } from "./../../../context/boardContext";
import { ACTION } from "./../../../context/boardContextProvider";
import { deleteBoard, type Board } from "./../../../lib/supabase/boards.api";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

type DeleteCheckDialogProps = {
  board: Board;
};

export default function DeleteCheckDialog({ board }: DeleteCheckDialogProps) {
  const { dispatch } = useBoardContext();
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  function handleDelete() {
    try {
      deleteBoard(board.id);
      dispatch({ type: ACTION.DELETEBOARD, payload: board.id });
    } catch (error) {
      console.error("Fehler beim Laden!", error);
    } finally {
      navigate("/taskBoards");
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger className="hover:border-taube hover:bg-greyblue size-12 rounded-2xl border-2 border-transparent p-2 transition ease-in-out hover:text-rose-500">
        <TrashIcon className="size-7" />
      </DialogTrigger>
      <DialogContent className="bg-taube text-snow border-snow/10 border-2 p-6">
        <DialogHeader>
          <DialogTitle className="mb-2">Board löschen</DialogTitle>
          <DialogDescription>
            <div className="text-snow/69 text-pretty">
              <p>
                Soll das Board
                <span className="text-lg font-bold text-rose-600">
                  {" "}
                  "{board.title}"{" "}
                </span>
                wirklich gelöscht werden? Diese Aktion kann nicht rückgängig
                gemacht werden.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setOpenDialog(false)}
              variant="ghost"
              className="hover:bg-snow"
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="text-rose-600"
            >
              Löschen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

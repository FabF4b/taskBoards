import { useBoardContext } from "./../../../context/boardContext";
import { ACTION } from "./../../../context/boardContextProvider";
import { Button, Input } from "@base-ui/react";
import { ArrowLeft, CheckIcon, Pencil, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import DeleteCheckDialog from "./DeleteCheckDialog";
import { updateBoard, type Board } from "./../../../lib/supabase/boards.api";

type BoardDetailMenuProps = {
  readonly board: Board;
};

export default function BoardDetailMenu({ board }: BoardDetailMenuProps) {
  const { dispatch } = useBoardContext();
  const [rename, setRename] = useState(false);
  const [editBoard, setEditBoard] = useState<Board>({
    title: board.title,
    description: board.description,
    created_at: "",
    id: board.id,
    tasks: [],
  });

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setEditBoard((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleRename() {
    try {
      await updateBoard(editBoard);
      dispatch({
        type: ACTION.UPDATEBOARD,
        payload: {
          boardId: String(editBoard.id),
          title: String(editBoard.title),
          description: String(editBoard.description),
        },
      });
    } catch (error) {
      console.error("Fehler beim Laden!", error);
    } finally {
      setRename(false);
    }
  }

  return (
    <div className="flex h-30 w-full items-center gap-4 px-4 py-8">
      <Link to={"/taskBoards"}>
        <ArrowLeft className="hover:border-taube hover:text-orange hover:bg-greyblue size-12 rounded-2xl border-2 border-transparent p-2 transition ease-in-out" />
      </Link>
      {!rename ? (
        <div className="flex w-full justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">{board.title}</h2>
            <p className="text-snow/70">{board.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setRename(true)}>
              <Pencil className="hover:border-taube hover:text-pink hover:bg-greyblue size-12 rounded-2xl border-2 border-transparent p-2 transition ease-in-out" />
            </Button>
            <DeleteCheckDialog board={board} />
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Input
              name="title"
              value={editBoard.title}
              placeholder={board.title}
              onChange={handleInput}
              className="bg-snow text-midnight w-2xs rounded-2xl px-2 text-2xl font-bold"
            ></Input>
            <Input
              name="description"
              value={editBoard.description ?? ""}
              placeholder={
                !board.description ? "Beschreibung..." : board.description
              }
              onChange={handleInput}
              className="bg-snow text-midnight w-2xs rounded-2xl px-2 text-lg"
            ></Input>
          </div>
          <div className="flex gap-4">
            <Button>
              <CheckIcon
                onClick={handleRename}
                className="hover:border-taube hover:bg-greyblue size-12 rounded-2xl border-2 border-transparent p-2 transition ease-in-out hover:text-emerald-500"
              />
            </Button>
            <Button>
              <X
                className="hover:border-taube hover:bg-greyblue size-12 rounded-2xl border-2 border-transparent p-2 transition ease-in-out hover:text-rose-500"
                onClick={() => setRename(false)}
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

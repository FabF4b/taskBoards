import { useBoardContext, type TaskStatus } from "./../../context/boardContext";
import { Link, useParams } from "react-router";
import StatusColumn from "./components/StatusColumn";
import { ACTION } from "./../../context/boardContextProvider";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import BoardDetailMenu from "./components/BoardDetailMenu";
import { getBoardById } from "./../../lib/supabase/boards.api";
import { useEffect, useMemo, useState } from "react";
import Loading from "./../../components/ui/Loading";
import { AlertTriangleIcon } from "lucide-react";
import { updateTask } from "./../../lib/supabase/tasks.api";
import { Button } from "./../../components/ui/button";

// function createEmptyBoard(): Board {
//   return {
//     id: "",
//     created_at: "",
//     title: "",
//     description: "",
//     tasks: [],
//   };
// }

export default function BoardDetail() {
  const { state, dispatch } = useBoardContext();
  const { boardId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  async function fetchBoard() {
    try {
      const board = await getBoardById(boardId ?? "");
      dispatch({ type: ACTION.SETBOARD, payload: board });
    } catch (error) {
      console.error("Fehler beim Laden!", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBoard();
  }, []);

  const statusColumns: { id: TaskStatus; title: string }[] = [
    { id: "open", title: "offene Aufgaben" },
    { id: "inProgress", title: "in Bearbeitung" },
    { id: "done", title: "Abgeschlossen" },
  ];
  const statusColors = {
    open: {
      border: "border-orange/40",
      text: "text-orange",
      shadow: "shadow-orange/35",
    },
    inProgress: {
      border: "border-pink/40",
      text: "text-pink",
      shadow: "shadow-pink/35",
    },
    done: {
      border: "border-cyan/40",
      text: "text-cyan",
      shadow: "shadow-cyan/35",
    },
  } as const;

  type Status = keyof typeof statusColors;

  function getStatusColor(status: Status) {
    return statusColors[status];
  }

  function handleDragEnd(event: DragEndEvent) {
    if (event.canceled) return;

    const draggedTask = event.operation.source?.id;
    const newStatus = event.operation.target?.id;

    if (!draggedTask || !newStatus) return;
    updateTask(String(draggedTask), { status: String(newStatus) });
    dispatch({
      type: ACTION.DRAGSTATUS,
      payload: {
        boardId: String(boardId),
        taskId: String(draggedTask),
        status: newStatus as TaskStatus,
      },
    });
  }

  const selectedBoard = useMemo(
    () => state.boards.find((b) => b.id === boardId),
    [state.boards, boardId],
  );

  if (isLoading) {
    return (
      <div className="bg-midnight flex h-[calc(100vh-5rem)] justify-center py-32">
        <Loading />
      </div>
    );
  }

  if (!selectedBoard) {
    return (
      <div className="text-snow bg-midnight flex h-[calc(100vh-5rem)] flex-col items-center gap-2 py-32">
        <AlertTriangleIcon />
        <p>Board nicht gefunden!</p>
        <Link to={"/taskBoards"} className="group mt-8">
          <Button className="from-orange via-pink to-cyan rounded-2xl bg-linear-to-r p-0.5 font-semibold saturate-75 group-hover:saturate-150">
            <p className="group-hover:bg-taube/95 text-greyblue rounded-2xl px-3 py-1.25 transition ease-in-out group-hover:text-white">
              Startseite
            </p>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-midnight text-snow mx-auto h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] w-2/3 overflow-hidden px-8">
      <BoardDetailMenu board={selectedBoard} />
      <div className="grid grid-cols-3 gap-12">
        <DragDropProvider onDragEnd={handleDragEnd}>
          {statusColumns.map((column) => (
            <StatusColumn
              key={column.id}
              title={column.title}
              id={column.id}
              border={getStatusColor(column.id).border}
              color={getStatusColor(column.id).text}
              shadow={getStatusColor(column.id).shadow}
              tasks={selectedBoard.tasks.filter(
                (task) => task.status === column.id,
              )}
              boardId={selectedBoard.id}
            />
          ))}
        </DragDropProvider>
      </div>
    </div>
  );
}

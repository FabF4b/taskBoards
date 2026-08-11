import { useBoardContext } from "../../context/boardContext";
import NewBoardDialog from "./components/NewBoardDialog";
import { Link } from "react-router";
import BoardCard from "./components/BoardCard";
import { getBoards } from "../../lib/supabase/boards.api";
import { ACTION } from "../../context/boardContextProvider";
import { useEffect, useState } from "react";
import Loading from "../../components/ui/Loading";

export default function BoardOverview() {
  const { state, dispatch } = useBoardContext();
  const [isLoading, setIsLoading] = useState(true);

  const sortedBoards = state.boards.toSorted(
    (a, b) => Number(new Date(a.created_at)) - Number(new Date(b.created_at)),
  );

  async function fetchBoards() {
    try {
      const boards = await getBoards();
      dispatch({ type: ACTION.SETBOARDS, payload: boards });
    } catch (error) {
      console.error("Fehler beim Laden!", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBoards();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-midnight flex h-[calc(100vh-5rem)] justify-center py-32">
        <Loading />
      </div>
    );
  }
  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] w-2/3 flex-col items-center justify-start">
      <div className="flex w-full items-start justify-between px-8 pt-8">
        <h2 className="text-snow text-2xl font-bold">Meine Boards</h2>
        <NewBoardDialog />
      </div>
      <div className="group mt-8 flex flex-wrap justify-center">
        {state.boards.length === 0 ? (
          <div className="text-snow mt-16 flex flex-col items-center text-lg">
            <h2 className="font-semibold">Noch keine Boards vorhanden</h2>
            <p>Erstelle ein Board um loszulegen!</p>
          </div>
        ) : (
          sortedBoards.map((board) => (
            <Link key={board.id} to={`${board.id}`}>
              <BoardCard board={board} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

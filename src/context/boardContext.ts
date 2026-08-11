import { createContext, useContext } from "react";
import type { BoardAction } from "./boardContextProvider";
import type { Board } from "./../lib/supabase/boards.api";

export type TaskStatus = "open" | "inProgress" | "done";
export type Priority = "hoch" | "mittel" | "niedrig";

export type User = {
  username: string;
};

export type BoardState = {
  boards: Board[];
  user: User;
};

export type BoardContextType = {
  state: BoardState;
  dispatch: React.Dispatch<BoardAction>;
};

export const BoardContext = createContext<BoardContextType | undefined>(
  undefined,
);

export function useBoardContext() {
  const boardContext = useContext(BoardContext);

  if (boardContext === undefined) {
    throw new Error("Context needs provider");
  }
  return boardContext;
}

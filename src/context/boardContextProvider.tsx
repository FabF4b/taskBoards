import { useReducer, type ReactNode } from "react";
import {
  BoardContext,
  type BoardState,
  type TaskStatus,
  type User,
} from "./boardContext";
import { upsertBoard, type Board } from "./../lib/supabase/boards.api";
import type { Task } from "./../lib/supabase/tasks.api";

export const ACTION = {
  SETBOARD: "setBoard",
  SETBOARDS: "setBoards",
  ADDBOARD: "addBoard",
  ADDTASK: "addTask",
  UPDATETASK: "updateTask",
  UPDATEBOARD: "updateBoard",
  DRAGSTATUS: "dragStatus",
  DELETETASK: "deleteTask",
  DELETEBOARD: "deleteBoard",
  UPDATEUSER: "updateUser",
} as const;

export type BoardAction =
  | { type: "setBoard"; payload: Board | null }
  | { type: "setBoards"; payload: Board[] }
  | { type: "addBoard"; payload: Board }
  | { type: "addTask"; payload: Task }
  | { type: "updateTask"; payload: Task }
  | {
      type: "updateBoard";
      payload: { boardId: string; title: string; description: string };
    }
  | {
      type: "dragStatus";
      payload: { boardId: string; taskId: string; status: TaskStatus };
    }
  | { type: "deleteTask"; payload: Task }
  | { type: "deleteBoard"; payload: string }
  | { type: "updateUser"; payload: User };

const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  console.log("Action:", action.type, action.payload);
  switch (action.type) {
    case ACTION.SETBOARD: {
      if (!action.payload) return state;
      return { ...state, boards: upsertBoard(state.boards, action.payload) };
    }
    case ACTION.SETBOARDS:
      return { ...state, boards: action.payload };
    case ACTION.ADDBOARD:
      return { ...state, boards: [...state.boards, action.payload] };
    case ACTION.ADDTASK:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? {
                ...board,
                tasks: [...board.tasks, action.payload],
              }
            : board,
        ),
      };
    case ACTION.UPDATETASK:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? {
                ...board,
                tasks: board.tasks.map((task) =>
                  task.id === action.payload.id ? action.payload : task,
                ),
              }
            : board,
        ),
      };
    case ACTION.UPDATEBOARD:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? {
                ...board,
                title: action.payload.title,
                description: action.payload.description,
              }
            : board,
        ),
      };
    case ACTION.DRAGSTATUS:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.boardId
            ? {
                ...board,
                tasks: board.tasks.map((task) =>
                  task.id === action.payload.taskId
                    ? { ...task, status: action.payload.status }
                    : task,
                ),
              }
            : board,
        ),
      };
    case ACTION.DELETETASK:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id !== action.payload.boardId
            ? board
            : {
                ...board,
                tasks: board.tasks.filter(
                  (task) => task.id !== action.payload.id,
                ),
              },
        ),
      };
    case ACTION.DELETEBOARD:
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.payload),
      };
    case ACTION.UPDATEUSER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const initialState: BoardState = {
  boards: [],
  user: { username: "Guest" },
};

export function BoardContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}
/*
 , () => {
    const savedboards = localStorage.getItem("boards");
    return savedboards ? JSON.parse(savedboards) : initialState;
  }

 const STORAGE_KEY = "boards";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

    */

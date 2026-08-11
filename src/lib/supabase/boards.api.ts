import { supabase } from "./supabaseClient";
import type { Database } from "./../../types/database.types";

export type Board = Database["public"]["Tables"]["boards"]["Row"] & {
  tasks: Database["public"]["Tables"]["tasks"]["Row"][];
};

export async function getBoards(): Promise<Board[]> {
  const { data: boards, error } = await supabase
    .from("boards")
    .select("*, tasks(*)");
  if (error) throw error;
  return boards;
}

export async function getBoardById(boardId: string): Promise<Board | null> {
  const { data: board, error } = await supabase
    .from("boards")
    .select("*, tasks(*)")
    .eq("id", boardId)
    .single();
  if (error) throw error;
  return board;
}

export async function insertBoard(board: Board): Promise<Board> {
  const { data, error } = await supabase
    .from("boards")
    .insert({ title: board.title, description: board.description })
    .select("*, tasks(*)")
    .single();
  if (error) throw error;
  return data;
}

export async function updateBoard(board: Board) {
  const { error } = await supabase
    .from("boards")
    .update({ title: board.title, description: board.description })
    .eq("id", board.id)
    .select();
  if (error) throw error;
}

export function upsertBoard(boards: Board[], board: Board): Board[] {
  const exists = boards.some((b) => b.id === board.id);
  return exists
    ? boards.map((b) => (b.id === board.id ? board : b))
    : [...boards, board];
}

export async function deleteBoard(id: string) {
  const { error } = await supabase.from("boards").delete().eq("id", id);
  if (error) throw error;
}

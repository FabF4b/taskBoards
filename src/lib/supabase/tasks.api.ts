import type { Database } from "./../../types/database.types";
import { supabase } from "./supabaseClient";
import type { CreatedTask } from "./../../page/boardDetail/components/NewTaskDialog";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type UpdatedTask = Database["public"]["Tables"]["tasks"]["Update"];

export async function insertTask(task: CreatedTask): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateTask(id: string, task: UpdatedTask): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(task)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

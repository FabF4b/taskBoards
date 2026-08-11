import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBoardContext } from "@/context/boardContext";
import { useState } from "react";
import { useNavigate } from "react-router";

export type User = {
  username: string;
};

export default function BoardUser() {
  const { dispatch } = useBoardContext();
  const [user, setUser] = useState<User>({ username: "" });
  const activeButton = user.username.trim().length > 2;
  const navigate = useNavigate();

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function handleSubmit() {
    localStorage.setItem("username", JSON.stringify(user));
    dispatch({ type: "updateUser", payload: user });
    navigate("/taskBoards");
  }

  return (
    <div className="bg-midnight text-snow flex h-[calc(100vh-5rem)] flex-col items-center gap-4 pt-8">
      <h1 className="text-2xl font-bold">Profil</h1>
      <div className="border-taube bg-greyblue flex max-w-xl flex-col rounded-2xl border p-6">
        <h3 className="font-semibold">Benutzernamen ändern</h3>
        <p>Ändere deinen Anzeigenamen für das Kanban-Board</p>
        <div className="mt-4 flex flex-col gap-4">
          <Input
            className="bg-snow text-midnight w-full"
            placeholder="Benutzername..."
            name="username"
            value={user.username}
            onChange={handleInput}
          />
          <div className="flex items-center justify-end gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/taskBoards")}
              className="rounded-2xl px-3 py-1.25 text-sm"
            >
              Zurück
            </Button>
            <Button
              disabled={!activeButton}
              onClick={handleSubmit}
              className="from-orange via-pink to-cyan rounded-2xl bg-linear-to-r p-0.5 font-semibold saturate-75 hover:saturate-150"
            >
              <p className="hover:bg-taube/95 text-snow rounded-2xl px-3 py-1.25 transition ease-in-out hover:text-white">
                Speichern
              </p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

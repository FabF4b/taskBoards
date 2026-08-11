import { useBoardContext } from "./../../context/boardContext";
import { AlignStartVertical, CircleUser } from "lucide-react";
import { Link } from "react-router";

export default function Navbar() {
  const { state } = useBoardContext();

  return (
    <div className="from-orange via-pink to-cyan h-20 bg-linear-to-r pb-0.75">
      <div className="bg-greyblue h-full w-full text-zinc-500">
        <div className="mx-auto flex h-full w-2/3 items-center justify-between px-8">
          <Link
            className="flex gap-2 text-xl transition ease-in-out hover:text-zinc-400"
            to={"/taskBoards"}
          >
            TaskBoards
            <AlignStartVertical />
          </Link>
          <Link
            className="flex gap-2 text-lg transition ease-in-out hover:text-zinc-400"
            to={"profile"}
          >
            <CircleUser />
            {state.user.username}
          </Link>
        </div>
      </div>
    </div>
  );
}

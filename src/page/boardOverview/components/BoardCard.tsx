import {
  Card,
  CardDescription,
  CardTitle,
} from "./../../../components/ui/card";
import type { Board } from "./../../../lib/supabase/boards.api";

type BoardCardProps = {
  board: Board;
};

export default function BoardCard({ board }: BoardCardProps) {
  const taskCount = [
    board.tasks.filter((task) => task.status === "open").length,
    board.tasks.filter((task) => task.status === "inProgress").length,
    board.tasks.filter((task) => task.status === "done").length,
  ];
  const totalTasks = board.tasks.length;
  const [open, inProgress, done] =
    totalTasks === 0
      ? [0, 0, 0]
      : taskCount.map((count) => (count / totalTasks) * 360);

  const gradient =
    open === 0 && inProgress === 0 && done >= 1
      ? `linear-gradient(270deg, #5DA92F, #9BD46A)`
      : totalTasks === 0
        ? `linear-gradient(120deg, #1f232b, #474743)`
        : `conic-gradient(
    from 0deg,
    #ff8a2a 0deg ${open - 25}deg,
    #fc51a4 ${open}deg ${open + inProgress - 25}deg,
    #67c4f2 ${open + inProgress + 25}deg 360deg
  )`;

  return (
    <div
      className="m-4 rounded-2xl p-0.5 transition ease-in-out group-hover:brightness-50 group-hover:saturate-50 hover:brightness-100 hover:saturate-100"
      style={{ background: gradient }}
    >
      <Card className="bg-greyblue w-70 rounded-2xl p-4">
        <div className="flex flex-col">
          <CardTitle className="text-snow mb-2">{board.title}</CardTitle>
          <CardDescription className="mb-4">
            {board.description}
          </CardDescription>
          <CardDescription className="">
            {board.tasks.filter((task) => task.status === "open").length} -
            {" offene Aufgaben"}
          </CardDescription>
          <CardDescription>
            {board.tasks.filter((task) => task.status === "inProgress").length}{" "}
            - {" in Bearbeitung"}
          </CardDescription>
          <CardDescription>
            {board.tasks.filter((task) => task.status === "done").length} -{" "}
            {"Abgeschlossen"}
          </CardDescription>
        </div>
      </Card>
    </div>
  );
}

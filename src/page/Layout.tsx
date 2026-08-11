import { BoardContextProvider } from "../context/boardContextProvider";
import Navbar from "../components/ui/Navbar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div id="app" className="bg-midnight font-sans">
      <BoardContextProvider>
        <Navbar />
        <Outlet />
      </BoardContextProvider>
    </div>
  );
}

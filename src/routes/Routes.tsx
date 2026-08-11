import BoardDetail from "./../page/boardDetail/BoardDetail";
import BoardOverview from "./../page/boardOverview/BoardOverview";
import BoardUser from "./../page/boardUser/BoardUser";
import Layout from "../page/Layout";

import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/taskBoards",
    element: <Layout />,
    children: [
      { index: true, element: <BoardOverview /> },
      {
        path: ":boardId",
        element: <BoardDetail />,
      },
      {
        path: "profile",
        element: <BoardUser />,
      },
    ],
  },
]);

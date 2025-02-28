import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import Videos from "../components/videos/Videos";
import HomePage from "../pages/homePage/HomePage";
import SubscribePage from "../pages/subscribePage/SubscribePage";
import Rate from "../pages/ratePage/RatePage";
import CommentsPage from "../pages/commentsPage/CommentsPage";
import PlaylistPage from "../pages/playlistPage/PlaylistPage";

const Routes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        { path: "", element: <HomePage /> },
        { path: "videos", element: <Videos /> },
        { path: "subs", element: <SubscribePage /> },
        { path: "rate", element: <Rate /> },
        { path: "cmt", element: <CommentsPage /> },
        { path: "playlist", element: <PlaylistPage /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Routes;

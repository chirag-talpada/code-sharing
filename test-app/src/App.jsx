import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";

import Home from "./pages/home/Home";
import Editor from "./pages/editor/Editor";
import Notfound from "./pages/404/Notfound";



import "./App.css";

function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/editor/:roomID",
      element: <Editor />,
    },
    {
      path:"*",
      element: <Notfound />,
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
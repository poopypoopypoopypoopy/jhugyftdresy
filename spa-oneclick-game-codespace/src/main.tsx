
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./shell/App";
import Home from "./routes/Home";
import About from "./routes/About";
import NotFound from "./routes/NotFound";
import Game from "./routes/Game";
import { ToastProvider } from "./toast/ToastProvider";
import { ToastViewport } from "./toast/ToastViewport";

const router = createBrowserRouter([
  { path: "/", element: <App />, errorElement: <NotFound />, children: [
    { index: true, element: <Home /> },
    { path: "about", element: <About /> },
    { path: "game", element: <Game /> }
  ]}
]);

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
      <ToastViewport />
    </ToastProvider>
  </React.StrictMode>
);

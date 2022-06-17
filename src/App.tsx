import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WithPlayer, WithSearchHeader, WithSidebar } from "./components";
import { AlbumPage, ArtistPage, HomePage, SearchPage } from "./pages";
import { paths } from "./utils/paths";
import { RoutesElement } from "./utils/routesElement";
import { refreshTokenSetup } from "./utils/token";

export function App() {
  refreshTokenSetup();

  return (
    <React.StrictMode>
      <BrowserRouter>
        <RoutesElement />
      </BrowserRouter>
    </React.StrictMode>
  );
}

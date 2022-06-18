import { Outlet } from "react-router-dom";
import { Player } from "./Player";

export const WithPlayer = () => (
  <>
    <Outlet />
    <Player />
  </>
);

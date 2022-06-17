import { Outlet } from "react-router-dom";
import { SearchHeader } from "./SearchHeader";
import "./WithSearchHeader.scss";

export const WithSearchHeader = () => (
  <main className="main">
    <SearchHeader />
    <Outlet />
  </main>
);

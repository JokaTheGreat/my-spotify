import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { WithPlayer, WithSearchHeader, WithSidebar } from "../components";
import { AlbumPage, ArtistPage, HomePage, SearchPage } from "../pages";
import { paths } from "./paths";
import { scrollToTop } from "./scrollToTop";

export const RoutesElement = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return (
    <Routes>
      <Route element={<WithSidebar />}>
        <Route element={<WithPlayer />}>
          <Route element={<WithSearchHeader />}>
            <Route path={paths.home} element={<HomePage />} />
            <Route
              path={paths.search(":searchRequest")}
              element={<SearchPage />}
            />
            <Route path={paths.artist(":artistId")} element={<ArtistPage />} />
            <Route path={paths.album(":albumId")} element={<AlbumPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

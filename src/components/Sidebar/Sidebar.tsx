import { Link } from "react-router-dom";
import { paths } from "../../utils/paths";
import { ReactComponent as SpotifyLogo } from "../../assets/imgs/icons/spotify-logo.svg";
import { ReactComponent as SearchIcon } from "../../assets/imgs/icons/search-icon.svg";
import "./Sidebar.scss";
import { QueryTrackList } from "../QueryTrackList/QueryTrackList";

export function Sidebar() {
  return (
    <aside className="side-bar">
      <nav className="side-bar__menu menu">
        <Link to={paths.home}>
          <SpotifyLogo />
        </Link>

        <div className="menu__top">
          <Link to={paths.home} className="menu__link">
            <SearchIcon className="menu__img" />
            <h3 className="menu__title">Поиск</h3>
          </Link>
        </div>
      </nav>

      <QueryTrackList />
    </aside>
  );
}

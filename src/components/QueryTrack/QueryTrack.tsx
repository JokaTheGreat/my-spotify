import { useDispatch } from "react-redux";
import { setCurrentTrackId } from "../../redux/tracksDataSlice";
import { Track } from "../../types";
import { SpanList } from "../SpanList/SpanList";
import "./QueryTrack.scss";

interface QueryTrackProps {
  data: Track;
  isActive?: boolean;
  number: number;
}

export function QueryTrack({
  data,
  isActive = false,
  number,
}: QueryTrackProps) {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(setCurrentTrackId(number));
  };

  return (
    <article
      onClick={onClick}
      className={"query-track " + (isActive ? "query-track_active" : "")}
    >
      <div className="query-track__cover-wrapper">
        <img
          className="query-track__cover"
          src={data.album.images[1].url || data.album.images[0].url}
        />
      </div>
      <div className="query-track__info">
        <span className="query-track__title">{data.name}</span>
        <span className="query-track__artist-container">
          <SpanList
            data={data.artists}
            linkClassName="query-track__link"
            spanClassName="current-track__artist"
          />
        </span>
      </div>
    </article>
  );
}

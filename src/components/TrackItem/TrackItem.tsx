import { Track } from "../../types/Track";
import { ReactComponent as PlayIcon } from "../../assets/imgs/icons/play-icon.svg";
import { ReactComponent as HeartIcon } from "../../assets/imgs/icons/heart-icon.svg";
import { ReactComponent as OtherIcon } from "../../assets/imgs/icons/other-icon.svg";
import "./TrackItem.scss";
import { timeToString } from "../../utils/timeToString";
import { SpanList } from "../SpanList/SpanList";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentTrackId,
  selectTracksData,
  setCurrentTrackId,
  setCurrentTrackOrder,
  setTracksData,
  toggleTrackPlaying,
} from "../../redux/tracksDataSlice";

interface TrackItemProps extends Track {
  number: number;
  viewType?: "search" | "album" | "artist";
  isActive?: boolean;
}

export function TrackItem({
  name,
  album,
  artists,
  explicit,
  duration_ms,
  number,
  viewType = "search",
  isActive = false,
}: TrackItemProps) {
  const tracksData = useSelector(selectTracksData);
  const currentTrackId = useSelector(selectCurrentTrackId);
  const dispatch = useDispatch();

  const onClick = () => {
    const tracksDataString = localStorage.getItem("tracksData");
    if (JSON.stringify(tracksData) !== tracksDataString) {
      const newTracksData = JSON.parse(tracksDataString || "");
      dispatch(setTracksData(newTracksData));
      dispatch(setCurrentTrackOrder(Array.from(Array(newTracksData).keys())));
    }

    if (number === currentTrackId) {
      dispatch(toggleTrackPlaying());
    } else {
      dispatch(setCurrentTrackId(number));
    }
  };

  return (
    <article
      onClick={onClick}
      className={"track " + (isActive ? "track_active" : "")}
    >
      <div className="track__left">
        {viewType === "search" ? (
          <div className="track__cover-container">
            <img
              src={
                album?.images && album.images.length
                  ? album.images[2].url ||
                    album.images[1].url ||
                    album.images[0].url
                  : ""
              }
              alt="Обложка"
              className="track__cover"
            />
            <div className="track__cover_shadow"></div>
            <PlayIcon className="track__play" />
          </div>
        ) : viewType === "album" ? (
          <div className="track__number-container">
            <span className="track__number">{number + 1}</span>
            <PlayIcon className="track__play" />
          </div>
        ) : (
          <>
            <div className="track__number-container">
              <span className="track__number">{number + 1}</span>
              <PlayIcon className="track__play" />
            </div>
            <div className="track__cover-container">
              <img
                src={
                  album?.images && album.images.length
                    ? album.images[2].url ||
                      album.images[1].url ||
                      album.images[0].url
                    : ""
                }
                alt="Обложка"
                className="track__cover"
              />
            </div>
          </>
        )}
        <div className="track__info">
          <span className="track__title">{name}</span>
          <div className="track__extra-info">
            {explicit ? <span className="track__explicit-content">E</span> : ""}
            {
              <SpanList
                data={artists}
                linkClassName="track__link"
                spanClassName="track__artist"
              />
            }
          </div>
        </div>
      </div>
      <div className="track__right">
        <HeartIcon className="track__favourite" />
        <span className="track__length">
          {timeToString(duration_ms, false)}
        </span>
        <OtherIcon className="track__other" />
      </div>
    </article>
  );
}

import { Track } from "../../types/Track";
import { TrackItem } from "../TrackItem/TrackItem";
import { ReactComponent as PlayIcon } from "../../assets/imgs/icons/play-icon.svg";
import { ReactComponent as HeartIcon } from "../../assets/imgs/icons/heart-icon.svg";
import { ReactComponent as OtherIcon } from "../../assets/imgs/icons/other-icon.svg";
import { ReactComponent as ClockIcon } from "../../assets/imgs/icons/clock-icon.svg";
import "./TrackList.scss";
import { useEffect } from "react";
import { getYear } from "../../utils/getYear";
import { useSelector } from "react-redux";
import {
  selectCurrentTrackId,
  selectTracksData,
} from "../../redux/tracksDataSlice";

interface TrackListProps {
  data?: Track[];
  viewType?: "search" | "album" | "artist";
  headerColor?: string;
}

export function TrackList({
  data,
  viewType: type = "search",
  headerColor,
}: TrackListProps) {
  //TODO: пофиксить год в футере album page
  const tracksData = useSelector(selectTracksData);
  const currentTrackId = useSelector(selectCurrentTrackId);

  const isCurrentTrackData = () => {
    return localStorage.getItem("tracksData") === JSON.stringify(tracksData);
  };

  useEffect(() => {
    localStorage.setItem("tracksData", JSON.stringify(data));
  }, [data]);

  const SearchTrackListHeader = () => (
    <div className={type + "-page__track-list-header"}>
      <h2 className={type + "-page__track-list-title"}>Треки</h2>
      <a href="" className="track-list__show-all">
        Все
      </a>
    </div>
  );

  const SearchTrackList = () => (
    <>
      <SearchTrackListHeader />
      <div className={type + "-page__track-list-container"}>
        {data?.map((trackData, i) => (
          <TrackItem
            key={trackData.id}
            id={trackData.id}
            name={trackData.name}
            album={trackData.album}
            artists={trackData.artists}
            duration_ms={trackData.duration_ms}
            explicit={trackData.explicit}
            preview_url={trackData.preview_url}
            type={trackData.type}
            isActive={i === currentTrackId && isCurrentTrackData()}
            number={i}
          />
        ))}
      </div>
    </>
  );

  const AlbumTrackListHeader = () => (
    <>
      <div className="album-page__track-list-controls">
        <div className="play-button__container">
          <div className="play-button_block">
            <PlayIcon className="play-button__svg" height={30} width={30} />
          </div>
        </div>
        <HeartIcon
          className="album-page__track-list-favourite"
          height={30}
          width={30}
        />
        <OtherIcon
          className="album-page__track-list-other"
          height={30}
          width={30}
        />
      </div>
      <div className="album-page__track-list-header">
        <div className="album-page__track-list-header-left">
          <div className="album-page__track-list-number">#</div>
          <div className="album-page__track-list-name">Название</div>
        </div>
        <div className="album-page__track-list-header-right">
          <ClockIcon className="album-page__track-list-length" />
        </div>
      </div>
    </>
  );

  const AlbumTrackList = () => (
    <div className="album-page__track-list-container">
      <AlbumTrackListHeader />
      {data?.map((trackData, i) => (
        <TrackItem
          key={trackData.id}
          id={trackData.id}
          name={trackData.name}
          album={trackData.album}
          artists={trackData.artists}
          duration_ms={trackData.duration_ms}
          explicit={trackData.explicit}
          preview_url={trackData.preview_url}
          type={trackData.type}
          number={i}
          isActive={i === currentTrackId && isCurrentTrackData()}
          viewType="album"
        />
      ))}
      <div className="album-page__track-list-footer">
        <span className="album-page__track-list-copyright">
          ©{" "}
          {data && data.length && data[0]?.album
            ? getYear(data[0].album.release_date) + " "
            : ""}
          {data && data.length ? data[0].artists[0].name : ""}
        </span>
        <span className="album-page__track-list-phonogram">
          ℗{" "}
          {data && data.length && data[0]?.album
            ? getYear(data[0].album.release_date) + " "
            : ""}
          {data && data.length ? data[0].artists[0].name : ""}
        </span>
      </div>
    </div>
  );

  const ArtistTrackListHeader = () => (
    <>
      <div className="artist-page__track-list-controls">
        <div className="play-button__container">
          <div className="play-button_block">
            <PlayIcon className="play-button__svg" height={30} width={30} />
          </div>
        </div>
        <div className="artist-page__track-list-subscribe-button">
          Подписаться
        </div>
        <OtherIcon
          className="artist-page__track-list-other"
          height={30}
          width={30}
        />
      </div>
      <h2 className="artist-page__track-list-popular-tracks-title">
        Популярные треки
      </h2>
    </>
  );

  const ArtistTrackList = () => (
    <>
      <ArtistTrackListHeader />
      <div className="artist-page__track-list-container">
        {data?.map((trackData, i) => (
          <TrackItem
            key={trackData.id}
            id={trackData.id}
            name={trackData.name}
            album={trackData.album}
            artists={trackData.artists}
            duration_ms={trackData.duration_ms}
            explicit={trackData.explicit}
            preview_url={trackData.preview_url}
            type={trackData.type}
            number={i}
            isActive={i === currentTrackId && isCurrentTrackData()}
            viewType="artist"
          />
        ))}
      </div>
    </>
  );

  return (
    <section
      className={type + "-page__track-list"}
      style={{ backgroundColor: headerColor }}
    >
      {type === "search" ? (
        <SearchTrackList />
      ) : type === "album" ? (
        <AlbumTrackList />
      ) : (
        <ArtistTrackList />
      )}
    </section>
  );
}

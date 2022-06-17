import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getAlbumData,
  getArtistAlbums,
  getArtistsData,
  getTracksData,
} from "../../requests";
import { Album } from "../../types/Album";
import { Track } from "../../types/Track";
import { getMiddleColor } from "../../utils/getMiddleColor";
import { createImg } from "../../utils/createImg";
import { getYear } from "../../utils/getYear";
import "./AlbumPage.scss";
import { arrayToString } from "../../utils/arrayToString";
import { Artist, ContentItemType } from "../../types";
import { somethingWentWrongAlert } from "../../alerts/somethingWentWrong";
import { serverNoDataAlert } from "../../alerts/serverNoData";
import { timeToString } from "../../utils/timeToString";
import { paths } from "../../utils/paths";
import { addAlbumData } from "../../utils/addAlbumData";
import { ContentList, TrackList } from "../../components";
import { getUnicElementsByName } from "../../utils/getUnicElementsByName";

const IDS_STRING_REGEX = /^[a-zA-Z0-9]{22}(,[a-zA-Z0-9]{22})*$/;

export function AlbumPage() {
  const { albumId } = useParams();
  const [albumData, setAlbumData] = useState<Album>();
  const [artistsData, setArtistsData] = useState<Artist[]>([]);
  const [tracksData, setTracksData] = useState<Track[]>([]);
  const [artistAlbums, setArtistAlbums] = useState<ContentItemType[]>([]);
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("");

  const setNewAlbumData = async () => {
    if (!albumId?.match(IDS_STRING_REGEX)) {
      somethingWentWrongAlert();
      return;
    }

    const newData = await getAlbumData(albumId);
    if (!newData) {
      serverNoDataAlert();
      return;
    }

    setAlbumData(newData);
  };

  const setNewArtistsData = async (artistIdsString: string) => {
    if (!artistIdsString.match(IDS_STRING_REGEX)) {
      somethingWentWrongAlert();
      return;
    }

    const newData = await getArtistsData(artistIdsString);
    if (!newData) {
      serverNoDataAlert();
      return;
    }

    setArtistsData(newData);
  };

  const setNewTracksData = async () => {
    if (!albumId?.match(IDS_STRING_REGEX)) {
      somethingWentWrongAlert();
      return;
    }

    const newData = await getTracksData(albumId);
    if (!newData) {
      serverNoDataAlert();
      return;
    }

    setTracksData(newData);
  };

  const setNewArtistAlbums = async (artistId: string) => {
    if (!artistId?.match(IDS_STRING_REGEX)) {
      somethingWentWrongAlert();
      return;
    }

    const newData = await getArtistAlbums(artistId);
    if (!newData) {
      serverNoDataAlert();
      return;
    }

    setArtistAlbums(
      getUnicElementsByName(newData).map((album) => {
        return {
          id: album.id,
          imgURL: album.images[1].url || album.images[0].url,
          title: album.name,
          subtitle: album.artists[0].name,
          subtitleId: album.artists[0].id,
          type: "Альбом",
        };
      })
    );
  };

  useEffect(() => {
    setNewAlbumData();
  }, [albumId]);

  useEffect(() => {
    if (albumData) {
      const img = createImg(albumData.images[1] || albumData.images[0]);
      img.onload = () => {
        setHeaderBackgroundColor(getMiddleColor(img) || "");
      };

      const artistIdsString = arrayToString(albumData.artists, "id");
      setNewArtistsData(artistIdsString);

      setNewTracksData();

      setNewArtistAlbums(albumData.artists[0].id);
    }
  }, [albumData]);

  useEffect(() => {
    if (albumData && tracksData && !tracksData[0].album) {
      setTracksData(addAlbumData(tracksData, albumData));
    }
  }, [tracksData]);

  return (
    <div className="album-page">
      <section
        style={{ backgroundColor: headerBackgroundColor }}
        className="album-page-header"
      >
        <div className="album-page-header__inner">
          <div className="album-page-header__cover-container">
            <img
              src={albumData?.images[1].url || albumData?.images[0].url}
              alt="Обложка"
              className="album-page-header__cover"
            />
          </div>
          <div className="album-page-header__text">
            <h3 className="album-page-header__subtitle">
              {albumData?.album_type === "album"
                ? "Альбом"
                : tracksData.length === 1
                ? "Сингл"
                : "Мини-альбом"}
            </h3>
            <h1 className="album-page-header__title">{albumData?.name}</h1>
            <div className="album-page-header__info">
              <div className="album-page-header__all-artists">
                {artistsData.map((artistData) => (
                  <Link
                    key={artistData.id}
                    className="album-page__link"
                    to={paths.artist(artistData.id)}
                  >
                    <div className="album-page-header__artist-info">
                      <div className="album-page-header__artist-img-container">
                        <img
                          src={
                            artistData?.images && artistData.images.length
                              ? artistData?.images[1].url ||
                                artistData?.images[0].url
                              : ""
                          }
                          alt={artistData.name}
                          className="album-page-header__artist-img"
                        />
                      </div>
                      <span className="album-page-header__artist-name">
                        {artistData.name} <b>·</b>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="album-page-header__album-info">
                <span>
                  {getYear(albumData?.release_date)} <b>·</b>{" "}
                </span>
                <span>
                  {albumData?.total_tracks /*TODO: добавить pluralize*/} треков,
                </span>
                <span className="album-page-header__album-length">
                  {timeToString(
                    tracksData.reduce(
                      (result, item) => result + item.duration_ms,
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TrackList
        data={tracksData}
        viewType="album"
        headerColor={headerBackgroundColor}
      />
      <div className="content-items__wrapper">
        <ContentList
          data={artistAlbums}
          title={albumData?.artists[0].name + ": другие альбомы"}
        />
      </div>
    </div>
  );
}

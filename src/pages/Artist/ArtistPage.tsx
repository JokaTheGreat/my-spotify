import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverNoDataAlert } from "../../alerts/serverNoData";
import { somethingWentWrongAlert } from "../../alerts/somethingWentWrong";
import {
  getArtistData,
  getArtistsAlbums,
  getArtistsSingles,
  getArtistsTopTracks,
  getRelatedArtists,
} from "../../requests";
import { Artist, ContentItemType, Track } from "../../types";
import { ReactComponent as UpproveIcon } from "../../assets/imgs/icons/upprove-icon.svg";
import "./ArtistPage.scss";
import { createImg } from "../../utils/createImg";
import { getMiddleColor } from "../../utils/getMiddleColor";
import { ContentList, TrackList } from "../../components";
import { getUnicElementsByName } from "../../utils/getUnicElementsByName";

const IDS_STRING_REGEX = /^[a-zA-Z0-9]{22}(,[a-zA-Z0-9]{22})*$/;

export function ArtistPage() {
  const { artistId } = useParams();
  const [artistData, setArtistData] = useState<Artist>();
  const [topTracksData, setTopTracksData] = useState<Track[]>([]);
  const [albumsData, setAlbumsData] = useState<ContentItemType[]>([]);
  const [singlesData, setSinglesData] = useState<ContentItemType[]>([]);
  const [relatedArtistsData, setRelatedArtistsData] = useState<
    ContentItemType[]
  >([]);
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("");

  const setNewArtistData = async () => {
    if (!artistId?.match(IDS_STRING_REGEX)) {
      somethingWentWrongAlert();
      return;
    }

    const newData = await getArtistData(artistId);
    if (!newData) {
      serverNoDataAlert();
      return;
    }

    setArtistData(newData);
  };

  const setNewTopTracksData = async () => {
    if (!artistId?.match(IDS_STRING_REGEX)) {
      somethingWentWrongAlert();
      return;
    }

    const newData = await getArtistsTopTracks(artistId);
    if (!newData) {
      serverNoDataAlert();
      return;
    }

    setTopTracksData(newData);
  };

  const setNewAlbumsData = async () => {
    if (!artistId?.match(IDS_STRING_REGEX)) {
      return somethingWentWrongAlert();
    }

    const newData = await getArtistsAlbums(artistId);
    if (!newData) {
      return serverNoDataAlert();
    }

    setAlbumsData(
      getUnicElementsByName(newData).map((item) => {
        return {
          id: item.id,
          imgURL: item.images[1].url || item.images[0].url,
          title: item.name,
          subtitle: item.artists[0].name,
          subtitleId: item.artists[0].id,
          type: "Альбом",
        };
      })
    );
  };

  const setNewSinglesData = async () => {
    if (!artistId?.match(IDS_STRING_REGEX)) {
      return somethingWentWrongAlert();
    }

    const newData = await getArtistsSingles(artistId);
    if (!newData) {
      return serverNoDataAlert();
    }

    setSinglesData(
      getUnicElementsByName(newData).map((item) => {
        return {
          id: item.id,
          imgURL: item.images[1].url || item.images[0].url,
          title: item.name,
          subtitle: item.artists[0].name,
          subtitleId: item.artists[0].id,
          type: "Альбом",
        };
      })
    );
  };

  const setNewRelatedArtistsData = async () => {
    if (!artistId?.match(IDS_STRING_REGEX)) {
      return somethingWentWrongAlert();
    }

    const newData = await getRelatedArtists(artistId);
    if (!newData) {
      return serverNoDataAlert();
    }

    setRelatedArtistsData(
      newData.map((item) => {
        return {
          id: item.id,
          imgURL: item.images ? item.images[1].url || item.images[0].url : "",
          title: item.name,
          type: "Исполнитель",
        };
      })
    );
  };

  useEffect(() => {
    setNewArtistData();
  }, [artistId]);

  useEffect(() => {
    if (artistData) {
      setNewTopTracksData();

      setNewAlbumsData();

      setNewSinglesData();

      setNewRelatedArtistsData();
    }

    if (artistData?.images) {
      const img = createImg(artistData.images[1] || artistData.images[0]);
      img.onload = () => {
        setHeaderBackgroundColor(getMiddleColor(img) || "");
      };
    }
  }, [artistData]);

  return (
    <div className="artist-page">
      <section
        style={{ backgroundColor: headerBackgroundColor }}
        className="artist-page__header"
      >
        {artistData?.images && (
          <div className="artist-page__photo-wrapper">
            <img
              className="artist-page__photo"
              src={artistData.images[1].url || artistData.images[0].url}
              alt="Обложка"
            />
          </div>
        )}

        <div className="artist-page__info">
          <div className="upprove-sign">
            <UpproveIcon className="upprove-sign__icon" />
            <span className="upprove-sign__title">
              Подтвержденный исполнитель
            </span>
          </div>
          <h1 className="artist-page__name">{artistData?.name}</h1>
          <div className="artist-page__listeners">
            {artistData?.followers?.total /*TODO: pluralize*/} подписчиков
          </div>
        </div>
      </section>
      <TrackList
        viewType="artist"
        data={topTracksData}
        headerColor={headerBackgroundColor}
      />
      <div className="content-items__wrapper">
        <ContentList data={albumsData} title="Альбомы" />
      </div>
      <div className="content-items__wrapper">
        <ContentList data={singlesData} title="Синглы и EP" />
      </div>
      <div className="content-items__wrapper">
        <ContentList
          data={relatedArtistsData}
          title="Поклонникам также нравится"
        />
      </div>
    </div>
  );
}

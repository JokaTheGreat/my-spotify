import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ContentItemType, SearchResult } from "../../types";
import { PlayButton } from "../PlayButton/PlayButton";
import { paths } from "../../utils/paths";
import "./BestSearchResult.scss";

interface BestSearchResultProps {
  data?: SearchResult;
}

function selectItemFromData(data?: SearchResult): ContentItemType | undefined {
  if (data?.artists.items.length) {
    const item = data.artists.items[0];
    return {
      id: item.id,
      title: item.name,
      imgURL:
        item.images && item.images.length
          ? item.images[1].url || item.images[0].url
          : undefined,
      type: "Исполнитель",
    };
  }

  if (data?.albums.items.length) {
    const item = data.albums.items[0];
    return {
      id: item.id,
      title: item.name,
      subtitle: item.artists[0].name,
      imgURL:
        item.images && item.images.length
          ? item.images[1].url || item.images[0].url
          : undefined,
      type: "Альбом",
    };
  }

  if (data?.tracks.items.length) {
    const item = data.tracks.items[0];
    return {
      id: item.id,
      title: item.name,
      subtitle: item.artists[0].name,
      imgURL:
        item.album.images && item.album.images.length
          ? item.album.images[1].url || item.album.images[0].url
          : undefined,
      type: "Трек",
    };
  }

  return undefined;
}

export function BestSearchResult({ data }: BestSearchResultProps) {
  const [itemData, setItemData] = useState<ContentItemType>();

  const BestSearchResultContainer = () => (
    <div className="best-search-result__container">
      {itemData?.imgURL && (
        <div className="best-search-result__img-container">
          <img
            src={itemData.imgURL}
            alt="Обложка"
            className="best-search-result__img"
          />
        </div>
      )}
      <PlayButton className="best-search-result__play" />
      <h2 className="best-search-result__title">{itemData?.title}</h2>
      <div className="best-search-result__extra-info">
        {itemData?.subtitle && (
          <h3 className="best-search-result__subtitle">{itemData.subtitle}</h3>
        )}
        {itemData?.type && (
          <h3 className="best-search-result__type">{itemData.type}</h3>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    setItemData(selectItemFromData(data));
  }, [data]);

  return (
    <section className="best-search-result">
      <h2 className="best-search-result__title">Лучший результат</h2>
      {itemData?.type === "Исполнитель" ? (
        <Link
          className="best-search-result__link"
          to={paths.artist(itemData.id)}
        >
          <BestSearchResultContainer />
        </Link>
      ) : itemData?.type === "Альбом" ? (
        <Link
          className="best-search-result__link"
          to={paths.album(itemData.id)}
        >
          <BestSearchResultContainer />
        </Link>
      ) : (
        <BestSearchResultContainer />
      )}
    </section>
  );
}

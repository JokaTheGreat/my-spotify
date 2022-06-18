import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BestSearchResult, ContentList, TrackList } from "../../components";
import { getSearchData } from "../../requests";
import { ContentItemType, SearchResult } from "../../types";
import "./SearchPage.scss";

export function SearchPage() {
  const { searchRequest } = useParams();
  const [searchData, setSearchData] = useState<SearchResult>();
  const [albumsData, setAlbumsData] = useState<ContentItemType[]>();
  const [artistsData, setArtistsData] = useState<ContentItemType[]>();

  const setData = async () => {
    const newSearchData = await getSearchData(searchRequest!);
    setSearchData(newSearchData ? newSearchData : undefined);
  };

  useEffect(() => {
    setData();
  }, [searchRequest]);

  useEffect(() => {
    if (searchData?.albums) {
      setAlbumsData(
        searchData.albums.items.map((albumData) => {
          return {
            id: albumData.id,
            imgURL: albumData.images[1].url || albumData.images[0].url,
            title: albumData.name,
            subtitle: albumData.artists[0].name,
            subtitleId: albumData.artists[0].id,
            type: "Альбом",
          };
        })
      );
    }

    if (searchData?.artists) {
      setArtistsData(
        searchData.artists.items.map((artistData) => {
          return {
            id: artistData.id,
            imgURL:
              artistData.images && artistData.images.length
                ? artistData.images[1].url || artistData.images[0].url
                : undefined,
            title: artistData.name,
            type: "Исполнитель",
          };
        })
      );
    }
  }, [searchData]);

  return (
    <div className="search-page">
      <BestSearchResult data={searchData} />
      <TrackList data={searchData?.tracks.items.slice(0, 4)} />
      <ContentList data={artistsData} title="Исполнители" />
      <ContentList data={albumsData} title="Альбомы" />
    </div>
  );
}

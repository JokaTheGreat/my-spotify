import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectCurrentTrackId,
  selectIsQueryShowing,
  selectTracksData,
} from "../../redux/tracksDataSlice";
import { Track } from "../../types";
import { QueryTrack } from "../QueryTrack/QueryTrack";

export function QueryTrackList() {
  const tracksData = useSelector(selectTracksData);
  const currentTrackId = useSelector(selectCurrentTrackId);
  const [data, setData] = useState<Track[]>();
  const isQueryShowing = useSelector(selectIsQueryShowing);

  useEffect(() => {
    setData(tracksData);
  }, [tracksData]);

  return (
    <div className="menu__tracks-query-wrapper">
      <div
        className={
          "menu__tracks-query" + (isQueryShowing ? "" : " menu__tracks-query_hidden")
        }
      >
        <h3 className="menu__tracks-query-title">Текущий плейлист:</h3>
        <div className="menu__tracks-list">
          {data?.map((trackData, i) => (
            <QueryTrack
              key={trackData.id}
              data={trackData}
              isActive={currentTrackId === i}
              number={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

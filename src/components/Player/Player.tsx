import { ReactComponent as QueryIcon } from "../../assets/imgs/icons/query-icon.svg";
import { ReactComponent as VolumeIcon } from "../../assets/imgs/icons/volume-icon.svg";
import { ReactComponent as MixIcon } from "../../assets/imgs/icons/mix-icon.svg";
import { ReactComponent as PrevSongIcon } from "../../assets/imgs/icons/prev-song-icon.svg";
import { ReactComponent as PlayIcon } from "../../assets/imgs/icons/play-icon.svg";
import { ReactComponent as PauseIcon } from "../../assets/imgs/icons/pause-icon.svg";
import { ReactComponent as RepeatIcon } from "../../assets/imgs/icons/repeat-icon.svg";
import "./Player.scss";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseCurrentTrackId,
  increaseCurrentTrackId,
  selectCurrentTrackData,
  selectCurrentTrackId,
  selectCurrentTrackOrder,
  selectIsTrackPlaying,
  selectTracksData,
  setCurrentTrackId,
  setCurrentTrackOrder,
  toggleQueryShowing,
  toggleTrackPlaying,
} from "../../redux/tracksDataSlice";
import { arrayToString } from "../../utils/arrayToString";
import { timeToString } from "../../utils/timeToString";
import { Track } from "../../types";

export function isTrackOrderMixed(
  normalTrackOrder: number[],
  trackOrder: number[]
) {
  return JSON.stringify(normalTrackOrder) !== JSON.stringify(trackOrder);
}

export function generateRandomTrackOrder(
  tracksData: Track[],
  currentTrackId: number
): number[] {
  const oldTracksOrder = Array.from(tracksData.keys());
  const newTracksOrder = [];
  newTracksOrder.push(currentTrackId);
  oldTracksOrder.splice(currentTrackId, 1);

  let currentIndex = oldTracksOrder.length;

  while (currentIndex) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    newTracksOrder.push(oldTracksOrder[randomIndex]);
    oldTracksOrder.splice(randomIndex, 1);
  }

  return newTracksOrder;
}

export function Player() {
  const [playIconVisible, setPlayIconVisible] = useState(false);
  const [activeIcons, setActiveIcons] = useState({
    controlButtons: false,
    queryIcon: false,
    mixIcon: false,
    repeatIcon: false,
  });
  const tracksData = useSelector(selectTracksData);
  const currentTrackData = useSelector(selectCurrentTrackData);
  const currentTrackId = useSelector(selectCurrentTrackId);
  const isTrackPlaying = useSelector(selectIsTrackPlaying);
  const currentTrackOrder = useSelector(selectCurrentTrackOrder);
  const [audios, setAudios] = useState<HTMLAudioElement[]>([]);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");
  const [currentProgressBar, setCurrentProgressBar] = useState(0);
  const [currentVolumeBar, setCurrentVolumeBar] = useState(100);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(currentTrackOrder);
  }, [currentTrackOrder]);

  const mixTrackOrder = () => {
    if (!activeIcons.controlButtons) return;

    setActiveIcons({ ...activeIcons, mixIcon: !activeIcons.mixIcon });

    //TODO: доделать переходе на страницу

    if (isTrackOrderMixed(Array.from(tracksData.keys()), currentTrackOrder)) {
      dispatch(setCurrentTrackId(currentTrackId));
      dispatch(setCurrentTrackOrder(Array.from(tracksData.keys())));
      return;
    }

    dispatch(
      setCurrentTrackOrder(generateRandomTrackOrder(tracksData, currentTrackId))
    );
    dispatch(setCurrentTrackId(0));
  };

  const showQuery = () => {
    setActiveIcons({ ...activeIcons, queryIcon: !activeIcons.queryIcon });
    dispatch(toggleQueryShowing());
  };

  const toggleVolume = () => {
    if (!activeIcons.controlButtons) return;

    setCurrentVolumeBar(audios[currentTrackId].volume ? 0 : 100);
    audios.forEach((audio) =>
      audio.volume ? (audio.volume = 0) : (audio.volume = 1)
    );
  };

  const setVolume = (e: React.MouseEvent) => {
    if (!activeIcons.controlButtons) return;

    const offsetX = e.nativeEvent.offsetX;
    if (offsetX && audios.length && currentTrackId) {
      const TOTAL_VOLUME_BAR_WIDTH = 94;
      audios.forEach(
        (audio) => (audio.volume = offsetX / TOTAL_VOLUME_BAR_WIDTH)
      );
      setCurrentVolumeBar(Math.round((offsetX / TOTAL_VOLUME_BAR_WIDTH) * 100));
    }
  };

  const nextTrack = () => {
    if (!activeIcons.controlButtons) return;
    dispatch(increaseCurrentTrackId());
  };

  const prevTrack = () => {
    if (!activeIcons.controlButtons) return;
    dispatch(decreaseCurrentTrackId());
  };

  const toggleLoop = () => {
    if (!activeIcons.controlButtons) return;

    setActiveIcons({ ...activeIcons, repeatIcon: !activeIcons.repeatIcon });
    audios.forEach((audio) => audio.toggleAttribute("loop"));
  };

  const togglePlay = () => {
    if (!activeIcons.controlButtons) return;

    dispatch(toggleTrackPlaying());
  };

  const onEnded = () => {
    console.log("ended");
    nextTrack();
  };

  const setAudioCurrentTime = (e: React.MouseEvent) => {
    if (!activeIcons.controlButtons) return;

    const offsetX = e.nativeEvent.offsetX;
    if (offsetX && audios.length && currentTrackId) {
      const TOTAL_PROGRESS_BAR_WIDTH = 510;
      audios[currentTrackId].currentTime =
        (offsetX / TOTAL_PROGRESS_BAR_WIDTH) * audios[currentTrackId].duration;
    }
  };

  useEffect(() => {
    setAudios(
      tracksData.map((trackData) => new Audio(trackData.preview_url || ""))
    );
  }, [tracksData]);

  useEffect(() => {
    if (tracksData.length) {
      setActiveIcons({
        ...activeIcons,
        controlButtons: true,
        mixIcon: false,
      });
    }

    audios.forEach((audio) => {
      audio.onended = onEnded;
      audio.loop = activeIcons.repeatIcon;
    });
  }, [audios]);

  useEffect(() => {
    if (audios.length && currentTrackId) {
      setPlayIconVisible(!isTrackPlaying);

      console.log(currentTrackId);
      isTrackPlaying && audios[currentTrackId].play();
      return () => {
        isTrackPlaying && audios[currentTrackId].pause();
      };
    }
  }, [audios, isTrackPlaying, currentTrackId]);

  useEffect(() => {
    //TODO: первый дюрэйшон и первая громкость не работает
    if (audios.length && currentTrackId) {
      setDuration(timeToString(audios[currentTrackId].duration * 1000, false));

      const setCurrentTimeTask = setInterval(
        () =>
          setCurrentTime(
            timeToString(audios[currentTrackId].currentTime * 1000, false)
          ),
        1000
      );

      const setCurrentProgressBarTask = setInterval(
        () =>
          setCurrentProgressBar(
            Math.round(
              (audios[currentTrackId].currentTime /
                audios[currentTrackId].duration) *
                100
            )
          ),
        50
      );

      return () => {
        clearInterval(setCurrentTimeTask);
        clearInterval(setCurrentProgressBarTask);
      };
    }
  }, [audios, currentTrackId]);

  return (
    <footer className="player">
      <div className="player__side-controls side-controls">
        <QueryIcon
          onClick={showQuery}
          className={
            "side-controls__btn query-button" +
            (activeIcons.queryIcon ? " query-button_active" : "")
          }
        />
        <div className="side-controls__volume">
          <VolumeIcon
            onClick={toggleVolume}
            className="volume-btn side-controls__btn"
          />
          <div onClick={setVolume} className="side-controls__volume-bar">
            <div className="side-controls__volume-bar-inner">
              <div
                style={{ width: "" + currentVolumeBar + "%" }}
                className="side-controls__volume-line"
              ></div>
              <div
                style={{ left: "" + currentVolumeBar + "%" }}
                className="side-controls__volume-slider"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="player__main">
        <div className="player__controls controls">
          <MixIcon
            onClick={mixTrackOrder}
            className={
              "controls__btn mix-button" +
              (activeIcons.controlButtons ? " controls__btn_active" : "") +
              (activeIcons.mixIcon ? " mix-button_active" : "")
            }
          />
          <PrevSongIcon
            onClick={prevTrack}
            className={
              "controls__btn prev-button" +
              (activeIcons.controlButtons ? " controls__btn_active" : "")
            }
          />
          <div
            onClick={togglePlay}
            className={
              "controls__btn-container" +
              (activeIcons.controlButtons
                ? " controls__btn-container_active"
                : "")
            }
          >
            <PlayIcon
              visibility={playIconVisible ? "visible" : "hidden"}
              className="controls__btn_pause controls__btn controls__btn_black"
            />
            <PauseIcon
              visibility={playIconVisible ? "hidden" : "visible"}
              className="controls__btn_pause controls__btn controls__btn_black"
            />
          </div>
          <PrevSongIcon
            onClick={nextTrack}
            className={
              "controls__btn controls__btn_reflected next-button" +
              (activeIcons.controlButtons ? " controls__btn_active" : "")
            }
          />
          <RepeatIcon
            onClick={toggleLoop}
            className={
              "controls__btn repeat-button" +
              (activeIcons.controlButtons ? " controls__btn_active" : "") +
              (activeIcons.repeatIcon ? " repeat-button_active" : "")
            }
          />
        </div>

        <div className="progress-bar">
          <span className="progress-bar__current">{currentTime}</span>
          <div onClick={setAudioCurrentTime} className="progress-bar__main">
            <div className="progress-bar__main-inner">
              <div
                style={{ width: "" + currentProgressBar + "%" }}
                className="progress-bar__line"
              ></div>
              <div
                style={{ left: "" + currentProgressBar + "%" }}
                className="progress-bar__slider"
              ></div>
            </div>
          </div>
          <span className="progress-bar__end">{duration}</span>
        </div>
      </div>

      <div className="player__current-track">
        {currentTrackData && (
          <>
            <div className="current-track__cover-wrapper">
              <img
                src={
                  currentTrackData.album.images[2].url ||
                  currentTrackData.album.images[1].url ||
                  currentTrackData.album.images[0].url
                }
                alt="Обложка"
                className="current-track__cover"
              />
            </div>
            <div className="current-track__info">
              <span className="current-track__title">
                {currentTrackData.name}
              </span>
              <span className="current-track__artist">
                {arrayToString(currentTrackData.artists, "name")}
              </span>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}

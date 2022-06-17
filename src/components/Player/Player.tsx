import { ReactComponent as QueryIcon } from "../../assets/imgs/icons/query-icon.svg";
import { ReactComponent as VolumeIcon } from "../../assets/imgs/icons/volume-icon.svg";
import { ReactComponent as MixIcon } from "../../assets/imgs/icons/mix-icon.svg";
import { ReactComponent as PrevSongIcon } from "../../assets/imgs/icons/prev-song-icon.svg";
import { ReactComponent as PlayIcon } from "../../assets/imgs/icons/play-icon.svg";
import { ReactComponent as PauseIcon } from "../../assets/imgs/icons/pause-icon.svg";
import { ReactComponent as RepeatIcon } from "../../assets/imgs/icons/repeat-icon.svg";
import "./Player.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseCurrentTrackId,
  increaseCurrentTrackId,
  selectCurrentTrackData,
  selectCurrentTrackId,
  selectIsTrackPlaying,
  selectTracksData,
  setCurrentTrackId,
  toggleQueryShowing,
} from "../../redux/tracksDataSlice";
import { arrayToString } from "../../utils/arrayToString";
import { timeToString } from "../../utils/timeToString";

//TODO: оживить плеер

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
  const [audios, setAudios] = useState<HTMLAudioElement[]>([]);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");
  const [currentProgressBar, setCurrentProgressBar] = useState(0);
  const dispatch = useDispatch();

  const showQuery = () => {
    setActiveIcons({ ...activeIcons, queryIcon: !activeIcons.queryIcon });
    dispatch(toggleQueryShowing());
  };

  const toggleVolume = () => {
    if (!activeIcons.controlButtons) return;
    audios.forEach((audio) =>
      audio.volume ? (audio.volume = 0) : (audio.volume = 1)
    );
  };

  const nextTrack = () => {
    if (!activeIcons.controlButtons) return;
    dispatch(increaseCurrentTrackId());
  };

  const prevTrack = () => {
    if (!activeIcons.controlButtons) return;
    dispatch(decreaseCurrentTrackId());
  };

  const loopAudio = () => {
    if (!activeIcons.controlButtons) return;

    setActiveIcons({ ...activeIcons, repeatIcon: !activeIcons.repeatIcon });
    if (audios[currentTrackId].loop) {
      return (audios[currentTrackId].loop = false);
    }

    audios[currentTrackId].loop = true;
  };

  const togglePlay = () => {
    setPlayIconVisible(!playIconVisible);
    if (audios[currentTrackId].paused) {
      return audios[currentTrackId].play();
    }

    audios[currentTrackId].pause();
  };

  const onEnded = () => {
    nextTrack();
  };

  useEffect(() => {
    if (tracksData.length) {
      setActiveIcons({
        ...activeIcons,
        controlButtons: true,
      });
    }
    audios.forEach((audio) => audio.pause());
    setAudios(
      tracksData.map((trackData) => new Audio(trackData.preview_url || ""))
    );
  }, [tracksData]);

  useEffect(() => {
    audios.forEach((audio) => (audio.onended = onEnded));
  }, [audios]);

  useEffect(() => {
    console.log(isTrackPlaying);
    if (audios.length && currentTrackId !== -1) {
      isTrackPlaying
        ? audios[currentTrackId].play()
        : audios[currentTrackId].pause();
    }
  }, [audios, isTrackPlaying]);

  useEffect(() => {
    //TODO: возращаем паузу, первый дюрэйшон не работает
    console.log(currentTrackId);
    if (audios.length) {
      audios.forEach((audio) => audio.pause());
      audios[currentTrackId].play();

      console.log(timeToString(audios[currentTrackId].duration * 1000, false));
      setDuration(timeToString(audios[currentTrackId].duration * 1000, false));

      const setCurrentTimeTask = setInterval(
        () =>
          setCurrentTime(
            timeToString(audios[currentTrackId].currentTime * 1000, false)
          ),
        1000
      );

      return () => {
        clearInterval(setCurrentTimeTask);
      };
    }
  }, [audios, currentTrackId]);

  useEffect(() => {}, [currentTime]);

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
          <div className="side-controls__volume-bar">
            <div className="side-controls__volume-line"></div>
            <div className="side-controls__volume-slider"></div>
          </div>
        </div>
      </div>

      <div className="player__main">
        <div className="player__controls controls">
          <MixIcon
            className={
              "controls__btn mix-button" +
              (activeIcons.controlButtons ? " controls__btn_active" : "")
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
            onClick={loopAudio}
            className={
              "controls__btn repeat-button" +
              (activeIcons.controlButtons ? " controls__btn_active" : "") +
              (activeIcons.repeatIcon ? " repeat-button_active" : "")
            }
          />
        </div>

        <div className="progress-bar">
          <span className="progress-bar__current">{currentTime}</span>
          <div className="progress-bar__main">
            <div style={{ left: 0 }} className="progress-bar__line"></div>
            <div style={{ left: 0 }} className="progress-bar__slider"></div>
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

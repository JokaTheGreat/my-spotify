import { ReactComponent as PlayIcon } from "../../assets/imgs/icons/play-icon.svg";
import "./PlayButton.scss";

interface PlayButtonProps {
  className?: string;
}

export function PlayButton({ className }: PlayButtonProps) {
  return (
    <div className={className ? "play-button " + className : "play-button"}>
      <PlayIcon className="play-button__svg" />
    </div>
  );
}

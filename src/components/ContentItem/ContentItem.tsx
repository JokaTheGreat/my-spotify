import { Link } from "react-router-dom";
import { PlayButton } from "../";
import { ReactComponent as ArtistDefaulIcon } from "../../assets/imgs/icons/account-icon.svg";
import { ContentItemType } from "../../types";
import { paths } from "../../utils/paths";
import "./ContentItem.scss";

interface ContentItemProps extends ContentItemType {}

export function ContentItem({
  id,
  imgURL,
  title,
  subtitle,
  subtitleId,
  type,
}: ContentItemProps) {
  const ContentItem = () => (
    <article className="content-item">
      <div className="content-item__inner">
        <div className="content-item__play-button-container">
          <div
            className={
              type === "Исполнитель"
                ? "content-item__img-container content-item__img-container_round"
                : "content-item__img-container"
            }
          >
            {imgURL ? (
              <img src={imgURL} alt="Обложка" className="content-item__img" />
            ) : (
              <ArtistDefaulIcon className="content-item__img artist-img-default" />
            )}
          </div>
          <PlayButton />
        </div>
        <h3 className="content-item__name">{title}</h3>
        <span className="content-item__subtitle">
          {subtitle ? (
            <Link className="content-item__link" to={paths.artist(subtitleId!)}>{subtitle}</Link>
          ) : (
            type
          )}
        </span>
      </div>
    </article>
  );

  return (
    <>
      {type === "Исполнитель" ? (
        <Link className="content-item__link" to={paths.artist(id)}>
          <ContentItem />
        </Link>
      ) : (
        <Link className="content-item__link" to={paths.album(id)}>
          <ContentItem />
        </Link>
      )}
    </>
  );
}

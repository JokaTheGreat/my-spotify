import { ContentItemType } from "../../types";
import { ContentItem } from "../";
import "./ContentList.scss";

interface ContentListProps {
  data?: ContentItemType[];
  title: string;
}

export function ContentList({ data, title }: ContentListProps) {
  return (
    <section className="content-items">
      <div className="content-items__header">
        <h2 className="content-items__title">{title}</h2>
        <a href="" className="link content-items__show-all">
          Все
        </a>
      </div>
      <div className="content-items__container">
        {data?.map((itemData) => (
          <ContentItem
            key={itemData.id}
            id={itemData.id}
            imgURL={itemData.imgURL}
            title={itemData.title}
            subtitle={itemData.subtitle}
            subtitleId={itemData.subtitleId}
            type={itemData.type}
          />
        ))}
      </div>
    </section>
  );
}

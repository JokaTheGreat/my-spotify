import { ContentList } from "../../components";
import { ContentItemType } from "../../types";
import "./HomePage.scss";

export function HomePage() {
  const searchStoryData: ContentItemType[] = [
    {
      id: "37GqOfeuzBtpj32ZG28SqH",
      imgURL: "imgs/example/beauty.jpg",
      title: "Красота и уродство",
      subtitle: "Oxxxymiron",
      subtitleId: "1gCOYbJNUa1LBVO5rlx0jB",
      type: "Альбом",
    },
  ];
  const recentlyListenedData: ContentItemType[] = [
    {
      id: "3dgsCZMswt6TWbsKcMgoO2",
      imgURL: "imgs/example/sbalbum.jpg",
      title: "Long Term Effects of SUFFERING",
      subtitle: "$uicideboy$",
      subtitleId: "1VPmR4DJC1PlOtd0IADAO0",
      type: "Альбом",
    },
  ];

  return (
    <div className="home-page">
      <ContentList data={searchStoryData} title="История поиска" />
      <ContentList data={recentlyListenedData} title="Недавно прослушанные" />
    </div>
  );
}

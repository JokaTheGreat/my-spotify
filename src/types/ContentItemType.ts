export interface ContentItemType {
  id: string;
  imgURL?: string;
  title: string;
  subtitle?: string;
  subtitleId?: string;
  type: "Исполнитель" | "Альбом" | "Трек";
}

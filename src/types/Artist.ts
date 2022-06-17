import { ImageType } from "./Image";

export interface Artist {
  id: string;
  name: string;
  images?: ImageType[];
  followers?: { total: number };
  type: "artist";
}

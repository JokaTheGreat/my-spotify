import { Artist } from "./Artist";
import { ImageType } from "./Image";

export interface Album {
    id: string;
    album_type: "album" | "single";
    artists: Artist[];
    name: string;
    images: ImageType[];
    release_date: string;
    total_tracks: number;
    type: "album";
}
import { Album } from "./Album";
import { Artist } from "./Artist";

export interface Track {
    id: string;
    name: string;
    preview_url: string | null;
    album: Album;
    artists: Artist[];
    duration_ms: number;
    explicit: boolean;
    type: "track";
}
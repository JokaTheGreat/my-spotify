import { Album } from "./Album";
import { Artist } from "./Artist";
import { Track } from "./Track";

export interface SearchResult {
  albums: { items: Album[] };
  artists: { items: Artist[] };
  tracks: { items: Track[] };
}

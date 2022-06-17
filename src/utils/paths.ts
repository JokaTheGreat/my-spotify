export const paths = {
    home: "/",
    search: (searchRequest: string) => `/search/${searchRequest}`,
    artist: (artistId: string) => `/artist/${artistId}`,
    album: (albumId: string) => `/album/${albumId}`,
}
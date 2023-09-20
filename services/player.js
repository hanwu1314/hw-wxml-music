import { hwRequest } from "./index"
export function getSongDetail(ids) {
  return hwRequest.get({
    url: "/song/detail",
    data: {
      ids
    }
  })
}
export function getSongLyric(id) {
  return hwRequest.get({
    url: "/lyric",
    data: {
      id
    }
  })
}
import { hwRequest } from './index'

export function getMusicBanner(type = 0) {
  return hwRequest.get({
    url: "/banner",
    data: {
      type
    }
  })
}
export function getPlaylistDetail(id) {
  return hwRequest.get({
    url: "/playlist/detail",
    data: {
      id
    }
  })
}

export function getSongMenuList(cat = "全部", limit = 6, offset = 0) {
  return hwRequest.get({
    url: "/top/playlist",
    data: {
      cat,
      limit,
      offset
    }
  })
}

export function getSongMenuTag() {
  return hwRequest.get({
    url: "/playlist/hot"
  })
}

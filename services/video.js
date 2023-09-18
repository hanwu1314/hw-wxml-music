import { hwRequest } from './index'
export function getTopMV(offset = 0, limit = 20) {
  return hwRequest.get({
    url: "/top/mv",
    data: {
      limit: limit,
      offset: offset
    }
  })
}

export function getMVUrl(id) {
  return hwRequest.get({
    url: "/mv/url",
    data: {
      id
    }
  })
}

export function getMVInfo(mvid) {
  return hwRequest.get({
    url: "/mv/detail",
    data: {
      mvid
    }
  })
}
/**相似mv */
export function getMVSimilarity(id) {
  return hwRequest.get({
    url: "/simi/mv",
    data: {
      mvid: id
    }
  })
}
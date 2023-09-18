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
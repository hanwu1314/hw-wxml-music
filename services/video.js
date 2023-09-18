import { hwRequest } from './index'
export function getTopMV(offset = 10, limit = 20) {
  return hwRequest.get({
    url: "/top/mv",
    data: {
      limit: offset,
      offset: limit
    }
  })

}
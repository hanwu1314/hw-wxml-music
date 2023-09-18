import { hwRequest } from './index'

export function getMusicBanner(type = 0) {
  return hwRequest.get({
    url: "/banner",
    data: {
      type
    }
  })
}
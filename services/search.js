import { hwRequest } from "./index"
export function getHotSearch() {
  return hwRequest.get({
    url: "/search/hot"
  })
}
export function getHotDetailSearch() {
  return hwRequest.get({
    url: "/search/hot/detail"
  })
}
export function getSearch(keywords) {
  return hwRequest.get({
    url: "/search",
    data: {
      keywords
    }
  })
}
export function getSearchSuggest(keywords) {
  return hwRequest.get({
    url: "/search/suggest",
    data: {
      keywords,
      type: "mobile"
    }
  })
}
// pages/detail-search/detail-search.js
import { getHotSearch, getHotDetailSearch, getSearch, getSearchSuggest } from "../../services/search"
import playerStore from "../../store/playerStore"
Page({
  data: {
    hotSearch: [],
    hotDetailSearch: [],
    playSongList: [],
    SearchSuggests: [],
    keywords: ''
  },
  onLoad() {
    this.fetchHotSearch()
    this.fetchHotDetailSearch()
    this.fetchSearchSuggest()
  },
  onChange(event) {
    const keywords = event.detail
    this.data.keywords = keywords
  },
  onSearchTap() {
    const keywords = this.data.keywords
    if (keywords === '') return
    this.fetchSearch(keywords)
    // wx.navigateTo({
    //   url: '/pages/search-song/search-song',
    // })
  },
  onHotItemTap(event) {
    const keywords = event.currentTarget.dataset.keywords
    this.fetchSearch(keywords)
    // wx.navigateTo({
    //   url: '/pages/search-song/search-song',
    // })
  },
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList", this.data.playSongList)
    playerStore.setState("playSongIndex", index)
  },
  async fetchHotSearch() {
    const res = await getHotSearch()
    this.setData({ hotSearch: res.result.hots })
  },
  async fetchHotDetailSearch() {
    const res = await getHotDetailSearch()
    this.setData({ hotDetailSearch: res.data })
  },
  async fetchSearch(keywords) {
    const res = await getSearch(keywords)
    this.setData({ playSongList: res.result.songs })
  },
  async fetchSearchSuggest(keywords) {
    const res = await getSearchSuggest(keywords)
    this.setData({ SearchSuggests: res.result.allMatch })
  },
})
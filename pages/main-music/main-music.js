// pages/main-music/main-music.js
import { getMusicBanner } from "../../services/music"
import querySelect from "../../utils/query-select"
import { throttle } from 'underscore'
const querySelectThrottle = throttle(querySelect, 100)

Page({
  data: {
    searchValue: '',
    banners: [],
    bannerHeight: 0,
    screenWidth: 375,

    recommendSongs: [],

    // 歌单数据
    hotMenuList: [],
    recMenuList: [],
    // 巅峰榜数据
    isRankingData: false,
    rankingInfos: {}
  },
  onLoad() {
    this.fetchMusicBanner()
  },
  // 网络请求的方法封装
  async fetchMusicBanner() {
    const res = await getMusicBanner()
    this.setData({ banners: res.banners })
  },
  // 界面的事件监听方法
  onSearchClick() {
    wx.navigateTo({ url: '/pages/detail-search/detail-search' })
  },
  async onBannerImageLoad(event) {
    const res = await querySelectThrottle(".banner-image")
    const bannerHeight = res[0].height
    this.setData({ bannerHeight })
  }
})
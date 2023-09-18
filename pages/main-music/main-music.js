// pages/main-music/main-music.js
import { getMusicBanner, getPlaylistDetail, getSongMenuList } from "../../services/music"
import recommendStore from "../../store/recommendStore"
import querySelect from "../../utils/query-select"
import { throttle } from 'underscore'
const querySelectThrottle = throttle(querySelect, 100)

Page({
  data: {
    searchValue: '',
    banners: [],
    bannerHeight: 0,
    screenWidth: 375,
    /**推荐歌曲 */
    recommendSongs: [],
    /**热门歌单 */
    hotMenuList: [],
    /**推荐歌单 */
    recMenuList: [],
    // 巅峰榜数据
    isRankingData: false,
    rankingInfos: {}
  },
  onLoad() {
    this.fetchMusicBanner()
    // this.fetchRecommendSongs()
    // 监听数据
    recommendStore.onState("recommendSongs", (value) => {
      this.setData({ recommendSongs: value.slice(0, 6) })
    })
    // 发起网络请求
    recommendStore.dispatch("fetchRecommendSongsAction")

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
  },
  onRecommendMoreClick() {
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=recommend',
    })
  },
  // async fetchRecommendSongs() {
  //   const res = await getPlaylistDetail(3778678)
  //   const playlist = res.playlist
  //   const recommendSongs = playlist.tracks.slice(0, 6)
  //   this.setData({ recommendSongs })
  // },
})
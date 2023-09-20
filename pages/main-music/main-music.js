// pages/main-music/main-music.js
import { getMusicBanner, getSongMenuList } from "../../services/music"
import recommendStore from "../../store/recommendStore"
import playerStore from "../../store/playerStore"
import querySelect from "../../utils/query-select"
import rankingStore, { rankingsMap } from "../../store/rankingStore"
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
    rankingInfos: {},
    /**当前播放歌曲 */
    currentSong: {},
    isPlaying: false,
  },
  onLoad() {
    this.fetchMusicBanner()
    this.fetchSongMenuList()
    // this.fetchRecommendSongs()
    // 监听数据
    recommendStore.onState("recommendSongInfo", this.handleRecommendSongs)

    for (const key in rankingsMap) {
      rankingStore.onState(key, this.getRankingHanlder(key))
    }
    // 发起网络请求
    recommendStore.dispatch("fetchRecommendSongsAction")
    rankingStore.dispatch("fetchRankingDataAction")

    playerStore.onStates(["currentSong", "isPlaying"], this.handlePlayInfos)

  },
  // 网络请求的方法封装
  async fetchMusicBanner() {
    const res = await getMusicBanner()
    this.setData({ banners: res.banners })
  },
  async fetchSongMenuList() {
    getSongMenuList().then(res => {
      this.setData({ hotMenuList: res.playlists })
    })
    getSongMenuList("华语").then(res => {
      this.setData({ recMenuList: res.playlists })
    })
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
  // 从store中获取数据
  handleRecommendSongs(value) {
    if (!value.tracks) return
    this.setData({ isRankingData: true })
    this.setData({ recommendSongs: value.tracks.slice(0, 6) })
  },
  handlePlayInfos({ currentSong, isPlaying }) {
    if (currentSong) {
      this.setData({ currentSong })
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying })
    }
  },
  getRankingHanlder(ranking) {
    return value => {
      const newRankingInfos = { ...this.data.rankingInfos, [ranking]: value }
      this.setData({ rankingInfos: newRankingInfos })
    }
  },
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList", this.data.recommendSongs)
    playerStore.setState("playSongIndex", index)
  },
  /**播放/暂停 */
  onPlayOrPauseBtnTap() {
    playerStore.dispatch("playMusicStatusAction")
  },
  /**跳转详情 */
  onPlayBarTap() {
    wx.navigateTo({
      url: '/pages/music-player/music-player'
    })
  },
  /**下一首 */
  onPlayNextBtnTap() {
    playerStore.dispatch("playNewMusicAction")
  },
  /**卸载 */
  onUnload() {
    playerStore.offStates(["currentSong", "isPlaying"], this.handlePlayInfos)
    recommendStore.offState("recommendSongs", this.handleRecommendSongs)
  }
})
// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../services/player"
import { throttle } from 'underscore'

const app = getApp()
const audioContext = wx.createInnerAudioContext()

Page({
  data: {
    id: 0,
    /**当前歌曲 */
    currentSong: {},
    /**歌词 */
    lrcString: "",
    /**当前页 */
    currentPage: 0,
    contentHeight: 0,
    pageTitles: ["歌曲", "歌词"],

    currentTime: 0,
    durationTime: 0,
    sliderValue: 0,
    isSliderChanging: false,
    isWaiting: false
  },
  onLoad(options) {
    this.setData({
      contentHeight: app.globalData.contentHeight
    })
    const id = options.id
    this.setData({ id })

    // 根据id获取歌曲详情
    getSongDetail(id).then(res => {
      this.setData({
        currentSong: res.songs[0],
        durationTime: res.songs[0].dt
      })
    })
    // 获取歌词信息
    getSongLyric(id).then(res => {
      this.setData({ lrcString: res.lrc })
    })
    // 播放当前歌曲
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true
    // 监听播放进度
    const throttleUpdateProgress = throttle(this.updateProgress, 500, { leading: false })
    audioContext.onTimeUpdate(() => {
      if (!this.data.isSliderChanging && !this.data.isWaiting) {
        throttleUpdateProgress()
      }
    })
    audioContext.onWaiting(() => {
      audioContext.pause()
    })
    audioContext.onCanplay(() => {
      audioContext.play()
    })
  },
  /**更新进度条 */
  updateProgress() {
    // 记录当前时间
    this.setData({ currentTime: audioContext.currentTime * 1000 })
    // 修改滑块值
    const sliderValue = this.data.currentTime / this.data.durationTime * 100
    this.setData({ sliderValue })
  },
  // 事件监听
  onSwiperChange(event) {
    this.setData({ currentPage: event.detail.current })
  },
  onNavTabItemTap(event) {
    const index = event.currentTarget.dataset.index
    this.setData({ currentPage: index })
  },
  /**监听滑块滚动 */
  onSliderChange(event) {
    this.data.isWaiting = true
    setTimeout(() => {
      this.data.isWaiting = false
    }, 1500)
    const value = event.detail.value
    const currentTime = value / 100 * this.data.durationTime
    audioContext.seek(currentTime / 1000)
    this.setData({ currentTime, isSliderChanging: false, sliderValue: value })
  }
})
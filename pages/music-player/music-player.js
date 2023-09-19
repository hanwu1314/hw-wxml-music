// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../services/player"
import { parseLyric } from "../../utils/parse-lyric"
import { throttle } from 'underscore'

const app = getApp()
const audioContext = wx.createInnerAudioContext()

Page({
  data: {
    id: 0,
    /**当前歌曲 */
    currentSong: {},
    /**歌词 */
    lyricInfos: "",
    /**当前页 */
    currentPage: 0,
    /**内容高度 */
    contentHeight: 0,
    /**页面标题 */
    pageTitles: ["歌曲", "歌词"],

    /**当前时长 */
    currentTime: 0,
    /**总时长 */
    durationTime: 0,
    /**滑块值 */
    sliderValue: 0,
    /**滑块是否发生改变 */
    isSliderChanging: false,
    /**是否等待 */
    isWaiting: false,
    /**是否播放 */
    isPlaying: true,
    /**当前歌词文本 */
    currentLyricText: "",
    /**当前歌词索引 */
    currentLyricIndex: -1,
    /**歌词滚动位置 */
    lyricScrollTop: 400,
    /**图片样式*/
    albumCircle: false,
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
      const lrcString = res.lrc.lyric
      const lyricInfos = parseLyric(lrcString)
      this.setData({ lyricInfos })
    })
    // 播放当前歌曲
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true
    // 监听播放进度
    const throttleUpdateProgress = throttle(this.updateProgress, 500, { leading: false, trailing: false })
    audioContext.onTimeUpdate(() => {
      // 更新歌曲的进度
      if (!this.data.isSliderChanging && !this.data.isWaiting) {
        throttleUpdateProgress()
      }
      if (!this.data.lyricInfos.length) return
      // 匹配正确的歌词 - 找到比当前时间大的减去1就是当前歌词
      let index = -1
      for (let i = 0; i < this.data.lyricInfos.length; i++) {
        const info = this.data.lyricInfos[i]
        if (info.time > audioContext.currentTime * 1000) {
          index = i - 1
          break
        }
      }
      if (index === this.data.currentLyricIndex) return
      const currentLyricText = this.data.lyricInfos[index].text
      this.setData({
        currentLyricText,
        currentLyricIndex: index,
        lyricScrollTop: 35 * index //改变歌词滚动页面的位置
      })
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
    const sliderValue = this.data.currentTime / this.data.durationTime * 100
    this.setData({
      currentTime: audioContext.currentTime * 1000,
      sliderValue
    })
  },
  // 事件监听
  /**监听滑动页面切换 */
  onSwiperChange(event) {
    this.setData({ currentPage: event.detail.current })
  },
  /**监听点击标签栏切换 */
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
    this.setData({
      currentTime,
      isSliderChanging: false,
      sliderValue: value,
      isPlaying: true
    })
  },
  /**监听播放暂停按钮的点击 */
  onPlayOrPauseTap() {
    if (!audioContext.paused) {
      audioContext.pause()
      this.setData({ isPlaying: false })
    } else {
      audioContext.play()
      this.setData({ isPlaying: true })
    }
  },
  /**监听单行歌词的点击 */
  onLyricClick() {
    this.setData({ currentPage: 1 })
  },
  /**监听歌曲图片的点击 */
  onAlbumClick() {
    const albumCircle = !this.data.albumCircle
    console.log(albumCircle);
    this.setData({ albumCircle })
  }
})
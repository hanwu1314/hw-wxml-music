// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../services/player"

const app = getApp()

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
  },
  onLoad(options) {
    this.setData({
      contentHeight: app.globalData.contentHeight
    })
    const id = options.id
    this.setData({ id })

    // 根据id获取歌曲详情
    getSongDetail(id).then(res => {
      this.setData({ currentSong: res.songs[0] })
    })
    // 获取歌词信息
    getSongLyric(id).then(res => {
      this.setData({ lrcString: res.lrc })
    })

  },
  // 事件监听
  onSwiperChange(event) {
    this.setData({ currentPage: event.detail.current })
  }
})
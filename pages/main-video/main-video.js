// pages/main-video/main-video.js
import { getTopMV } from "../../services/video"
Page({
  data: {
    videoList: [],
    offset: 0,
    /**是否有更多 */
    hasMore: true
  },
  onLoad() {
    this.fetchTopMV()
  },
  async fetchTopMV() {
    const res = await getTopMV(this.data.offset)
    // 新数据追加
    const newVideoList = [...this.data.videoList, ...res.data]
    this.setData({ videoList: newVideoList })
    this.data.offset = this.data.videoList.length
    this.data.hasMore = res.hasMore
  },
  onReachBottom() {
    if (!this.data.hasMore) return
    this.fetchTopMV()
  },
  async onPullDownRefresh() {
    // 1.清空之前的数据
    this.setData({ videoList: [] })
    this.data.offset = 0
    this.data.hasMore = true

    // 2.重新请求新的数据
    await this.fetchTopMV()

    // 3.停止下拉刷新
    wx.stopPullDownRefresh()
  },
})
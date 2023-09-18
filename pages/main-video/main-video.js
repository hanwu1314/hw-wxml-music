// pages/main-video/main-video.js
import { getTopMV } from "../../services/video"
Page({
  data: {
    videoList: []
  },
  onLoad() {
    this.fetchTopMV()
  },
  async fetchTopMV() {
    const res = await getTopMV()
    this.setData({ videoList: res.data })
  }
})
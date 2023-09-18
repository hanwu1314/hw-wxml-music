// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
Page({
  data: {
    songs: []
  },
  onLoad() {
    recommendStore.onState("recommendSongs", this.handleRecommendSongs)
  },
  onUnload() {
    recommendStore.offState("recommendSongs", this.handleRecommendSongs)
  },
  handleRecommendSongs(value) {
    this.setData({ songs: value })
  }
})
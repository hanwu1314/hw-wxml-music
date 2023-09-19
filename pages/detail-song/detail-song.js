// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
Page({
  data: {
    type: "ranking",
    key: "newRanking",
    id: "",

    songInfo: {}
  },
  onLoad(options) {
    const type = options.type
    this.data.type = type

    if (type == "ranking") {
      const key = options.key
      this.data.key = key
      rankingStore.onState(key, this.handleRanking)
    } else if (type === "recommend") {
      // this.data.key = "recommendSongInfo"
      recommendStore.onState("recommendSongInfo", this.handleRanking)
    }
  },
  handleRanking(value) {
    this.setData({ songInfo: value })
    wx.setNavigationBarTitle({
      title: value.name,
    })
  },
  onUnload() {
    if (this.data.type === "ranking") {
      rankingStore.offState(this.data.key, this.handleRanking)
    } else if (this.data.type === "recommend") {
      recommendStore.offState("recommendSongInfo", this.handleRanking)
    }
  }
})
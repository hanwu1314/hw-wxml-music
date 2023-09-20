// components/song-item-v3/song-item-v3.js
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: -1
    },
    currentIndex:{
      type:Number,
      value:0
    }
  },
  methods: {
    onSongItemTap() {
      const id = this.properties.itemData.id
      // wx.navigateTo({
      //   url: `/pages/music-player/music-player?id=${id}`,
      // })
    },
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      // playerStore.onStates(["currentIndex"], this.getPlaySongInfosHandler)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      // playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    },
  }
})

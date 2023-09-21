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
    currentIndex: {
      type: Number,
      value: 0
    }
  },
  methods: {
    onSongItemTap() {
      const id = this.properties.itemData.id
    },
  },
})

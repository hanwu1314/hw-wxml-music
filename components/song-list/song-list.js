// components/song-list/song-list.js
import playerStore from "../../store/playerStore"
Component({
  properties: {
    playSongList: {
      type: Array,
      value: []
    },
    playSongIndex: {
      type: Number,
      value: 0
    }
  },
  methods: {
    onshadeTap() {
      this.triggerEvent("shadeTap")
    },
    onSongItemTap(event) {
      const id = event.currentTarget.dataset.id
      const playSongIndex = event.currentTarget.dataset.index
      playerStore.dispatch("playMusicWithSongIdAction", id)
      playerStore.dispatch("PlaySongIndexAction", playSongIndex)
    }
  }
})

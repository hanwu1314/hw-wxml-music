import { HYEventStore } from "hy-event-store"
import { getSongDetail, getSongLyric } from "../services/player"
import { parseLyric } from "../utils/parse-lyric"

export const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
    id: 0,
    /**当前歌曲 */
    currentSong: {},
    /**当前时长 */
    currentTime: 0,
    /**总时长 */
    durationTime: 0,
    /**歌词 */
    lyricInfos: [],
    /**当前歌词文本 */
    currentLyricText: "",
    /**当前歌词索引 */
    currentLyricIndex: -1,
    /**是否播放 */
    isPlaying: false,
    /**播放模式   0:顺序播放 1:单曲循环 2:随机播放*/
    playModeIndex: 0,
    /**歌曲列表 */
    playSongList: [],
    /**播放索引 */
    playSongIndex: 0,
    isFirstPlay: true,
  },
  actions: {
    playMusicWithSongIdAction(ctx, id) {
      // 重置数据
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.durationTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""
      ctx.lyricInfos = []

      ctx.id = id
      ctx.isPlaying = true
      // 根据id获取歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0],
          ctx.durationTime = res.songs[0].dt
      })
      // 获取歌词信息
      getSongLyric(id).then(res => {
        const lrcString = res.lrc.lyric
        const lyricInfos = parseLyric(lrcString)
        ctx.lyricInfos = lyricInfos
      })
      // 播放当前歌曲
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true
      // 监听播放进度
      if (ctx.isFirstPlay) {
        ctx.isFirstPlay = false
        audioContext.onTimeUpdate(() => {
          // 获取当前播放的时间
          ctx.currentTime = audioContext.currentTime
          // 匹配正确的歌词 - 找到比当前时间大的减去1就是当前歌词
          if (!ctx.lyricInfos.length) return
          let index = -1
          for (let i = 0; i < ctx.lyricInfos.length; i++) {
            const info = ctx.lyricInfos[i]
            if (info.time > audioContext.currentTime * 1000) {
              index = i - 1
              break
            }
          }
          if (index === ctx.currentLyricIndex || index === -1) return
          const currentLyricText = ctx.lyricInfos[index]?.text
          if (currentLyricText !== undefined) {
            ctx.currentLyricText = currentLyricText
            ctx.currentLyricIndex = index
          }
        })
        audioContext.onWaiting(() => {
          audioContext.pause()
        })
        audioContext.onCanplay(() => {
          audioContext.play()
        })
        audioContext.onEnded(() => {
          if (audioContext.loop) return
          // 切换下一首歌曲
          this.dispatch("playNewMusicAction")
        })
      }
    },
    playMusicStatusAction(ctx) {
      if (!audioContext.paused) {
        audioContext.pause()
        ctx.isPlaying = false
      } else {
        audioContext.play()
        ctx.isPlaying = true
      }
    },
    changePlayModeAction(ctx) {
      let modeIndex = ctx.playModeIndex
      modeIndex = modeIndex + 1
      if (modeIndex === 3) modeIndex = 0
      if (modeIndex === 1) {
        audioContext.loop = true
      } else {
        audioContext.loop = false
      }
      ctx.playModeIndex = modeIndex
    },
    playNewMusicAction(ctx, isNext = true) {
      const length = ctx.playSongList.length
      let index = ctx.playSongIndex

      // 2.根据之前的数据计算最新的索引
      switch (ctx.playModeIndex) {
        case 1:
        case 0:
          index = isNext ? index + 1 : index - 1
          if (index === length) index = 0
          if (index === -1) index = length - 1
          break
        case 2:
          do {
            index = Math.floor(Math.random() * length)
          } while (index === ctx.playSongIndex && ctx.playSongList.length !== 1)
          break
      }
      const newSong = ctx.playSongList[index]
      this.dispatch("playMusicWithSongIdAction", newSong.id)
      ctx.playSongIndex = index
    }
  }
})

export default playerStore
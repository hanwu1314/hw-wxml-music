// pages/music-player/music-player.js
import playerStore, { audioContext } from "../../store/playerStore"
import { throttle } from 'underscore'

const app = getApp()
Page({
  data: {
    stateKeys: ["id", "currentSong", "durationTime", "currentTime", "lyricInfos", "currentLyricText", "currentLyricIndex", "isPlaying", "playModeIndex"],

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
    /**当前页 */
    currentPage: 0,
    /**内容高度 */
    contentHeight: 0,
    /**页面标题 */
    pageTitles: ["歌曲", "歌词"],
    /**滑块值 */
    sliderValue: 0,
    /**滑块是否发生改变 */
    isSliderChanging: false,
    /**是否等待 */
    isWaiting: false,
    /**是否播放 */
    isPlaying: true,
    /**当前播放索引 */
    playSongIndex: 0,
    /**当前播放列表 */
    playSongList: [],
    /**是否是第一次播放 */
    isFirstPlay: true,
    /**播放模式： 0顺序播放 1单曲循环 2随机播放 */
    playModeIndex: 0,
    /**歌词滚动位置 */
    lyricScrollTop: 400,
    /**图片样式*/
    albumCircle: false,
    isShowList: false,
  },
  onLoad(options) {
    this.setData({
      contentHeight: app.globalData.contentHeight
    })
    const id = options.id
    if (id) {
      playerStore.dispatch("playMusicWithSongIdAction", id)
    }
    // const throttleUpdateProgress = throttle(this.updateProgress, 500, { leading: false, trailing: false })

    // -- 获取store共享数据
    playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    playerStore.onStates(this.data.stateKeys, this.getPlayerInfosHandler)

  },
  /**更新进度条 */
  updateProgress: throttle(
    function (currentTime) {
      if (this.data.isSliderChanging) return;
      // 1.记录当前的时间 2.修改sliderValue
      const sliderValue = (currentTime / this.data.durationTime) * 100;
      this.setData({ currentTime, sliderValue });
    },
    800,
    { leading: false }
  ),
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
  onSliderChange: throttle(function (event) {
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
  }, 200),
  /**监听播放暂停按钮的点击 */
  onPlayOrPauseTap() {
    playerStore.dispatch("playMusicStatusAction")
  },
  /**监听单行歌词的点击 */
  onLyricClick() {
    this.setData({ currentPage: 1 })
  },
  /**监听歌曲图片的点击 */
  onAlbumClick() {
    const albumCircle = !this.data.albumCircle
    this.setData({ albumCircle })
  },
  /**页面返回 */
  onNavBackTap() {
    wx.navigateBack()
  },
  /**上一首 */
  onPrevBtnTap() {
    playerStore.dispatch("playNewMusicAction", false)
  },
  /**下一首 */
  onNextBtnTap() {
    playerStore.dispatch("playNewMusicAction")
  },
  /**改变歌曲 */
  changeNewSong(isNext = true) {
    const length = this.data.playSongList.length
    let index = this.data.playSongIndex

    switch (this.data.playModeIndex) {
      case 0:
      case 1:
        index = isNext ? index + 1 : index - 1
        if (index === length) index = 0
        if (index === -1) index = length - 1
        break
      case 2:
        index = Math.floor(Math.random() * length)
        break
    }
    const newSong = this.data.playSongList[index]
    // 数据初始化
    this.setData({ currentSong: {}, sliderValue: 0, currentTime: 0, durationTime: 0 })
    this.setupPlaySong(newSong.id)
    // 保存最新的索引值--保存到共享数据中
    playerStore.setState("playSongIndex", index)
  },
  onModeBtnTap() {
    playerStore.dispatch("changePlayModeAction");
  },
  // store共享数据
  /**获取播放列表 */
  getPlaySongInfosHandler({ playSongList, playSongIndex }) {
    if (playSongList) {
      this.setData({ playSongList })
    }
    if (playSongIndex !== undefined) {
      this.setData({ playSongIndex })
    }
  },
  getPlayerInfosHandler({
    id,
    currentSong,
    durationTime,
    currentTime,
    lyricInfos,
    currentLyricText,
    currentLyricIndex,
    isPlaying,
    playModeIndex,
  }) {
    if (id !== undefined) {
      this.setData({ id });
    }
    if (currentSong) {
      this.setData({ currentSong });
    }
    if (durationTime !== undefined) {
      this.setData({ durationTime });
    }
    if (currentTime !== undefined) {
      // 根据当前时间改变进度
      this.updateProgress(currentTime * 1000);
    }
    if (lyricInfos) {
      this.setData({ lyricInfos });
    }
    if (currentLyricText) {
      this.setData({ currentLyricText });
    }
    if (currentLyricIndex !== undefined) {
      // 修改lyricScrollTop
      this.setData({
        currentLyricIndex,
        lyricScrollTop: currentLyricIndex * 35,
      });
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying });
    }
    if (playModeIndex !== undefined) {
      this.setData({
        playModeIndex
      });
    }
  },
  onListBtnTap() {
    this.setData({ isShowList: true })
  },
  onShadeTap() {
    this.setData({ isShowList: false })
  },
  /**卸载 */
  onunload() {
    playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    playerStore.offStates(this.data.stateKeys, this.getPlayerInfosHandler)
  }
})
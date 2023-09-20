// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from "../../services/music"
Page({
  data: {
    songMenus: []
  },
  onLoad() {
    this.fetchGetAllMenuList()
  },
  //  发送网络请求
  async fetchGetAllMenuList() {
    const tagRes = await getSongMenuTag()
    const tags = tagRes.tags
    // 根据tag获取歌单
    const allPromises = []
    for (const tag of tags) {
      const promise = getSongMenuList(tag.name)
      allPromises.push(promise)
    }

    // 3.获取到所有的数据之后, 调用一次setData
    Promise.all(allPromises).then(res => {
      this.setData({ songMenus: res })
    })
  }
})
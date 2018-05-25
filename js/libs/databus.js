import Pool from './pool.js'

let instance
let spritesList = ['background', 'upPencil', 'downPencil', 'land', 'bird', 'score', 'start']

/**
 * 全局状态管理器[单例模式, 用作全局数据的储存]
 */
export default class DataBus {
  constructor() {
    if ( instance ) return instance // 第二次调用时返回第一次的实例对象

    this.initial() // 首次创建

    instance = this

    return this
    
  }

  // 获取实例对象
  static getInstance() {
    return instance
  }

  // 初始化
  initial() {
    this.map = new Map() // 利用map存储数据
    this.pool = new Pool() // 复用池 用于多次出现消失的类 用于复用减少重新new时的新能损耗
    this.reset() // 数据规0
  }

  // 配置
  put(key, val) {
    // 传入对象
    if (arguments.length === 1) {
      for (let [key, val] of Object.entries(key)) {
        // 传入方法则创建方法实例
        if (val instanceof Function) val = new val()

        this.map.set(key, val)
      }
    } 

    // 传入key val
    if (arguments.length === 2) {
      if (val instanceof Function) val = new val()

      this.map.set(key, val)
    }

    return this
  }

  // 获取
  get(key) {
    return this.map.get(key)
  }

  // 重置分数
  reset() {
    for (let val of this.map.values()) {
      val = null
    }
  }

  // 摧毁对象
  destory(key, val = null) {
    this.map.set(key, val)
  }

  // 获取图片资源
  getImgResource(key) {
    return this.map.get('resource').imgList[key]
  }

  // 传值返回对应精灵 不传值返回所有精灵
  getSprites(key) {   
    if (key) {
      return this.map.get(key)
    } else {
      return spritesList.map(key => {
        return this.map.get(key)
      })
    }
  }

  // 获取所有笔
  getPencils() {
    let downPencil = this.map.get('downPencil')
    let upPencil = this.map.get('upPencil')

    return downPencil.concat(upPencil)
  }
}

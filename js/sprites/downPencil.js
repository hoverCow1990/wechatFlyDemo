import Pencil from '../base/pencil.js'
import DataBus from '../libs/databus.js'

/**
 * 笔类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class DownPencil extends Pencil {
  constructor(randomTop, isFirst) {
    let canvas = new DataBus().get('canvas')
    let img = new DataBus().getImgResource('pencilDown')  // 图片
    
    let y = randomTop
    let randomGup = Math.floor(Math.random() * canvas.height / 11 + canvas.height / 11)
    let headTop = y + randomGup + 72
    
    super(img, y + randomGup, headTop, isFirst)

    this.type = 'down'
    this.headTop = headTop
  }
}

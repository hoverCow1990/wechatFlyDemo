import Pencil from '../base/pencil.js'
import DataBus from '../libs/databus.js'

/**
 * 笔类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class UpPencil extends Pencil {
  constructor(randomTop, isFirst) {
    let canvas = new DataBus().get('canvas')
    let img = new DataBus().getImgResource('pencilUp')  // 图片
    let x = -img.width
    let y = randomTop - img.height
    let headTop = randomTop - 72 
    
    super(img, y, headTop, isFirst)

    this.type = 'up'
    this.addScoreW = canvas.width / 5
    this.scoreSwitch = true
  }

  draw() {
 
    // 超过鸟的位置之后加分
    if (this.x < this.addScoreW && this.scoreSwitch) {
      this.scoreSwitch = false    
      setTimeout(() => {
        new DataBus().get('score').addScore()
      }, 200)
      new DataBus().get('socreAudio').play()
    }

    super.draw()
  }
}

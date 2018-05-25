import Sprite from '../base/sprite'
import DataBus from '../libs/databus.js'

/**
 * 陆地类
 * 提供draw函数实现无限滚动的背景功能
 */
export default class Land extends Sprite {
  constructor() {
    let canvas = new DataBus().get('canvas')
    let img = new DataBus().getImgResource('land')  // 图片
    let width = img.width // 宽度
    let height = img.height // 高度
    let x = 0 // 起始x坐标
    let y = canvas.height - img.height // 起始y坐标
    let showX = img.width
    let showY = img.height

    super({ img, width, height, x, y, showX, showY })

    this.canvas = canvas
    this.statue = 0 // 状态为0时保持不动 1时运动
  }

  // 重置数据
  reset() {
    this.x = 0

    super.reset()
  }


  // 画出对象
  draw() {
    if (this.statue === 1) { // 状态为1时运动
      this.x -= 2

      if (this.x <= (this.canvas.width - this.width)) {
        this.x = 0
      }
    }
    super.draw()
  }
  
  // 获取地面盖度
  getLandTop() {
    return this.y
  }
}
import Sprite from '../base/sprite.js'
import DataBus from '../libs/databus.js'

/**
 * 陆地类
 * 提供draw函数实现无限滚动的背景功能
 */
export default class Start2 extends Sprite {
  constructor(op) {
    let canvas = new DataBus().get('canvas')
    let img = new DataBus().getImgResource('startButton2')  // 图片
    let width = img.width // 宽度
    let height = img.height // 高度
    let showY = 50
    let showX = img.width / img.height * showY

    let x = (canvas.width - showX) / 2 // 起始x坐标
    let y = canvas.height * 0.85 - 10 - 6 - showY// 起始y坐标

    super({ img, width, height, x, y, showX, showY })

    this.visible = false
    this.canvas = canvas
    this.statue = 0 // 状态为0时保持不动 1时运动
  }
}
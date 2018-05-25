import Sprite from '../base/sprite.js'
import DataBus from '../libs/databus.js'

/**
 * 陆地类
 * 提供draw函数实现无限滚动的背景功能
 */
export default class Land extends Sprite {
  constructor() {
    let canvas = new DataBus().get('canvas')
    let img = new DataBus().getImgResource('startButton')  // 图片
    let width = img.width // 宽度
    let height = img.height // 高度
    let x = (canvas.width - img.width / 4 * 3) / 2 // 起始x坐标
    let y = (canvas.height * 8 / 10 - img.height) / 2 // 起始y坐标
    let showX = img.width / 4 * 3
    let showY = img.height / 4 * 3

    super({ img, width, height, x, y, showX, showY })

    this.canvas = canvas
    this.statue = 0 // 状态为0时保持不动 1时运动
  }
}
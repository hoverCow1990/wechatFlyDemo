import Sprite from '../base/sprite'
import DataBus from '../libs/databus.js'

/**
 * 游戏背景类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class BackGround extends Sprite {
  constructor() {
    let canvas = new DataBus().get('canvas')
    let img = new DataBus().getImgResource('background')  // 图片
    let width = img.width // 宽度
    let height = img.height // 高度
    let x = 0 // 起始坐标
    let y = 0 // 结束坐标
    let showX = canvas.width
    let showY = canvas.height

    super({img, width, height, x, y, showX, showY})
  }
}

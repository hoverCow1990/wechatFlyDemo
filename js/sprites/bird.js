import Sprite from '../base/sprite.js'
import DataBus from '../libs/databus.js'

const birdConfig = {
  width: 34,
  height: 24,
  srcY: 10,
  jumpY: 40,
  list: [
    {
      srcX: 9
    },
    {
      srcX: 9 + 34 + 18
    },
    {
      srcX: 9 + 34 + 18 + 34 + 18
    }
  ]
}

export default class Bird extends Sprite {
  constructor() {
    let canvas = new DataBus().get('canvas')
    let img = new DataBus().getImgResource('birds')  // 图片
    let width = birdConfig.width
    let height = birdConfig.height
    let x = canvas.width / 8
    let y = canvas.height / 3
    let showX = birdConfig.width
    let showY = birdConfig.height
    let srcX = birdConfig.list[0].srcX
    let srcY = birdConfig.srcY

    super({ img, width, height, x, y, showX, showY, srcX, srcY })

    this.canvas = canvas
    this.reset()
  }

  // 重置数据
  reset() {
    let y = new DataBus().get('canvas').height / 3

    this.y = y
    this.playFrames = 0
    this.upCount = 0
    this.jumpCount = 0
    this.stY = y // 初始的y
    this.jumpY = y // 起跳位置

    super.reset()
  }

  // 绘制
  draw() { 
    let ctx = this.canvas.getContext('2d')
    
    ctx.save() // 储存画布

    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.shadowBlur = 1

    if (this.statue === 1) {
      let g = 0.98 / 2.4 // 重力加速度
      let offsetUp = 5 // 向上偏移
      let y = g * this.upCount * (this.upCount - offsetUp) / 2
      this.y = this.stY + y
      this.playFrames = this.playFrames + 0.2
      this.upCount++

      // 往下掉的时候头部角度往下
      let transX = this.x + this.showX / 2
      let transY = this.y + this.showY / 2

      ctx.translate(transX, transY)
      ctx.rotate(Math.PI / 12)
      ctx.translate(transX * -1, transY * -1)
    } else if (this.statue === 2) {
      let targetY = this.jumpY - birdConfig.jumpY

      this.y -= 2.5
      this.playFrames = this.playFrames + 0.2
      this.upCount++
      
      if (this.y <= targetY) {
        this.stY = this.y
        this.upCount = 0
        this.statue = 1
      }

      // 往上飞的时候头部角度往上
      let transX = this.x + this.showX / 2
      let transY = this.y + this.showY / 2

      ctx.translate(transX, transY)
      ctx.rotate(Math.PI / -12)
      ctx.translate(transX * -1, transY * -1)
    }


    let showIndex = Math.floor(this.playFrames) % 3

    this.srcX = birdConfig.list[showIndex].srcX

    super.draw()

    ctx.restore() // 恢复画布
  }
}
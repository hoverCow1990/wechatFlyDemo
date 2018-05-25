import Sprite from '../base/sprite.js'
import DataBus from '../libs/databus.js'
import Pool from '../libs/pool.js' 


let minTop = 0
let maxTop = 0
let pencilFootWidth = 0 
let pencilTriArea = 0 // 笔尖三角形面积

/**
 * 笔类
 * 提供update和render函数实现无限滚动的背景功能
 */
export default class Pencil extends Sprite {
  constructor(img, y, headTop, isFirst) {

    let canvas = new DataBus().get('canvas')
    let x = isFirst ? canvas.width * 18 / 20 - img.width : canvas.width // 出现位置
    let width = img.width // 截取宽度
    let height = img.height // 截取高度
    let showX = img.width // 展示宽度
    let showY = img.height  // 展示高度  
    
    super({ img, width, height, x, y, showX, showY })

    this.canvas = canvas
    this.statue = 0 // isFirst ? 0 : 1 // 0为禁止 1为运动中
    this.headTop = headTop
    this.pencilFootWidth = this.getPencilFootWidth()
    this.pencilTriArea = this.getPencilTriArea() // 笔尖三角形面积
  }

  // 渲染
  draw() {
    this.ctx.save()
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
    this.ctx.shadowOffsetX = 2
    this.ctx.shadowOffsetY = 2
    this.ctx.shadowBlur = 1

    // 在玩的状态
    if (this.statue === 1) {
      this.x -= 2
      // 出界情况
      if (this.x <= -this.width) {
        if (this.type === 'up') {
          // 移除出界的上铅笔
          let upPencil = new DataBus().get('upPencil').shift()

          upPencil.scoreSwitch = true

          // 存入pool内以供循环使用
          new Pool().recover('upPencil', upPencil)
        } else {
          // 移除出界的下铅笔
          let downPencil = new DataBus().get('downPencil').shift()

          // 存入pool内以供循环使用
          new Pool().recover('downPencil', downPencil)
        }
      }
    }
    super.draw()
    this.ctx.restore()
  }
  
  // 将x轴位置重置为初始状态
  resetX() {
    this.x = this.canvas.width + this.width
  }

  // 出现时获取随机高度
  static getRandomTop(canvas) {
    if (canvas) {
      minTop = canvas.height / 6
      maxTop = canvas.height / 8 * 5
    }

    return Math.floor(Math.random() * (maxTop - minTop) + minTop)
  }
  
  // 获取铅笔底边斜边长度
  getPencilFootWidth() {
    if (pencilFootWidth) return pencilFootWidth
    
    return pencilFootWidth = Math.floor(this.showX / 2 / Math.cos(70 / 180 * Math.PI))
  }

  // 获取笔尖三角形面积
  getPencilTriArea() {
    if (pencilTriArea) return pencilTriArea

    return pencilTriArea = this.showX * 60 / 2
  }

  // 判断一个点是否在三角形内部
  isInTri(point) {
    let triPoint = this.getTriPoint() // 获取当前笔的三角形对应的坐标

    let area1 = Pencil.getArae(triPoint.a, triPoint.b, point)
    let area2 = Pencil.getArae(triPoint.b, triPoint.c, point)
    let area3 = Pencil.getArae(triPoint.a, triPoint.c, point)
    
    return Math.abs(pencilTriArea - (area1 + area2 + area3)) < 10
  }

  // 获取三角形的三个点的坐标
  getTriPoint() {
    let a = {
      x: this.x,
      y: this.headTop
    }
    let b = {
      x: this.x + this.showX,
      y: this.headTop
    }
    let c = {
      x: this.x + this.showX / 2,
      y: this.headTop + (this.type === 'up' ? 60 : - 60)
    }

    return {
      a,
      b,
      c
    }
  }

  // 获取面积
  // {x: 10, y: 20} p1 p2 为线段 p3为点坐标
  static getArae(p1, p2, p3) {
    let pointLine = Pencil.getPointLine(p1, p2) // 获取两点之间距离
    let footLine = Pencil.getFootLine(p1, p2, p3)// 获取坐标点到线段之间垂足距离

    return pointLine * footLine / 2
  }

  // 根据两个坐标点算出之间距离
  static getPointLine(p1, p2) {
    return Math.pow(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2), 0.5)
  }

  // 传入坐标计算点到线段之间垂足(最短距离)
  // {x: 10, y: 20} p1 p2 为线段 p3为点坐标
  static getFootLine(p1, p2, p3) {
    let len

    // 如果p1.x == p2.x 说明是条竖着的线
    if (p1.x - p2.x === 0) {
      len = Math.abs(p3.x - p1.x)
    } else {
      let A = (p1.y - p2.y) / (p1.x - p2.x)
      let B = p1.y - A * p1.x

      len = Math.abs((A * p3.x + B - p3.y) / Math.sqrt(A * A + 1))
    }

    return len
  }
}

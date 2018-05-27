import DataBus from '../libs/databus.js'

let keys = ['showX', 'showY', 'width', 'height', 'x', 'y', 'srcX', 'srcY', 'score']

/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(op) {
    // 配置绘制属性
    this.img = op.img
    this.visible = true
    this.ctx = new DataBus().get('ctx') // 获取画板

    keys.forEach(key => {
      this[key] = op[key] || 0
    })
  }

  /**
     * img 传入Image对象
     * srcX 要剪裁的起始X坐标
     * srcY 要剪裁的起始Y坐标
     * srcW 剪裁的宽度
     * srcH 剪裁的高度
     * x 放置的x坐标
     * y 放置的y坐标
     * width 要使用的宽度
     * height 要使用的高度
     */
  draw() {
    if (!this.visible) return

    this.ctx.drawImage(
      this.img,
      this.srcX,
      this.srcY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.showX,
      this.showY
    )
  }

  // 切换精灵的状态
  changeStatue(num) {
    this.statue = num
  }

  // 获取对象的长度宽度坐标以用于检测碰撞
  getCollideInfo() {
    return {
      width: this.showX,
      height: this.showY,
      x: this.x,
      y: this.y
    }
  }

  /**
   * 简单的碰撞检测定义：
   * 另一个精灵的中心点处于本精灵所在的矩形内即可
   * @param{Sprite} sp: Sptite的实例
   */
  isCollideWith(sp) {
    let spX = sp.x + sp.width / 2
    let spY = sp.y + sp.height / 2

    if ( !this.visible || !sp.visible )
      return false

    return !!(   spX >= this.x
              && spX <= this.x + this.width
              && spY >= this.y
              && spY <= this.y + this.height  )
  }
  
  // 重置精灵
  reset() {
    this.statue = 0
  }
}

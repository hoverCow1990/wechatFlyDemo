// 用户头像
class UserImage {
  constructor(op) {
    ({
      img: this.img,
      x: this.x,
      y: this.y,
      width: this.width,
      stroke: this.stroke = 5,
      ctx: this.ctx
    } = op)

    this.r = op.width / 2
    this.clipX = op.x + this.r
    this.clipY = op.y + this.r
    // this.x = op.x
    // this.y = op.y
    // this.r = r// 半径
  }

  draw() {
    // this.ctx.save()
    // this.ctx.lineWidth = this.stroke
    // this.ctx.fillStyle = "rgba(255, 255, 255, .3)"
    // this.ctx.beginPath()
    // this.ctx.arc(this.clipX, this.clipY, this.r + this.stroke / 2, 0, 2 * Math.PI)
    // this.ctx.fill()

    // this.ctx.save()
    // this.ctx.beginPath()
    // this.ctx.arc(this.clipX, this.clipY, this.r, 0, 2 * Math.PI)
    // this.ctx.clip()
    if (!this.img) return

    this.ctx.drawImage(this.img, this.x, this.y, this.width, this.width)
    // this.ctx.closePath()
    // this.ctx.restore()
    // this.ctx.closePath()
  }
}

module.exports = UserImage
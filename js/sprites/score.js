import DataBus from '../libs/databus.js'

export default class Score {
  constructor() {
    let canvas = new DataBus().get('canvas') // 获取canvas
    let ctx = new DataBus().get('ctx') // 获取画板
    let gradient = ctx.createLinearGradient(0, 0, canvas.height / 16, 0) // 创建渐变

    this.score = 0 // 显示的分数
    this.tarScore = 0 // 每次的目标分数
    this.x = canvas.width / 20
    this.y = canvas.height / 16
    this.canvas = canvas
    this.ctx = ctx
    this.timer = null

    gradient.addColorStop(0, "magenta")
    gradient.addColorStop(0.5, "blue")
    gradient.addColorStop(1.0, "red")

    this.gradient = gradient
  }

  reset() {
    this.score = 0
    this.timer && clearInterval(this.timer)
  }

  draw() {
    

    // this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
    // this.ctx.shadowOffsetX = 2
    // this.ctx.shadowOffsetY = 2
    // this.ctx.shadowBlur = 1
    // let gradient = this.ctx.createLinearGradient(0, 0, this.canvas.height / 16, 0) // 创建渐变

    // gradient.addColorStop(0, "magenta")
    // gradient.addColorStop(0.5, "blue")
    // gradient.addColorStop(1.0, "red")

    

    this.ctx.font = "27px Verdana";
    this.ctx.strokeStyle = "#222"
    this.ctx.lineWidth = 8

    this.ctx.strokeText(
      this.score, 
      this.x,
      this.y
    )

    this.ctx.font = "27px Verdana";
    // 用渐变填色
    this.ctx.fillStyle = '#fff'

    this.ctx.fillText(
      this.score,
      this.x,
      this.y
    )
  }
  
  // 增加分数
  addScore(score = 100) {
    this.tarScore = this.score + score

    this.timer = setInterval(() => {
      this.score += 2

      if (this.score >= this.tarScore) {
        this.score = this.tarScore 
        this.timer && clearInterval(this.timer)
      }
    }, 12)
  }
}
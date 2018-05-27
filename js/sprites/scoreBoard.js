import DataBus from '../libs/databus.js'
import UserImage from './userImage.js'
import Start2 from './start2.js'

const boardWidth = 0.76
const boardHeight = 0.7

export default class ScoreBoard {
  constructor(img) {
    let canvas = new DataBus().get('canvas') // 获取canvas
    let ctx = new DataBus().get('ctx') // 获取画板

    this.score = 0 // 显示的分数
    this.tarScore = 0 // 每次的目标分数
    this.width = canvas.width * boardWidth
    this.height = canvas.height * boardHeight
    this.x = canvas.width * (1 - boardWidth) / 2
    this.y = canvas.height * (1 - boardHeight) / 2

    this.userX = this.x + 8
    this.userY = this.y + 10
    this.userWidth = Math.floor(this.width / 5)
    this.nameX = this.userX + this.userWidth + 15
    this.nameY = this.userY + 15
    this.scoreX = this.x + this.width - 10
    this.scoreY = this.nameY
    this.topScoreX = this.nameX
    this.topScoreY = this.userY + this.userWidth - 5
    this.topScore = '0'
    this.nowScore = '0'
    this.canvas = canvas
    this.ctx = ctx
    this.visible = false

    this.userImage = new UserImage({
      img,
      ctx,
      x: this.userX,
      y: this.userY,
      width: this.userWidth
    })

    new DataBus().put('start2', new Start2({
      width: this.width * 0.8,
      y: this.y + this.height - 10
    }))

    this.Start2 = new DataBus().get('start2')
  }
  
  // 重置
  reset() {
    this.nowScore = '0'
  }

  // 设置分数
  setScore(score) {
    this.nowScore = '' + score
  }

  // 绘制
  draw() {

    if (!this.visible) return

    let userInfo = new DataBus().get('userInfo')

    if (!userInfo || !this.userImage) return

    this.ctx.lineJoin = "round"
    this.ctx.lineWidth = 8
    this.ctx.fillStyle = "rgba(0, 0, 0, .8)"
    this.ctx.strokeStyle = "rgba(0, 0, 0, .9)"
    this.ctx.fillRect(this.x, this.y, this.width, this.height)
    this.ctx.strokeRect(this.x - 4, this.y - 4, this.width + 8, this.height + 8)
    
    this.userImage.draw()

    this.ctx.font = "15px Verdana"
    this.ctx.fillStyle = "#fff"
    this.ctx.fillText(
      userInfo.nickName,
      this.nameX,
      this.nameY
    )

    this.ctx.font = "13px Verdana"
    this.ctx.fillStyle = "#9a9a9a"
    this.ctx.fillText(
      '最高分: ' + this.topScore,
      this.topScoreX,
      this.topScoreY
    )

    this.ctx.font = "bold 15px Verdana"
    this.ctx.fillStyle = "yellow"
    this.ctx.fillText(
      this.nowScore,
      this.scoreX - this.nowScore.length * 10,
      this.scoreY
    )

    this.Start2.draw()
  }
}
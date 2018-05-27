let DataBus = require('../libs/databus.js')
let UserImage = require('./userImage.js')
let FriendList = require('./friendList.js')

const boardWidth = 0.76
const boardHeight = 0.7

class ScoreBoard {
  constructor(img) {
    let canvas = new DataBus().get('canvas') // 获取canvas
    let ctx = new DataBus().get('ctx') // 获取画板

    this.score = 0 // 显示的分数
    this.tarScore = 0 // 每次的目标分数
    this.width = canvas.width * boardWidth
    this.height = canvas.height * boardHeight
    this.x = canvas.width * (1 - boardWidth) / 2
    this.y = canvas.height * (1 - boardHeight) / 2

    this.userX = this.x + 40
    this.userY = this.y + 10
    this.userWidth = Math.floor(this.width / 8)

    this.nameX = this.userX + this.userWidth + 15
    this.nameY = this.userY + this.userWidth * 0.65
    this.sortX = this.x + 10
    this.sortY = this.nameY
    this.topScoreX = this.x + this.width - 10
    this.topScoreY = this.nameY
    this.topScore = '0'
    this.nowScore = '0'
    this.userSort = ''
    this.canvas = canvas
    this.ctx = ctx
    this.visible = true

    let image = wx.createImage()

    image.src = img

    image.onload = () => {
      // 用户本人数据
      this.userImage = new UserImage({
        img: image,
        ctx,
        x: this.userX,
        y: this.userY,
        width: this.userWidth
      })
    }

    // 朋友圈好友列表注入全局数据
    this.friendList = new FriendList({
      x: this.sortX,
      y: this.userY + this.userWidth + 25,
      height: this.height - this.userWidth - 25 - 10 - 60, // 高度
      nameX: this.nameX,
      friendWidth: this.userWidth, // 好友头像宽度
      friendX: this.userX,
      rightX: this.topScoreX // 右边框的X
    })

    new DataBus().put('friendList', this.friendList)
  }
  
  // 重置
  reset() {
    this.nowScore = '0'
  }

  // 设置分数
  setScore(op) {
    this.userSort = op.userSort
    this.nowScore = '' + op.nowScore
    this.topScore = '' + op.topScore
    return this
  }

  // 设置朋友圈用户分数
  setFriendData(scoreList) {
    this.friendScore = scoreList

    this.friendList.setFriendData(scoreList) // 设置子类list的数据
    
    return this
  }

  // 绘制
  draw() {
    if (!this.visible) return

    let userInfo = new DataBus().get('userInfo')

    if (!userInfo || !this.userImage) return

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.lineJoin = "round"
    this.ctx.lineWidth = 6
    this.ctx.fillStyle = "rgba(0, 0, 0, .8)"
    this.ctx.strokeStyle = "rgba(0, 0, 0, .9)"
    this.ctx.fillRect(this.x, this.y, this.width, this.height)
    this.ctx.strokeRect(this.x - 3, this.y - 3, this.width + 6, this.height + 6)
    
    this.userImage.draw()

    this.ctx.font = "bold 14px Comic Sans Ms"
    this.ctx.fillStyle = "yellow"
    this.ctx.fillText(
      this.topScore,
      this.topScoreX - this.ctx.measureText(this.topScore).width,
      this.topScoreY
    )

    this.ctx.font = "bold 15px Comic Sans Ms"
    this.ctx.fillStyle = "#FFF"
    if (this.userSort === 1) {
      this.ctx.fillStyle = "#ff6b62"
    } else if (this.userSort === 2) {
      this.ctx.fillStyle = "#ffc02c"
    } else if (this.userSort === 3) {
      this.ctx.fillStyle = "#ffea48"
    }

    this.ctx.fillText(
      this.userSort,
      this.sortX,
      this.sortY
    )

    this.ctx.font = "13px Verdana"
    this.ctx.fillStyle = "#eee"

    this.ctx.fillText(
      userInfo.nickName,
      this.nameX,
      this.nameY
    )

    this.friendList.draw()
  }
}

module.exports = ScoreBoard
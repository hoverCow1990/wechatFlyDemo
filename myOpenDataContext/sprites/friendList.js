let DataBus = require('../libs/databus.js')
let UserImage = require('./userImage.js')

// 朋友列表类 渲染朋友分数头像排名等
class FriendList {
  constructor(op) {
    ({
      x: this.x,
      y: this.y,
      height: this.height,
      nameX: this.nameX,
      rightX: this.rightX,
      friendWidth: this.friendWidth,
      friendX: this.friendX
    } = op)

    this.isCanScroll = true
    this.timer = null
    this.width = this.rightX - this.x
    this.ctx = new DataBus().get('ctx') // 获取画板
  }

  // 设置朋友圈用户分数
  setFriendData(scoreList) {
    this.listData = scoreList
    this.stScrollTop = 0
    this.scrollTop = 0
    this.listHeight = scoreList.length * (this.friendWidth + 10) - 10
    this.scrollMax = (this.listHeight - this.height) * - 1

    let count = 0
    let length = scoreList.length
    let singleHeight = this.friendWidth + 10

    this.setShowLogo() // 设置渲染的头像位数 以增加性能

    if (Math.ceil(this.height / singleHeight) > scoreList.length) {
      this.isCanScroll = false
    }

    scoreList.forEach(item => {
      let img = wx.createImage()

      img.src = item.avatarUrl

      img.onload = () => {
        item.img = img
        count++
        if (count === length) {
          this.list = scoreList.map((friend, index) => {
            return new UserImage({
              img: friend.img,
              ctx: this.ctx,
              x: this.friendX,
              y: this.y + index * (this.friendWidth + 10),
              width: this.friendWidth
            })
          })
          new DataBus().trigger('render')
        }
      }
    })
  } 

  // 设置可渲染的头像位数 已增加性能
  setShowLogo() {
    let singleHeight = this.friendWidth + 10

    this.stShowIndex = (Math.floor(this.scrollTop / singleHeight) * -1) - 1
    this.endShowIndex = this.stShowIndex + Math.ceil(this.height / singleHeight)
  }

  // 滚动列表
  scorllY(moveX) {
    if (!this.isCanScroll) return

    this.scrollTop = Math.max(Math.min(this.stScrollTop + moveX, 0), this.scrollMax - 0)
    this.setShowLogo()
    // new DataBus().trigger('stopAnimation')
  }

  // 结束滚动
  endScroll(touchTime) {
    if (!this.isCanScroll) return new DataBus().trigger('stopAnimation')

    let scrollDis = this.scrollTop - this.stScrollTop

    this.stScrollTop = this.scrollTop

    // if (this.stScrollTop > 0) {
    //   this.timer && clearInterval(this.timer)
    //   this.timer = setInterval(() => {
    //     this.scrollTop -= 5
    //     if (this.scrollTop <= 0) {
    //       this.stScrollTop = this.scrollTop = 0
    //       clearInterval(this.timer)
    //     }
    //   }, 12)
    // } else if (this.stScrollTop < this.scrollMax) {
    //   this.timer && clearInterval(this.timer)
    //   this.timer = setInterval(() => {
    //     this.scrollTop += 5
    //     if (this.scrollTop >= this.scrollMax) {
    //       this.stScrollTop = this.scrollTop = this.scrollMax
    //       clearInterval(this.timer)
    //     }
    //   }, 12)
    //   return
    // }

    if (touchTime < 200) {
      this.timer && clearInterval(this.timer)
      let moveSpeed = scrollDis / 5
      let count = 0

      if (moveSpeed < 0) {
        this.timer = setInterval(() => {
          count++
          moveSpeed = moveSpeed + 0.1 * count
          this.scrollTop = Math.max(this.scrollTop + moveSpeed, this.scrollMax)
          if (moveSpeed >= 0) {
            this.stScrollTop = this.scrollTop
            clearInterval(this.timer)
            new DataBus().trigger('stopAnimation')
          }
          this.setShowLogo() // 设置渲染的头像位数 以增加性能
        }, 12)
      } else {
        this.timer = setInterval(() => {
          count++
          moveSpeed = moveSpeed - 0.1 * count
          this.scrollTop = Math.min(this.scrollTop + moveSpeed, 0)
          if (moveSpeed <= 0) {
            this.stScrollTop = this.scrollTop
            clearInterval(this.timer)
            new DataBus().trigger('stopAnimation')
          }
          this.setShowLogo() // 设置渲染的头像位数 以增加性能
        }, 12)
      }
    } else {
      this.setShowLogo()
      new DataBus().trigger('stopAnimation')
    }
  }

  // 绘制
  draw() {
    this.ctx.save()
    this.ctx.rect(this.x, this.y, this.width, this.height)
    this.ctx.transform(1, 0, 0, 1, 0, this.scrollTop)
    this.ctx.clip()
    this.list.forEach((friend, index) => {
      if (index < this.stShowIndex || index > this.endShowIndex) return
      let data = this.listData[index]

      friend && friend.draw()

      this.ctx.font = "13px Verdana"
      this.ctx.fillStyle = "#eee"

      this.ctx.fillText(
        data.nickname,
        this.nameX,
        friend.y + this.friendWidth * 0.6
      )

      this.ctx.font = "bold 15px Comic Sans Ms"
      this.ctx.fillStyle = "#FFF"
      if (index === 0) {
        this.ctx.fillStyle = "#ff6b62"
      } else if (index === 1) {
        this.ctx.fillStyle = "#ffc02c"
      } else if (index === 2) {
        this.ctx.fillStyle = "#ffea48"
      }
      

      this.ctx.fillText(
        index + 1,
        this.x,
        friend.y + this.friendWidth * 0.65
      )

      this.ctx.font = "bold 14px Comic Sans Ms"
      this.ctx.fillStyle = "#eee"
      this.ctx.fillText(
        data.score,
        this.rightX - this.ctx.measureText(data.score).width,
        friend.y + this.friendWidth * 0.65
      )
    })
    this.ctx.restore()
    // this.ctx.font = "13px Verdana"
    // this.ctx.fillStyle = "#9a9a9a"
    // this.ctx.fillText(
    //   '最高分: ' + this.topScore,
    //   this.topScoreX,
    //   this.topScoreY
    // )

  }
}

module.exports = FriendList
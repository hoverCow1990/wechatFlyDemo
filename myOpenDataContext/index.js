let utils = require('./libs/units.js') 
let DataBus = require('./libs/databus.js')
let ScoreBoard = require('./sprites/scoreBoard.js')

const OpenDataContext = {
  $data: {
    sharedCanvas: null,
    ctx: null,
  },
  initial() {
    this.timer = null
    this.statue = 0
    this.canvas = wx.getSharedCanvas()
    this.ctx = this.canvas.getContext('2d', {
      antialias: true,  // 消除锯齿
      antialiasSamples: 2200 // 抗锯齿样本数。最小值为 2，最大不超过系统限制数
    })
    
    new DataBus()
      .put({
        canvas: this.canvas,
        ctx: this.ctx
      })

    this.registEvent()
  },

  // 初次渲染
  render () {
    let wait = new Date() - this.update_time

    // 实现异步后主屏的在玩一次按钮与该分数面板请求后结果一起出现
    if (wait < 1000) {
      setTimeout(() => {
        new DataBus().get('scoreBoard').draw()
      }, 1000 - wait)
    } else {
      new DataBus().get('scoreBoard').draw()
    }
    
  },

  // 注册事件
  registEvent() {
    // 开放数据域,由主域发出数据信息
    wx.onMessage(data => {
      switch (data.type) {
        case 'userInfo':
          this.handlerUserInfo(data.data)
          break
        case 'score':
          this.handlerScore(data.data)
          break
        case 'stopAnimation':
          this.stop()
          break
      }
    })

    // 点击事件用于好友滚动条
    wx.onTouchStart((e) => {
      if (this.statue === 0) return

      let touch = e.touches[0]

      this.stTouchX = touch.pageX
      this.stTouchY = touch.pageY
      this.stTouchTime = new Date()
      this.animationLooper()
    })

    // 点击事件用于好友滚动条
    wx.onTouchMove((e) => {
      if (this.statue === 0) return

      let touch = e.touches[0]

      new DataBus().get('friendList').scorllY(touch.pageY - this.stTouchY)
    })

    // 点击事件用于好友滚动条
    wx.onTouchEnd((e) => {
      if (this.statue === 0) return

      let touch = e.touches[0]
      let touchTime = new Date() - this.stTouchTime

      new DataBus().get('friendList').endScroll(touchTime)
    })

    new DataBus().on('stopAnimation', () => {
      this.stopAnimation() // 停止渲染
    })

    new DataBus().on('render', () => this.render())
  },
  // 处理用户数据
  handlerUserInfo(userInfo) {
    new DataBus().put('userInfo', userInfo)
    new DataBus().put('scoreBoard', new ScoreBoard(new DataBus().get('userInfo').avatarUrl))
  },
  // 处理用户分数
  handlerScore(data) {
    this.update_time = data.update_time

    // 获取用户数据
    wx.getUserCloudStorage({
      keyList: ['rank'],
      success: res => {
        let userData = utils.getUserData(res.KVDataList, data)

        new DataBus().put('userScore', userData.userData)

        // 本次成绩需要上传
        if (userData.isNeedUpdata) {
          // 提交本人成绩
          wx.setUserCloudStorage({
            KVDataList: [userData.postData],
            success: () => {
              this.handlerFriendScore()
            }
          })
        } else {
          this.handlerFriendScore()    
        }
      }
    })
  },

  // 获取朋友圈数据
  handlerFriendScore() {
    wx.getFriendCloudStorage({
      keyList: ['rank'],
      success: res => {
        let data = res.data
        let userData = new DataBus().get('userInfo')
        let scoreList = utils.sortScoreList(data) // 分数由高到低排序
        let userSort = utils.getSort(scoreList, userData) // 分数由高到低排序

        console.log(scoreList)
        new DataBus().put('friendScore', scoreList)

        new DataBus().get('scoreBoard')
          .setScore({
            userSort,
            nowScore: new DataBus().get('userScore').nowScore,
            topScore: new DataBus().get('userScore').topScore
          })
          .setFriendData(scoreList)
        this.statue = 1
      }
    })
  },

  // 展示动画
  animationLooper() {
    new DataBus().get('scoreBoard').draw()
    this.timer = requestAnimationFrame(() => this.animationLooper())    
  },

  // 停止动画
  stopAnimation() {
    cancelAnimationFrame(this.timer)
  },

  // 停止
  stop() {
    this.statue = 0
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.stopAnimation()
  }
}

OpenDataContext.initial()
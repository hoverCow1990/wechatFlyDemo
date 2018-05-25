import DataBus from './libs/databus.js'
import Pool from './libs/pool.js' 
import preLoader from './libs/preLoader.js'
import BackGround from './sprites/background.js'
import Land from './sprites/land.js'
import DownPencil from './sprites/downPencil.js'
import UpPencil from './sprites/upPencil.js'
import Bird from './sprites/bird.js'
import Start from './sprites/start.js'
import Score from './sprites/score.js'

let PencilInterval = 130 // 每20帧出现一次笔

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.initial()
  }
  initial() {
    // if (typeof wx.getUpdateManager === 'function') {
    //   const updateManager = wx.getUpdateManager()

    //   updateManager.onCheckForUpdate(function (res) {
    //     // 请求完新版本信息的回调
    //     console.log(res.hasUpdate)
    //     console.log(222)
    //   })

    //   updateManager.onUpdateReady(function () {
    //     // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //     updateManager.applyUpdate()
    //   })

    //   updateManager.onUpdateFailed(function () {
    //     // 新的版本下载失败
    //   })
    // }
    this.playFrames = 0 // 帧数
    this.lastStatue = 0 // 保存上一次游戏状态
    this.statue = 0 // 0 为停止状态 1 为游戏状态
    this.dataBus = new DataBus() // 初始化全局数据

    this.canvas = wx.createCanvas() // 创建canvas
   
    this.dataBus.put({
      canvas: this.canvas, // 全局置入canvas
      ctx: this.canvas.getContext('2d') // 全局置入画板
    }) 

    // 进行资源预加载
    preLoader(() => {
      let socreAudio = wx.createInnerAudioContext()
      let failAudio = wx.createInnerAudioContext()
      
      socreAudio.src = 'https://jym-web-debug-welcome.jinyinmao.com.cn/website/audio/score.mp3'
      failAudio.src = 'https://jym-web-debug-welcome.jinyinmao.com.cn/website/audio/fail.mp3'

      // socreAudio.onload = () => {
      //   console.log('ok')
      // }

      new DataBus()
        .put('background', BackGround) // 全局数据注入背景
        .put('land', Land) // 全局数据注入陆地 
        .put('bird', Bird) // 全局数据注入小鸟
        .put('start', Start) // 全局数据注入开始按钮
        .put('score', Score) // 全局数据注入分数
        .put('socreAudio', socreAudio) // 全局数据注入加分音效
        .put('failAudio', failAudio) // 全局数据注入失败音效
 
      this.buildNewPencil(true) // 创建新的笔   

      this.sprites = new DataBus().getSprites() // 获取所有精灵

      this.render() // 渲染
      this.registEvent() // 注册事件
      
      new DataBus().get('start').draw() // 绘制开始按钮
      new DataBus().get('score').draw() // 绘制分数

      this.landTop = new DataBus().get('land').getLandTop() - new DataBus().get('bird').showY // 地面高度用于检测碰撞

      this.animationLooper() // 执行动画
    })
  }

  // 重置游戏
  resetGame() {
    // 清空之前的铅笔数据
    let upPencil = new DataBus().destory('upPencil', [])
    let downPencil = new DataBus().destory('downPencil', [])

    // 创建新的笔
    this.buildNewPencil(true)

    new Pool().destory('upPencil')
    new Pool().destory('downPencil')

    this.sprites = new DataBus().getSprites() // 获取所有精灵
    
    // 所有精灵重置为开始状态
    this.sprites.forEach(sprite => {
      if (sprite instanceof Array) {
        sprite.forEach(item => item.reset())
      } else {
        sprite.reset()
      }
    })
    
    this.playFrames = 0
  }

  // 创建新的笔 首次创建状态为0
  buildNewPencil(isFirst = false) {
    let dataBus = new DataBus()
    let pencilTop = DownPencil.getRandomTop(this.canvas)
    let upPencil = dataBus.get('upPencil')
    let downPencil = dataBus.get('downPencil')

    if (upPencil) {
      let newUpPencil = new Pool().get('upPencil') || new UpPencil(pencilTop, isFirst)
      let newDownPencil = new Pool().get('downPencil') || new DownPencil(pencilTop, isFirst)

      newUpPencil && newUpPencil.resetX()
      newDownPencil && newDownPencil.resetX()

      newUpPencil.changeStatue(1) // 改为运动状态
      newDownPencil.changeStatue(1) // 改为运动状态

      upPencil.push(newUpPencil)
      downPencil.push(newDownPencil)
    } else {
      dataBus
        .put('upPencil', [new UpPencil(pencilTop, isFirst)]) // 全局数据注入顶部笔
        .put('downPencil', [new DownPencil(pencilTop, isFirst)]) // 全局数据注入低部笔
    }

    this.sprites = new DataBus().getSprites() // 重新获取所有精灵
  }

  // 渲染
  render() {
    // 渲染所有精灵
    this.sprites.forEach(sprite => {
      if (sprite instanceof Array) {
        sprite.forEach(item => item.draw())
      } else {
        sprite.draw()
      }
    })
  }

  // 展示动画
  animationLooper() {
    let isChangState = false
    // 本次切换游戏状态
    if (this.lastStatue !== this.statue) isChangState = true

    this.lastStatue = this.statue // 保存本次游戏状态

    if (this.statue === 0) { // 未开始状态

    } else if (this.statue === 1) { // 游戏状态
      if (isChangState) {
        let dataBus = new DataBus()

        dataBus.get('start').visible = false // 不显示
        dataBus.get('land').changeStatue(1) // 陆地转为运动状态
        dataBus.get('bird').changeStatue(1) // 小鸟转为运动状态
        dataBus.get('upPencil').forEach(item => item.changeStatue(1)) // 铅笔转为运动状态
        dataBus.get('downPencil').forEach(item => item.changeStatue(1)) // 铅笔转为运动状态      
      } 

      // this.playing()
      this.testCollide() // 检测碰撞
    } else if (this.statue === 2) {
      if (isChangState) {
        let dataBus = new DataBus()

        dataBus.get('start').visible = true // 显示
        dataBus.get('land').changeStatue(0) // 陆地转为运动状态
        dataBus.get('bird').changeStatue(0) // 小鸟转为运动状态
        dataBus.get('upPencil').forEach(item => item.changeStatue(0)) // 铅笔转为运动状态
        dataBus.get('downPencil').forEach(item => item.changeStatue(0)) // 铅笔转为运动状态

        this.gameOver()
      }
    }

    this.playing()

    requestAnimationFrame(() => this.animationLooper())
  }

  // 游戏状态
  playing() {
    if (this.statue === 1) {
      this.playFrames++

      // 每关键帧出现一次笔
      if (this.playFrames % PencilInterval === 0) {
        this.buildNewPencil()
      }
    }
    
    this.renderAllSprites() // 渲染所有精灵   
  }

  // 渲染所有运动精灵
  renderAllSprites() {
    this.sprites.forEach(sprite => {
      if (sprite instanceof Array) {
        // 由于上下铅笔的数据利用pool和dataBus循环使用 出界用shift移除所以需要反向循环不然会漏帧 显示反白
        // 参见splites/pencil.js内draw方法
        for (let i = sprite.length; i >= 0; i--) {
          sprite[i] && sprite[i].draw()
        }
      } else {
        sprite && sprite.draw()
      }
    })
  }

  // 碰撞检测
  testCollide() {
    let dateBus = new DataBus()
    let bird = dateBus.get('bird')

    // 掉落至地面或者飞到顶空
    if (bird.y >= this.landTop || bird.y <= 0) {
      this.statue = 2
    }

    let pencils = dateBus.getPencils()
    let isBroke

    for (let i = 0; i < pencils.length; i++) {
      let pencil = pencils[i]

      if (pencil.type === 'up') {
        if (bird.x + bird.showX < pencil.x || bird.x > pencil.x + pencil.showX || bird.y > pencil.y + pencil.showY - 10) {
          isBroke = false
        } else {
          // 撞在笔尖上
          if (bird.y > pencil.headTop) {
            // 小鸟的右上角在三角内
            if (pencil.isInTri({ x: bird.x + bird.showX, y: bird.y})) {
              isBroke = true
              break
            }
            if (pencil.isInTri({ x: bird.x, y: bird.y })) {
              isBroke = true
              break
            }

            isBroke = false
          } else { // 撞在柱子上
            isBroke = true
            break
          }    
        }
      } else {
        if (bird.x + bird.showX < pencil.x || bird.x > pencil.x + pencil.showX || bird.y + bird.showY < pencil.y + 10) {
          isBroke = false
        } else {
          // 撞在笔尖上
          if (bird.y < pencil.headTop) {
            // 小鸟的右上角在三角内
            if (pencil.isInTri({ x: bird.x + bird.showX, y: bird.y + bird.showY })) {
              isBroke = true
              break
            }
            if (pencil.isInTri({ x: bird.x, y: bird.y + bird.showY })) {
              isBroke = true
              break
            }
            isBroke = false
            break
          } else { // 撞在柱子上
            isBroke = true
            break
          }    

          isBroke = true
          break
        }
      }
    }

    // 撞到了
    if (isBroke) {
      this.statue = 2
      console.log('撞到了')
    }
  }
  
  // 游戏结束
  gameOver() {
    let start = new DataBus().get('start')

    // 渲染所有精灵
    this.renderAllSprites()

    // 震动
    wx.vibrateLong()

    // 播放失败音效
    new DataBus().get('failAudio').play()

    // 渲染开始按钮
    start.draw()
    console.log('失败')
  }

  // 注册事件
  registEvent() {
    wx.onTouchStart((e) => {
      if (this.statue === 0 || this.statue === 2) {
        let start = new DataBus().get('start')
        let startInfo = start.getCollideInfo()
        let touch = e.touches[0]

        if (touch.pageX > startInfo.x 
          && touch.pageY > startInfo.y 
          && touch.pageX < startInfo.x + startInfo.width 
          && touch.pageY < startInfo.y + startInfo.height) {
          // start.visible = false
          if (this.statue === 2) {
            this.resetGame() // 重置所有游戏数据
          }
          this.statue = 1
        }
      } else if (this.statue === 1) {
        let bird = new DataBus().get('bird')

        bird.jumpY = bird.y
        bird.changeStatue(2)
      } 
    })
  }
}

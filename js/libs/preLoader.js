import resource from '../config/resource.js'
import dataBus from './databus.js'
// import {Promise} from './unit.js'

/** 
 * 作为静态资源加载器[图片, 音频]
 */
export default function (cb) {
  let loadCount = 0 // 计数器
  let imgList = Object.entries(resource.imgList) // 图片资源
  let resourceData = {
    imgList: {}
  }
  // 循环图片资源
  for (let [key, val] of imgList) {
    let img = wx.createImage()

    img.src = val

    resourceData.imgList[key] = img


    // 加载图片
    img.onload = function () {
      if (++loadCount === imgList.length) {
        console.log('----图片加载完毕----')
        new dataBus().put('resource', resourceData)
        cb()
      }
    }
  }
  // return new Promise((resolve, reject) => {
  //   let loadCount = 0 // 计数器
  //   let imgList = Object.entries(resource.imgList) // 图片资源
  //   let resourceData = {
  //     imgList: {}
  //   }
  //   // 循环图片资源
  //   for (let [key, val] of imgList) {
  //     let img = wx.createImage()

  //     img.src = val

  //     resourceData.imgList[key] = img

  //     // new dataBus().put('resource', resource)

  //     // 加载图片
  //     img.onload = function () {
  //       if (++loadCount === imgList.length - 1) {
  //         console.log('----图片加载完毕----')
  //         new dataBus().put('resource', resourceData)
  //         resolve()
  //       }
  //     }
  //   }
  // })
}
let utils = require('./utils')

// 在 Worker 线程执行上下文会全局暴露一个worker对象
// 直接调用 worker.onMeesage/postMessage 即可
worker.onMessage(function (res) {
 console.log(res.msg)
 worker.postMessage(res)
})
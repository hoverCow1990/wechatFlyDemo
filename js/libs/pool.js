const __ = {
  poolDic: Symbol('poolDic')
}

let instance = null

/**
 * 简易的对象池实现
 * 用于对象的存贮和重复使用
 * 可以有效减少对象创建开销和避免频繁的垃圾回收
 * 提高游戏性能
 */
export default class Pool {
  constructor() {
    if (instance) return instance

    instance = this 

    this[__.poolDic] = {}
  }

  /**
   * 根据对象标识符
   * 获取对应的对象池
   */
  getPoolBySign(name) {
    return this[__.poolDic][name] || ( this[__.poolDic][name] = [] )
  }

  /**
   * 根据传入的对象标识符，查询对象池
   * 对象池为空创建新的类，否则从对象池中取
   */
  getItemByClass(name, className) {
    let pool = this.getPoolBySign(name)
    let result = (pool.length ? pool.shift() : new className()  )

    return result
  }
  
  get(key) {
    let arr = this.getPoolBySign(key)

    return arr.length ? arr.shift() : null
  }

  // 将对象回收到对象池 以供之后使用
  recover(name, instance) {
    this.getPoolBySign(name).push(instance)
  }

  // 清空某个对象池
  destory(key) {
    let arr = this.getPoolBySign(key)
    
    arr = []
  }
}

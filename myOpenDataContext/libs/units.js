module.exports = {
  // 获取用户数据
  getUserData(KVDataList, data) {
    let rank = KVDataList.find(item => item.key === 'rank')
    let isNeedUpdata = true
    let postData = {
      key: 'rank',
      value: JSON.stringify({
        'wxgame': JSON.stringify(data),
        'cost_ms': 36500
      })
    }
    console.log(data.score, this.parseKey(rank, 'wxgame').score)

    if (rank && data.score <= this.parseKey(rank, 'wxgame').score) {
      isNeedUpdata = false
    }
    console.log(isNeedUpdata)
    return {
      postData,
      isNeedUpdata,
      userData: {
        nowScore: data.score,
        topScore: isNeedUpdata ? data.score : this.parseKey(rank, 'wxgame').score
      }
    }
  },

  // 排序用户数据
  sortScoreList(list) {
    let arr = []
    let wxgame

    // 冒泡排序 详见http://www.web-jackiee.com/article/search/71
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list.length - i - 1; j++) {
        list[j] = this.handlerWxgame(list[j])
        list[j + 1] = this.handlerWxgame(list[j + 1])
        if (Number(list[j].score) < Number(list[j + 1].score)) {
          [list[j + 1], list[j]] = [list[j], list[j + 1]]
        }
      }
    }
    return list
  },

  // 解开字符串类型的数据
  parseKey(data, key = 'wxgame') {
    return JSON.parse(JSON.parse(data.value)[key])
  },
  
  // 处理数据的字符串格式数据
  handlerWxgame(data) {
    let rank = data.KVDataList.find(item => item.key === 'rank')
    if (typeof rank.value === 'string') {
      rank.value = this.parseKey(rank)
      data.score = '' + rank.value.score
    }
      
    return data
  },

  // 获取用户本人排名
  getSort(scoreList, userData) {
    return scoreList.findIndex(
      item => userData.nickName === item.nickname && userData.avatarUrl.substr(-5) === item.avatarUrl.substr(-5)
    ) + 1
  } 
}
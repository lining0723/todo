// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// cloud.init({
//   env: 'test-vbrie'
// })

// 云函数入口函数
const db = cloud.database()
exports.main = async (event, context) => {
  let {
    OPENID
  } = cloud.getWXContext()
  var s = await db.collection('timeingTask').where({
    _openid: OPENID ? OPENID : event._openid,
  }).orderBy('execTime', 'desc').get() //获取该用户是否有待执行的推送

  if (s.data.length != 0) { //若不存在待执行推送，就新增一个当日的推送
    let endTime = new Date(event.endTime).getDate()
    let isReturn = false
    for (let i in s.data) {
      if (s.data[i].execTime.getDate() == endTime) {
        isReturn = true
      }
    }
    if (isReturn) return;
  }
  let time = new Date(event.endTime)
  time.setHours(12, 0, 0, 0)
  return await db.collection('timeingTask').add({ //将定时任务存入云函数数据库
    data: {
      todoId: event.todoId,
      execTime: time,
      taskType: "1",
      _openid: OPENID ? OPENID : event._openid,
    }
  })
}
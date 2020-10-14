const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// cloud.init({
//   env: 'test-vbrie'
// })
const db = cloud.database()
exports.main = async (event, context) => {
  let {
    OPENID
  } = cloud.getWXContext()
  if (event.type == 'del') {
    await db.collection('timeingTask').where({
      todoId: event._id
    }).remove()
  } else {
    let time = new Date(event.endTime)
    time.setHours(12, 0, 0, 0)
    const result = await db.collection('timeingTask').where({
      todoId: event._id
    }).get()
    if (result.data.length == 0) {
      let data = {
        endTime: event.endTime,
        todoId: event._id,
        _openid: OPENID
      }
      // await cloud.callFunction({
      //   name: 'saveFormID',
      //   data: data
      // })
      const res = await cloud.callFunction({
        name: 'saveFormID',
        data: data
      })
    } else {
      await db.collection('timeingTask').where({
        todoId: event._id
      }).update({
        data: {
          execTime: time,
        }
      })
    }
  }
}
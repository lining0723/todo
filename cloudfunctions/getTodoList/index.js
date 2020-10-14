const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  let {
    OPENID,
    APPID,
    UNIONID
  } = cloud.getWXContext()
  const result = await db.collection('todos').where({
    _openid: OPENID,
    content: {
      $regex: '.*' + event.name,
      $options: 'i'
    }
  }).orderBy('createTime', 'desc').get()

  return {
    data:result.data
  }
}
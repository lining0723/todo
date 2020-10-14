const cloud = require('wx-server-sdk')
cloud.init({
  env: 'test-vbrie'
})
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('todos').where({
      status: 0
    }).remove()
  } catch(e) {
    console.error(e)
  }
}
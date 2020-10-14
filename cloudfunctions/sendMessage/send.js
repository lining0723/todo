const cloud = require('wx-server-sdk')
const MSGID = 'RScY5UEMogFbX3c5C5w9cvVJ8Qj8vDEmvpOjAV-O4HU'; //要发送的模板消息的模板ID
cloud.init()
const db = cloud.database()
const send = async data => {
  const util = require('util.js')//引入发送方法
  let openid = data._openid //获取用户openid
  let page = 'pages/index/index'; //模板消息的打开页
  let msgData = { //根据需求自定模板消息的数据
    thing5: {
      value: data.content,
    },
    date9: {
      value: util.formatTime(data.endTime, 'Y/M/D'),
    },
    thing8: {
      value: data.lever ? data.lever : 0,
    },
    thing2: {
      value: '您有新的日程提醒,请点击查看',
    },
  };
  await cloud.openapi.subscribeMessage.send({
    touser: openid,
    page: page,
    data: msgData,
    templateId: MSGID,
  })
}
module.exports = {
  send: send,
}
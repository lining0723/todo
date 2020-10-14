const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// cloud.init({
//   env: 'test-vbrie'
// })
const db = cloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
  let {
    OPENID
  } = cloud.getWXContext()
  const execTasks = []; //创建待执行任务栈
  // 1.获取数据库中待执行的定时任务
  let taskRes = await db.collection('timeingTask').aggregate().lookup({
      from: 'todos', //要关联的表student
      localField: 'todoId', //class表中的关联字段
      foreignField: '_id', //student表中关联字段
      as: 'todo' //定义输出数组的别名
    })
    .match({
      _openid: OPENID
    })
    .replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$todo', 0]), '$$ROOT'])
    })
    .end()
  let tasks = taskRes.list;
  // 2.定时任务是否到达触发时间，时间到了便存入任务栈，并将数据库中的记录删除
  let now = new Date();
  try {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].execTime <= now) { //判断是否已经过了任务触发时间
        execTasks.push(tasks[i]); //存入待执行任务栈
        // 定时任务数据库中删除该任务
        await db.collection('timeingTask').doc(tasks[i]._id).remove()
      }
    }
  } catch (e) {
    console.error(e)
  }
  // 3.处理待执行任务
  // for (let i = 0; i < execTasks.length; i++) {
  //   let task = execTasks[i];
  //   if (task.taskType == 1) { //执行发送方法
  //     console.log("send执行了", task.data)
  //     const send = require('send.js')//引入发送方法
  //     try {
  //       await send.send(task)//执行发送方法
  //     } catch (e) {
  //       console.error(e)
  //     }
  //   }
  // }
  if (execTasks.length == 0) return
  let task = execTasks[0];
  const send = require('send.js') //引入发送方法
  try {
    await send.send(task) //执行发送方法
  } catch (e) {
    console.error(e)
  }

}
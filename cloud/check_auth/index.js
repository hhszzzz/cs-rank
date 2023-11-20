// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let vote_id = event.vote_id;
    let activity_id = event.activity_id;

    await db.collection('auth_vote').where({
        vote_id: vote_id,
        activity_id: activity_id,
    }).get({
        success(res) {
            if (res.data.length == 0) {
                return {
                    code: '400' // 获取不到返回错误代码
                }
            }
        }
    })

    return {
        code: '200'
    }
}
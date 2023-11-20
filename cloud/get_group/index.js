// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let user_openid = event.user_openid;

    let data = await db.collection('group').where({
        user_openid: user_openid
    }).field({
        group_name: true
    }).get();

    return {
        data: data,
    }
}
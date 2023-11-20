// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let group_id = event.group_id;

    // 再在组别中查找相关用户
    let data = await db.collection('user_group').where({
        group_id: group_id
    }).orderBy('score','desc').get();

    return {
        data: data,
    }
}
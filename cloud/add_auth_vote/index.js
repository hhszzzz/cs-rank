// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let vote_id = event.vote_id;
    let activity_id = event.activity_id;
    let gap_time = event.gap_time;

    await db.collection('auth_vote').add({
        data: {
            vote_id: vote_id,
            activity_id: activity_id,
            // 过期时间
            gap_time: gap_time
        }
    });

    return {
        code: '200'
    }
}
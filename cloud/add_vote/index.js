// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let title = event.title;
    let reason = event.reason;
    let candidate = event.candidate;
    let score = event.score;
    let start_time = event.start_time;
    let end_time = event.end_time;
    let group_id = event.group_id;
    let user_openid = event.user_openid;
    let create_time = event.create_time;

    return await db.collection('vote_record').add({
        data: {
            title: title,
            reason: reason,
            candidate: candidate,
            score: score,
            start_time: start_time,
            end_time: end_time,
            group_id: group_id,
            user_openid: user_openid,
            create_time: create_time,
            result: "",
        }
    });
}
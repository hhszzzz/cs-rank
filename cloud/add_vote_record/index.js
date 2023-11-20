// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    let vote_id = event.vote_id;
    let user_openid = event.user_openid;
    let choice = event.choice;

    return await db.collection('vote_record_record').add({
        data: {
            vote_id: vote_id,
            user_openid: user_openid,
            choice: choice
        }
    });
}
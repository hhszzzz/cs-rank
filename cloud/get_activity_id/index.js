// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database() //初始化数据库

// 云函数入口函数
exports.main = async (event, context) => {
    let user_openid = event.user_openid;

    return await getCacheActivityId(user_openid);
}

// cnm的微信文档，又说要参数
// async function getActivityId(token, openid) {
//     // let token_url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/activityid/create?access_token=' + token + '&openid=' + openid;

//     let result = await cloud.openapi.updatableMessage.createActivityId({
//         access_token: token,
//         openid: openid,
//     });
//     return result;
// }

async function getActivityId() {
    let result = await cloud.openapi.updatableMessage.createActivityId();
    return result;
}

async function getCacheActivityId(user_openid) {
    let wx_activity_id = 'wx_activity_id'; //数据库集合名称
    // let gap_time = 300000; // 5 分钟
    let result = await db.collection(wx_activity_id).where({
        user_openid: user_openid
    }).get();
    // 添加
    if (!result.data.length) {
        let activityId = await getActivityId();
        result = await db.collection(wx_activity_id).add({
            data: {
                user_openid: user_openid,
                activity_id: activityId.result.activityId,
            }
        });
    }
    return result;
}
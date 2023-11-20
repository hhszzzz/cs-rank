// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    let list = event.name_list;
    let group_name = event.group_name;
    let user_openid = event.user_openid;
    let create_username = event.create_username;
    let create_user_avatarUrl = event.create_user_avatarUrl;

    if (!group_name || group_name == '') {
        return {
            code: '400',
        }
    }


    await db.collection('group').where({
        group_name: group_name,
        user_openid: user_openid
    }).get({
        success(res) {
            if (res.data[0]) {
                return {
                    code: '401',
                }
            }
        }
    });

    // 添加该组别
    id = await db.collection('group').add({
        // data 字段表示需新增的 JSON 数据
        data: {
            group_name: group_name,
            user_openid: user_openid,
            // 添加创建者名字
            create_username: create_username,
            create_user_avatarUrl: create_user_avatarUrl
        },
    })

    // 填加组别成员
    for(let i = 0; i < list.length; i ++) {
        await db.collection('user_group').add({
            data: {
                username: list[i].user,
                group_name: group_name,
                group_id: id._id,
                score: 0,
            },
        })
    }

    return {
        code: '200',
    }
}
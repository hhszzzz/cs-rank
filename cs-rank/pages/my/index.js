// pages/my/index.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickname: "",
        avatarUrl: "",
        has_info: false,
        group_list: [],
        index: 0,
        status: 'show' // show:展示，hide：隐藏
    },

    // 查看投票界面
    view_share(e) {
        wx.showLoading({
          title: '加载中',
        });

        let vote_id = this.data.group_list[e.currentTarget.dataset.index]._id;
        // console.log("vote_id", vote_id);

        setTimeout(() => {
            wx.hideLoading();
            wx.redirectTo({
              url: '/pages/share/index?vote_id=' + vote_id,
            })
        }, 200);
    },

    // 查看个人发布过的投票
    view_history_vote() {
        let that = this;
        if (this.data.status == 'show') {
            // let that = this;
            // console.log("查看发起的投票");
            let user_openid = getApp().globalData.user_openid;

            wx.cloud.database().collection('vote_record').where({
                user_openid: user_openid,
            }).get({
                success: res => {
                    // console.log(res.data);
                    that.setData({
                        group_list: res.data,
                        status: 'hide',
                    });
                    // console.log(that.data.group_list);
                },
                fail: err => {
                    console.log("失败", err);
                }
            });
        } else if (this.data.status == 'hide') {
            that.setData({
                group_list: [],
                status: 'show',
            });
        }
    },

    // 退出登录
    logout() {
        // console.log("logout");
        const app = getApp();
        // 重置全局变量
        app.globalData.user_openid = null;
        app.globalData.userInfo = {
            nickname: null,
            avatarUrl: null,
        };
        // 重置该页面变量
        this.setData({
            nickname: "",
            avatarUrl: "",
            has_info: false,
        });
        // 切换回主页
        // wx.switchTab({
        //     url: '/pages/home/index',
        // })
        wx.showToast({
            title: '已退出登录',
            icon: 'none',
            duration: 1000
        });
    },

    // 登录
    login() {
        let that = this;
        wx.showLoading({
            title: '加载中',
        })

        wx.login({
            success: (res) => {
                // console.log("登录成功", res);

                //调用云函数
                wx.cloud.callFunction({
                    name: 'get_openId',
                    success: res => {
                        // console.log("get_openid", res);
                        //获取用户openid并设置全局变量
                        app.globalData.user_openid = res.result.openid
                        
                        wx.cloud.callFunction({
                            name: 'get_user',
                            data: {
                                openid: res.result.openid
                            },
                            success(res) {
                                wx.hideLoading();
                                // console.log("获取用户成功", res);
                                // 如果该用户存在，就直接登录
                                if (res.result.data.length != 0) {
                                    
                                    let nickname = res.result.data[0].nickName;
                                    let avatarUrl = res.result.data[0].avatarUrl;
                                    that.setData({
                                        nickname,
                                        avatarUrl,
                                        has_info: true,
                                    });
                                    // 设置全局用户信息
                                    getApp().globalData.userInfo.nickname = nickname;
                                    getApp().globalData.userInfo.avatarUrl = avatarUrl;

                                    wx.showToast({
                                        title: '登陆成功',
                                        icon: 'success',
                                        duration: 1000,
                                    });
                                } else {
                                    // 如果没有保存过信息，就转入信息界面
                                    wx.redirectTo({
                                        url: '/pages/initUserInfo/index',
                                    });
                                }
                            },
                            fail(err) {
                                console.log("获取用户失败", err);
                            }
                        })
                    }
                });
            },
            fail(err) {
                console.log("登陆失败", err);
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let that = this;
        // this.setData({
        //     userInfo: app.globalData.userInfo
        // })
        // console.log(options);
        if (options.length != null) {
            // console.log("回传成功");
            this.setData({
                nickname: options.nickname,
                avatarUrl: options.avatarUrl,
                has_info: true,
            });
        } else if (app.globalData.user_openid != null) {
            // console.log(app.globalData.user_openid);
            wx.cloud.callFunction({
                name: "get_user",
                data: {
                    openid: app.globalData.user_openid
                },
                success(res) {
                    // console.log("获取用户成功", res);
                    let nickname = res.result.data[0].nickName;
                    let avatarUrl = res.result.data[0].avatarUrl;
                    that.setData({
                        nickname,
                        avatarUrl,
                        has_info: true,
                    });
                    wx.showToast({
                        title: '登陆成功',
                        icon: 'success',
                        duration: 1000,
                    });
                },
                fail(err) {
                    console.log("获取用户失败", err);
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        app.globalData.userInfo = null;
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})
// pages/initUserInfo/index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: defaultAvatarUrl,
        nickname: "",
    },

    onChooseAvatar(e) {
        const { avatarUrl } = e.detail
        this.setData({
            avatarUrl,
        })
    },

    nameInput(e) {
        this.setData({
            nickname: e.detail.value,
        });
    },

    save() {
        // console.log("save");
        let nickname = this.data.nickname;
        let avatarUrl = this.data.avatarUrl;

        wx.showModal({
            title: '保存信息',
            content: '确认后不可更改',
            success(res) {
                if (res.confirm) {
                    if (nickname == '') {
                        wx.showToast({
                            title: '昵称不能为空',
                            icon: 'error',
                            duration: 1000
                        });
                    } else {
                        // 将数据添加到数据库
                        wx.cloud.database().collection('user').add({
                            data: {
                                openid: getApp().globalData.user_openid,
                                avatarUrl: avatarUrl,
                                nickName: nickname,
                            },
                            success(res) {
                                console.log("用户信息添加成功", res);
                            },
                            fail(err) {
                                console.log("用户信息添加失败", err);
                            }
                        });

                        wx.reLaunch({
                            url: '/pages/my/index?nickname=' + nickname + '&avatarUrl=' + avatarUrl,
                        })
                    }
                } else {
                    // console.log("用户取消保存个人信息");
                    wx.showToast({
                        title: '用户取消保存个人信息',
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
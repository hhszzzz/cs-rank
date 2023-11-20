// pages/edit/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        renlists: [{
            user: "",
        }],
        group_name: "",
    },

    adduser(e) {
        let index = e.target.dataset.id;
        let renlists = this.data.renlists;
        renlists[index].user = e.detail.value.trim();
        this.setData({
            renlists
        })
    },

    // 添加人
    addren() {
        let renlists = this.data.renlists;
        if (renlists[renlists.length - 1].user.trim() !== '') {
            setTimeout(() => {
                let renlists = this.data.renlists;
                renlists.push({
                    user: "",
                })
                this.setData({
                    renlists
                }, 300)
            })
        } else {
            wx.showToast({
                title: '请填写完整再追加',
                icon: 'none',
                duration: 2000
            })
            return;
        }

    },

    addGroup() {
        let group_name = this.data.group_name;
        let name_list = this.data.renlists;
        wx.showModal({
            title: '添加组别',
            content: '确认添加后将不可更改',
            success(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '添加组别中',
                    })

                    wx.cloud.callFunction({
                        name: 'add_group',
                        data: {
                            group_name: group_name,
                            name_list: name_list,
                            user_openid: getApp().globalData.user_openid,
                            create_username: getApp().globalData.userInfo.nickname,
                            create_user_avatarUrl: getApp().globalData.userInfo.avatarUrl
                        },
                        success(res) {
                            // console.log(res);
                            if (res.result.code == '200') {
                                // console.log("添加组别成功", res);
                                wx.hideLoading();
                                wx.showToast({
                                    title: '添加成功',
                                    icon: 'success',
                                    duration: 1000,
                                    mask: true,
                                    success:function () {
                                        setTimeout(function () {
                                            wx.switchTab({
                                                url: '/pages/home/index'
                                            })
                                        }, 2000);
                                    }
                                });
                            } else if (res.result.code == '400') {
                                wx.showToast({
                                    title: '添加失败，组名不能为空',
                                    icon: 'none',
                                    duration: 2000
                                })
                            } else if (res.result.code == '401') {
                                wx.showToast({
                                    title: '添加失败，组名不能重复',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        },
                        fail(err) {
                            console.log("添加组别失败", err);
                            wx.showToast({
                                title: '添加失败，请稍后再试',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                } else if (res.cancel) {
                    
                }
            }
        })
    },

    groupInput() { },

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
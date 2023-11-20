// pages/rank/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchContent: "",
        group_list: [],
        selectedGroupId: null,
        user_list: [],
        index: 0,
        like_icon: "/images/rank/like.png",
        is_flash: true
    },

    // 选择组别的业务
    bindPickerChange(e) {
        let that = this;
        // console.log('picker发送选择改变，值为：', this.data.group_list[e.detail.value]);
        this.setData({
            index: e.detail.value
        })

        wx.showLoading({
            title: '加载中',
        })
        // 查询组别相关的用户
        // 获取组别成功后查询组别内部成员
        let group_name = this.data.group_list[e.detail.value];
        let user_openid = getApp().globalData.user_openid;
        // 先查询
        wx.cloud.database().collection('group').where({
            group_name: group_name,
            user_openid: user_openid,
        }).field({
            _id: true
        }).get({
            success: res => {
                // console.log(res);
                that.setData({
                    selectedGroupId: res.data[0]._id
                });
                wx.cloud.callFunction({
                    name: 'get_ranklist',
                    data: {
                        group_id: res.data[0]._id
                    },
                    success(res) {
                        // console.log("获取排行榜成功", res);
                        // 获取成功后赋值给user_list
                        that.setData({
                            user_list: res.result.data.data
                        });
                        wx.hideLoading();
                    },
                    fail(err) {
                        console.log("获取排行榜失败", err);
                    }
                });
                wx.hideLoading();
            }
        });
    },

    // 发起投票
    vote() {
        wx.redirectTo({
            url: '/pages/vote/index?group_id=' + this.data.selectedGroupId,
        })
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
        // 搜索
        // console.log(getApp().globalData.searchContent);
        // this.setData({
        //     searchContent: getApp().globalData.searchContent,
        // })
        if (this.data.is_flash) {
            let that = this;
            wx.showLoading({
                title: '加载中',
            })

            // 在切换至排行榜时，先查询有关该用户创建的组别
            wx.cloud.callFunction({
                name: 'get_group',
                data: {
                    user_openid: getApp().globalData.user_openid,
                },
                success(res) {
                    if (res.result.data.data.length != 0) {
                        // console.log("获取组别成功", res.result.data.data);
                        let list = [];
                        let res_list = res.result.data.data;
                        for (let i = 0; i < res.result.data.data.length; i++) {
                            list.push(res_list[i].group_name);
                        }
                        that.setData({
                            group_list: list
                        })
                        // console.log("group_list: ", that.data.group_list);

                        // 获取组别成功后查询组别内部成员
                        // getRanklist(that.data.group_list[0], getApp().globalData.user_openid);
                        let group_name = that.data.group_list[0];
                        let user_openid = getApp().globalData.user_openid
                        // 先查询
                        wx.cloud.database().collection('group').where({
                            group_name: group_name,
                            user_openid: user_openid,
                        }).field({
                            _id: true
                        }).get({
                            success: res => {
                                that.setData({
                                    selectedGroupId: res.data[0]._id
                                });
                                // console.log(res.data[0]._id);
                                wx.cloud.callFunction({
                                    name: 'get_ranklist',
                                    data: {
                                        group_id: res.data[0]._id
                                    },
                                    success(res) {
                                        // console.log("获取排行榜成功", res);
                                        // 获取成功后赋值给user_list
                                        that.setData({
                                            user_list: res.result.data.data
                                        });
                                        wx.hideLoading();
                                        that.setData({
                                            is_flash: false
                                        })
                                    },
                                    fail(err) {
                                        console.log("获取排行榜失败", err);
                                    }
                                });
                                wx.hideLoading();
                            }
                        });
                    } else {
                        wx.hideLoading();
                    }
                },
                fail(err) {
                    console.log("获取组别失败", err);
                }
            });
        }

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
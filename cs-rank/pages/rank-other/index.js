// pages/rank-other/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_list: [],
        index: 0,
        like_icon: "/images/rank/like.png",
        group_id: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // console.log(options);
        let that = this;
        wx.showLoading({
            title: '加载中',
        })

        // 获取组别成功后查询组别内部成员
        let group_id = options.group_id;
        this.setData({
            group_id: group_id
        });
        // 先查询
        
        // console.log(res.data);
        wx.cloud.callFunction({
            name: 'get_ranklist',
            data: {
                group_id: group_id
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
    },

    vote() {
        wx.redirectTo({
            url: '/pages/vote/index?group_id=' + this.data.group_id,
        })
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
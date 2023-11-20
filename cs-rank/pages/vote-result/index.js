// pages/vote-result/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        vote_id: "",
        title: "",
        reason: "",
        candidate: "",
        score: 0,
        promoter: "", // 发起者
        promoter_avatar: "",
        group_id: "",
        is_agree: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title: '加载中',
        })

        let that = this;
        const db = wx.cloud.database();
        const _ = db.command;
        // console.log(options);
        this.setData({
            vote_id: options.vote_id,
            title: options.title,
            reason: options.reason,
            candidate: options.candidate,
            score: options.score,
            promoter: options.promoter,
            promoter_avatar: options.promoter_avatar,
            group_id: options.group_id,
        });

        db.collection('vote_record').where({
            _id: that.data.vote_id,
        }).get({
            // 查询是否已经结束
            success(res) {
                // console.log(res.data[0].result);
                let result = res.data[0].result;
                if (res.data[0].result == "") {
                    // console.log("yes");

                    // 查询总票数
                    let total = 0;
                    db.collection('vote_record_record').where({
                        vote_id: that.data.vote_id,
                    }).count({
                        success(res) {
                            // console.log("total", res);
                            total = res.total;
                        }
                    });

                    // 查询同意的票数
                    let agree_cnt = 0;
                    db.collection('vote_record_record').where({
                        vote_id: that.data.vote_id,
                        choice: 'agree'
                    }).count({
                        success(res) {
                            // console.log("agree", res.total);
                            agree_cnt = res.total;

                            // 同意的更多
                            if (agree_cnt * 2 > total) {
                                that.setData({
                                    is_agree: true
                                });

                                console.log("update user_group", that.data.group_id, that.data.candidate);
                                db.collection('user_group').where({
                                    group_id: that.data.group_id,
                                    username: that.data.candidate, 
                                }).update({
                                    data: {
                                        score: _.inc(parseInt(that.data.score))
                                    }
                                });

                                console.log("update vote_record", that.data.vote_id);
                                db.collection('vote_record').where({
                                    _id: that.data.vote_id
                                }).update({
                                    data: {
                                        result: "true"
                                    }
                                });
                                wx.showToast({
                                    title: '投票通过',
                                    icon: 'success',
                                    duration: 2000,
                                });
                            } else {
                                that.setData({
                                    is_agree: false
                                });
                                db.collection('vote_record').where({
                                    _id: that.data.vote_id
                                }).update({
                                    data: {
                                        result: "false"
                                    }
                                });
                                wx.showToast({
                                    title: '投票不通过',
                                    icon: 'error',
                                    duration: 2000,
                                });
                            }

                            wx.hideLoading();
                        }
                    });
                } else if (result == 'true') {
                    that.setData({
                        is_agree: true
                    });
                    wx.showToast({
                        title: '投票通过',
                        icon: 'success',
                        duration: 2000,
                    });
                } else if (result == 'false') {
                    that.setData({
                        is_agree: false
                    });
                    wx.showToast({
                        title: '投票不通过',
                        icon: 'error',
                        duration: 2000,
                    });
                }
            }
        })



        // console.log("total", total, "agree_cnt", agree_cnt);

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
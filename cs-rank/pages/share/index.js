// pages/share/index.js

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
        group_id: "",
        start_time: "",
        end_time: "",
        promoter: "", // 发起者
        promoter_avatar: "",
        is_choose: false,
        choice: "",
        create_time: "",
        activityId: "",
        is_login: false,
        vote_btn_info: '确认',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (!getApp().globalData.user_openid) {
            wx.showModal({
                title: '登陆提示',
                content: '您还未登录，请先登录',
                success(res) {
                    if (res.confirm) {
                        wx.switchTab({
                            url: '/pages/my/index',
                        });
                    } else {
                        wx.showToast({
                            title: '用户取消登录',
                            icon: 'none',
                            duration: 2000,
                        });
                    }
                }
            })
        } else {
            let that = this;
            that.setData({
                is_login: true
            });
            wx.showLoading({
                title: '加载中',
            });

            // 通过进入该页面的链接不同，区分创建者和其他人，并设置链接参数
            // 如果是从分享界面点击进来的（activity_id不为空），就需要验证
            if (options.activity_id) {
                this.setData({
                    vote_id: options.vote_id,
                    activityId: options.activity_id,
                });

                this.check_click(options);
            } else { // 如果是从vote界面过来的（没有携带参数，即创建者），则不需要验证，并增加分享功能
                this.setData({
                    vote_id: options.vote_id
                });

                // 如果是创建者，还可以分享
                // 根据用户openid获取activityId，为分享做准备
                wx.cloud.callFunction({
                    name: "get_activity_id",
                    data: {
                        openid: getApp().globalData.user_openid
                    },
                    success(res) {
                        // console.log("获取activity_id成功", res);
                        that.setData({
                            activityId: res.result.data[0].activity_id
                        });
                        // console.log(that.data.activityId);
                        // updateShareMenu
                        wx.updateShareMenu({
                            withShareTicket: true,
                            isPrivateMessage: true,
                            activityId: that.data.activityId,
                        })
                    },
                    fail(err) {
                        console.log("获取activity_id失败", err);
                    }
                });

                // 直接获取信息
                this.get_voteInfo(options);
            }
        }
    },

    // 验证从哪里点击的，验证成功返回true，错误返回false
    check_click(options) {
        let that = this;
        let opt = wx.getLaunchOptionsSync();
        // 是要转发的携带有shareTicket的才验证
        if (opt.scene == '1044') {
            // 调用验证云函数
            wx.cloud.callFunction({
                name: 'check_auth',
                data: {
                    vote_id: options.vote_id,
                    activity_id: options.activityId,
                },
                success(res) {
                    // 验证通过（really）
                    if (res.result.code == '200') {
                        console.log("验证成功");
                        // 业务处理 todo
                        that.get_voteInfo(options);
                    } else if (res.result.code == '400') {
                        console.log("验证不通过");
                    }
                }
            });
        }
    },

    // 获取投票信息
    get_voteInfo(options) {
        let that = this;
        // 通过验证后，根据链接的vote_id获取投票信息
        wx.cloud.callFunction({
            name: "get_vote",
            data: {
                vote_id: options.vote_id,
            },
            success(res) {
                let record = res.result.data[0];

                // 通过投票记录查询发起人
                wx.cloud.database().collection('user').where({
                    openid: record.user_openid,
                }).get({
                    success(res) {
                        that.setData({
                            promoter: res.data[0].nickName,
                            promoter_avatar: res.data[0].avatarUrl,
                        });
                    },
                    fail(err) {
                        console.log("查询用户失败", err);
                    }
                });

                // 设置数据
                that.setData({
                    title: record.title,
                    reason: record.reason,
                    candidate: record.candidate,
                    score: parseInt(record.score),
                    group_id: record.group_id,
                    start_time: record.start_time,
                    end_time: record.end_time,
                    create_time: record.create_time,
                });

                // console.log(that.data);

                wx.hideLoading();

                // 如果截至时间小于现在的时间，就过期，并删除该投票
                if (new Date(record.end_time) < new Date()) {
                    console.log("过期了");
                    // 删掉auth_vote验证
                    wx.showModal({
                        title: '投票已结束',
                        content: '查看本轮结果',
                        complete: (res) => {
                            if (res.cancel) {
                                wx.switchTab({
                                    url: '/pages/my/index',
                                });
                            }
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: '/pages/vote-result/index?vote_id=' + options.vote_id + '&title=' + record.title + '&reason=' + record.reason + '&candidate=' + record.candidate + '&score=' + record.score + '&promoter=' + that.data.promoter + '&promoter_avatar=' + that.data.promoter_avatar + '&group_id=' + record.group_id,
                                });
                            }
                      }
                    })
                }
            },
            fail(err) {
                console.log("查询投票记录失败", err);
            }
        });
    },

    // 当点击分享时会触发
    onShareAppMessage: function (options) {
        let that = this;

        // console.log("onShareAppMessage", options);
        wx.cloud.database().collection('auth_vote').where({
            vote_id: this.data.vote_id,
        }).get({
            success(res) {
                // console.log("auth_vote数据库查询成功", res);
                // 如果查询不到，就创建
                if (res.data.length == 0) {
                    wx.cloud.callFunction({
                        name: 'add_auth_vote',
                        data: {
                            vote_id: that.data.vote_id,
                            activity_id: that.data.activityId,
                            // 5分钟：300000
                            gap_time: 300000 * 12 * 72 // 72h
                        },
                        success(res) {
                            // console.log("调用add_auth_vote成功", res);
                        },
                        fail(err) {
                            console.log("调用add_auth_vote失败", err);
                        }
                    })
                }
            },
            fail(err) {
                console.log("auth_vote数据库查询失败", err);
            }
        });

        return {
            title: this.data.title,      //'此为转发页面所显示的标题'
            // desc: '江湖救急，还请贵人伸手相助啊!',      //此为转发页面的描述性文字
            path: 'pages/share/index?vote_id=' + this.data.vote_id + '&activity_id=' + this.data.activityId,       //此为转发给微信好友
        };
    },

    // 确认投票信息
    confirm() {
        // console.log("确认");
        // console.log(this.data.choice);
        let that = this;

        let choice = this.data.choice;
        let vote_id = this.data.vote_id;
        let user_openid = getApp().globalData.user_openid;
        wx.cloud.database().collection('vote_record_record').where({
            vote_id: vote_id,
            user_openid: user_openid,
        }).get({
            success(res) {
                // 没有投票
                if (res.data.length == 0) {
                    wx.cloud.callFunction({
                        name: 'add_vote_record',
                        data: {
                            vote_id: vote_id,
                            user_openid: user_openid,
                            choice: choice
                        },
                        success(res) {
                            // console.log("添加个人投票记录成功", res);
                            that.setData({
                                vote_btn_info: '已投票',
                            })
                            wx.showToast({
                                title: '投票成功',
                                icon: 'success',
                                duration: 2000
                            });
                        },
                        fail(err) {
                            console.log("添加个人投票记录失败", err);
                        }
                    })
                } else {
                    that.setData({
                        vote_btn_info: '已投票',
                    })
                    wx.showToast({
                        title: '您已经投过票了',
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
            fail(err) {
                console.log("获取投票记录失败", err);
            }
        });
    },

    // 同意和反对票
    radioChange(e) {
        this.setData({
            is_choose: true,
            choice: e.detail.value,
        });
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
})
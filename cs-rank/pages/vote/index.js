// pages/vote/index.js
var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        dateTime1: null, //开始时间value
        dateTimeArray1: null, //开始时间数组,
        startTime: null,
        endTime: null,
        title: "",
        reason: "",
        candidate_list: [],
        index: 0,
        addScore: 0,
        group_id: "",
        create_time: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // console.log(options);
        this.setData({
            group_id: options.group_id
        });

        this.initDatteTime();
        this.initCandidate(options.group_id, this);
    },

    // 发起投票
    vote() {
        // 检查工作
        if (!this.checkStartAndEndTime()) return;
        if (!this.checkTitle()) return; 
        if (!this.checkReason()) return;
        if (!this.checkAddScore()) return;
        this.checkCandidate();

        let title = this.data.title;
        let reason = this.data.reason;
        let candidate = this.data.candidate_list[this.data.index];
        let score = this.data.addScore;
        let start_time = this.data.startTime;
        let end_time = this.data.endTime;
        let group_id = this.data.group_id;
        let user_openid = getApp().globalData.user_openid;
        let create_time = this.data.create_time;

        // 投票业务
        wx.showModal({
            title: '确认提示',
            content: '发起后不可修改，确定发起吗',
            success (res) {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: "add_vote",
                        data: {
                            title: title,
                            reason: reason,
                            candidate: candidate,
                            score: score,
                            start_time: start_time,
                            end_time: end_time,
                            group_id: group_id,
                            user_openid: user_openid,
                            create_time: create_time,
                        },
                        success(res) {
                            // console.log("vote_record储存成功", res);
                            wx.showLoading({
                                title: '加载中',
                            })

                            setTimeout(() => {
                                wx.redirectTo({
                                    url: '/pages/share/index?vote_id=' + res.result._id,
                                });
                            }, 2000);
                        },
                        fail(err) {
                            console.log("vote_record存储失败", err);
                        }
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
          })
    },

    checkTitle() {
        let title = this.data.title;
        if (!title || title == '') {
            wx.showToast({
                title: '标题不能为空',
                icon: 'error',
                duration: 1000,
            });
            return false;
        }
        return true;
    },

    checkReason() {
        let reason = this.data.reason;
        if (!reason || reason == '') {
            wx.showToast({
                title: '理由不能为空',
                icon: 'error',
                duration: 1000,
            });
            return false;
        }
        return true;
    },

    checkCandidate() {
        console.log("检查候选人", this.data.candidate_list[this.data.index]);
    },

    checkAddScore() {
        let addScore = this.data.addScore;
        if (!addScore || addScore == '') {
            wx.showToast({
                title: '分数不能为空',
                icon: 'error',
                duration: 1000,
            });
            return false;
        } else if (addScore > 10) {
            wx.showToast({
                title: '分数不能超过10分',
                icon: 'error',
                duration: 1000,
            });
            return false;
        }
        return true;
    },

    // 初始化人选列表
    initCandidate(group_id, that) {
        wx.cloud.callFunction({
            name: "get_ranklist",
            data: {
                group_id: group_id
            },
            success(res) {
                // 处理得到后的数据
                let tmp_list = [];
                for (let i = 0; i < res.result.data.data.length; i ++ ) {
                    tmp_list.push(res.result.data.data[i].username);
                }
                // 赋值给candidate_list
                that.setData({
                    candidate_list: tmp_list,
                });
                // console.log(that.data.candidate_list);
            },
            fail(err) {
                console.log(err);
            }
        })
    },

    candidateChange(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })

        // 查询组别相关的用户
    },

    // 初始化时间
    initDatteTime() {
        // 获取完整的年月日 时分秒，以及默认显示的数组
        // var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
        // 精确到分的处理，将数组的秒去掉
        obj.dateTimeArray.pop();
        obj.dateTime.pop();

        let arr = obj.dateTime;
        let dateArr = obj.dateTimeArray;

        // 设置创建时间
        this.setData({
            create_time: dateArr[0][arr[0]] + '-' + dateArr[1][arr[1]] + '-' + dateArr[2][arr[2]] + ' ' + dateArr[3][arr[3]] + ':' + dateArr[4][arr[4]]
        });

        this.setData({
            dateTimeArray1: obj.dateTimeArray,
            dateTime1: obj.dateTime,
            startTime: dateArr[0][arr[0]] + '-' + dateArr[1][arr[1]] + '-' + dateArr[2][arr[2]] + ' ' + dateArr[3][arr[3]] + ':' + dateArr[4][arr[4]],
            // 默认间隔一天
            endTime: dateArr[0][arr[0]] + '-' + dateArr[1][arr[1]] + '-' + dateArr[2][arr[2] + 1] + ' ' + dateArr[3][arr[3]] + ':' + dateArr[4][arr[4]],
        });
    },

    //验证开始时间不能大于结束时间
    checkStartAndEndTime() {
        let startTime1 = new Date(this.data.startTime.replace(/-/g, '/'));
        let endTime1 = new Date(this.data.endTime.replace(/-/g, '/'));
        if (startTime1 >= endTime1) {
            wx.showToast({
                title: '时间设置错误',
                icon: 'error',
                duration: 2000,
            });
            this.setData({
                endTime: this.data.startTime
            })
            return false;
        }
        return true;
    },

    // 某一列的值改变时触发
    changeStartTimeColumn(e) {
        let arr = this.data.dateTime1
        let dateArr = this.data.dateTimeArray1;
        arr[e.detail.column] = e.detail.value;
        this.setData({
            startTime: dateArr[0][arr[0]] + '-' + dateArr[1][arr[1]] + '-' + dateArr[2][arr[2]] + ' ' + dateArr[3][arr[3]] + ':' + dateArr[4][arr[4]]
        });
    },

    changeEndTimeColumn(e) {
        let arr = this.data.dateTime1
        let dateArr = this.data.dateTimeArray1;
        arr[e.detail.column] = e.detail.value;
        this.setData({
            endTime: dateArr[0][arr[0]] + '-' + dateArr[1][arr[1]] + '-' + dateArr[2][arr[2]] + ' ' + dateArr[3][arr[3]] + ':' + dateArr[4][arr[4]]
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    titleInput(e) {
        this.setData({
            title: e.detail.value
        })
    },

    reasonInput(e) {
        this.setData({
            reason: e.detail.value
        })
    },

    scoreInput(e) {
        this.setData({
            addScore: e.detail.value
        })
    },
})
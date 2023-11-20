// index.js
// const app = getApp()

const DBGroup = wx.cloud.database().collection("group");
const app = getApp();

Page({
    data: {
        // 搜索内容
        searchContent: "",
        group_list: [],
        index: 0,
    },

    onLoad() {
        
    },

    // 点击查看某组别
    click_group(e) {
        if (getApp().globalData.user_openid) {
            let group_id = this.data.group_list[e.currentTarget.dataset.index]._id;
            wx.showLoading({
              title: '加载中',
            });
    
            setTimeout(() => {
                wx.hideLoading();
                wx.redirectTo({
                  url: '/pages/rank-other/index?group_id=' + group_id,
                })
            }, 200);
        } else {
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
        }
    },

    // 广播所有组别
    broadcast() {
        let that = this;
        wx.cloud.callFunction({
            name: 'get_all_group',
            success(res) {
                // 赋值于组别列表，用于前端展示
                // console.log(res.result.data);
                that.setData({
                    group_list: res.result.data
                })
            },
            fail(err) {
                console.log("get_all_group请求失败", err);
            }
        });
    },

    // 添加组别
    addGroup() {
        if (getApp().globalData.user_openid) {
            wx.showLoading({
                title: '加载中',
            })
            
            setTimeout(function () {
                wx.hideLoading();
                wx.redirectTo({
                  url: '/pages/edit/index',
                })
            }, 200);
        } else {
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
        }
    },

    // // 测试用例
    // view() {
    //     wx.redirectTo({
    //         url: '/pages/share/index?vote_id=' + "f18e14fa6556cb1405f057d744763783",
    //     })
    // },

    // 搜索内容
    search() {
        wx.showLoading({
            title: '加载中',
        })

        getApp().globalData.searchContent = this.data.searchContent;
        // DBGroup.where({
        //     name: e.detail.value
        // }).get({
            
        // })
        setTimeout(function () {
            wx.hideLoading();
            wx.switchTab({
              url: '/pages/rank/index',
            })
        }, 100)
    },

    // 搜索框的输入
    searchInput(e) {
        this.data.searchContent = e.detail.value;
    },

    onShow: function() {
        this.broadcast();
    }
});

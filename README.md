# CS-Rank

## 一、主要内容

1. 由微信小程序进行云开发的一款出生排行榜

2. 限定每个出生群组内部（可以创建群组），有不同的群组成员

3. 通过出生积分对该群组成员进行排行，做出排行榜
4. 可以通过发起投票来对其他人增加分数
5. 类似于群投票，分享限定某个群，其他人分享不可以被访问

## 二、技术

小程序云开发、云数据库、云函数等等

## 三、亮点

1. 做了类似于**群投票**（包含投票的截至时间等等）的功能（通过activity_id），分享限定群内成员投票
2. 接入微信登陆接口，获取登录信息

---

项目访问（由于没有备案，只能使用体验版，仅限通过创建者允许的内部人员使用）：

<img src="https://picgo-picture-storage.oss-cn-guangzhou.aliyuncs.com/img/202311201538169.jpg" alt="QR code tiyan" style="zoom:50%;" />

开发周期：1周

## 四、项目部署

1. 该小程序完全采用云开发，请先购入云开发服务器（首月免费）

2. 在`app.js`替换`env`为个人的云环境ID

3. 部署数据库：

   <img src="https://picgo-picture-storage.oss-cn-guangzhou.aliyuncs.com/img/202311201543263.png" alt="image-20231120154331232" style="zoom:80%;" />

   仅需创建即可

   所有的数据库需要在**数据权限**中选择**所有用户可读，仅创建者可写**，其中在`user_group`和`vote_record`中，需要自定义规则为

   <img src="https://picgo-picture-storage.oss-cn-guangzhou.aliyuncs.com/img/202311201546260.png" alt="image-20231120154644185" style="zoom:80%;" />

   > 至于索引问题，可以遵循**调试器**中的提示进行创建索引

4. 点击微信开发者工具的**上传**按钮

   ![image-20231120154905188](https://picgo-picture-storage.oss-cn-guangzhou.aliyuncs.com/img/202311201549291.png)

   然后在小程序发布平台中修改为体验版即可，如果你有备案，那么可以直接提交审核

## 五、联系方式

如果有什么疑问与合作，联系QQ邮箱：1641357680@qq.com

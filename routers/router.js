const Router = require('koa-router')
const router = new Router

//拿到user表的操作对象
const user = require('../control/user')

const article = require('../control/article')

const comment = require('../control/comment')

const admin = require('../control/admin')

const upload = require('../util/upload')
    //设计主页

router.get("/", user.keeoLog, article.getList)

router.get(/^\/user\/(?=reg|login)/, async(ctx) => {
    const show = /reg/.test(ctx.path)

    await ctx.render("register", { show })
})


router.post("/user/login", user.login)

//注册路由
router.post("/user/reg", user.reg)

//用户退出
router.get("/user/logout", user.logout)


//文章发表
router.get("/article", user.keeoLog, article.addPage)

//文章添加
router.post("/article", user.keeoLog, article.add)

//文章列表分页
router.get("/page/:id", article.getList)

//文章内容
router.get("/article/:id", user.keeoLog, article.details)

//评论提交
router.post("/comment", user.keeoLog, comment.save)

//后台管理页面
router.get("/admin/:id", user.keeoLog, admin.index)

//头像上传
router.post("/upload", user.keeoLog, upload.single("file"), user.upload)

//获取用户的所有评论
router.get("/user/comments", user.keeoLog, comment.comlist)

//删除评论
router.delete("/comment/:id", user.keeoLog, comment.del)


//获取用户的所有文章
router.get("/user/articles", user.keeoLog, article.artlist)

//删除文章
router.delete("/article/:id", user.keeoLog, article.del)

router.get("*", async ctx => {
    await ctx.render("404", {
        title: "404"
    })
})

module.exports = router
const Router = require('koa-router')
const router = new Router

//拿到user表的操作对象
const user = require('../control/user')

const article = require('../control/article')

const comment = require('../control/comment')

const admin = require('../control/admin')
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

//
router.get("/admin/:id", user.keeoLog, admin.index)

router.get("*", async ctx => {
    await ctx.render("404", {
        title: "404"
    })
})

module.exports = router
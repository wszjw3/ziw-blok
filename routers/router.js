const Router = require('koa-router')
const router = new Router

//拿到user表的操作对象
const user = require('../control/user')

const article = require('../control/article')
    //设计主页

router.get("/", user.keeoLog, async(ctx) => {

    //title 
    console.log("session:" + ctx.session.isNew)
    await ctx.render("index", {

        session: ctx.session,
        title: "首页"
    })
})

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

module.exports = router
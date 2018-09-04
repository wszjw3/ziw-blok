const Router = require('koa-router')
const router = new Router

//拿到user表的操作对象
const user = require('../control/user')

//设计主页

router.get("/", user.keepLog, async(ctx) => {

    //title 
    await ctx.render("index", {

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

module.exports = router
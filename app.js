const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const logger = require('koa-logger')
const router = require('./routers/router')
const body = require('koa-body')
const { join } = require('path')
const session = require('koa-session')
var compress = require('koa-compress')

//生成koa实例
const app = new Koa
app.keys = ['fengyu shige dashuaibi'];
//CONFIG session的配置对象
const CONFIG = {
    key: 'Sid',
    maxAge: 36e5,
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: false,
    /** (boolean) signed or not (default true) */
    rolling: true,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
}

//注册日志模块
app.use(logger())

//压缩
app.use(compress({
    // filter: function (content_type) {
    //     return /text/i.test(content_type)
    // },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))

//配置session
app.use(session(CONFIG, app))

app.use(body())
    //配置静态资源
app.use(static(join(__dirname, "public")))

app.use(views(join(__dirname, "views"), {
    extension: "pug"
}))

//注册路由信息
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
    console.log("项目启动成功 3000")
})

//创建管理员用户，如果已存在则返回
{
    const { db } = require('./Schema/config')
    const UserSchema = require('./Schema/user')
    const User = db.model("users", UserSchema)
    const encrypt = require('./util/encrypt')

    User.find({ username: "admin" })
        .then(data => {
            if (data.length == 0) {
                console.log(data + "没有管理员")
                new User({
                    username: "admin",
                    password: encrypt("admin"),
                    role: 666,
                    articleNum: 0,
                    commentNum: 0
                }).save().then(data => {
                    console.log("管理员用户名：damin   密码 -> admin")
                }).catch(err => {
                    console.log(err)
                    console.log("管理员账号创建失败")
                })

            } else {
                console.log("管理员用户名：damin   密码 -> admin")
            }
        })
}
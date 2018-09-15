const { db } = require('../Schema/config')
const UserSchema = require('../Schema/user')
const encrypt = require('../util/encrypt')

const User = db.model("users", UserSchema)

exports.reg = async(ctx) => {

    console.log("处理用户注册")
    const user = ctx.request.body

    const username = user.username
    const password = user.password

    //去user的数据库 查询当前的username是否存在
    await new Promise((resolve, reject) => {
            User.find({ username }, (err, data) => {
                if (err) return reject(err)

                if (data.length !== 0) {
                    //查询到数据，用户名已经存在
                    return resolve("")
                }

                //可以注册
                const _user = new User({
                    username,
                    password: encrypt(password)
                })
                _user.save((err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })

            })
        })
        .then(async data => {
            if (data) {
                //注册成功
                await ctx.render("isOk", {
                    status: "注册成功"
                })
            } else {
                //用户名已存在
                await ctx.render("isOk", {
                    status: "用户名已存在"
                })
            }
        })
        .catch(async err => {
            await ctx.render("isOk", {
                status: "请重试"
            })
        })
        //

}

exports.login = async(ctx) => {
    const user = ctx.request.body

    const username = user.username
    const password = user.password

    await new Promise((resolve, reject) => {
            User.find({ username }, (err, data) => {
                if (err) return reject(err)

                if (data.length === 0) {
                    return reject("用户名不存在")
                }

                console.log(data[0].password === encrypt(password))
                if (data[0].password === encrypt(password)) {
                    return resolve(data)
                } else {
                    return resolve("")
                }


            })
        })
        .then(async data => {
            if (!data) {
                return ctx.render("isOk", {

                    status: "密码不正确，登录失败"
                })

            }

            ctx.cookies.set("username", username, {
                damain: "localhost",
                path: "/",
                maxAge: 36e5,
                httpOnly: false,
                overwrite: false,
                signed: false

            })

            ctx.cookies.set("uid", data[0]._id, {
                damain: "localhost",
                path: "/",
                maxAge: 36e5,
                httpOnly: false,
                overwrite: false,
                signed: false

            })

            ctx.session = {
                username,
                uid: data[0]._id
            }

            await ctx.render("isOk", {
                status: "登录成功"
            })
        })
        .catch(async err => {
            await ctx.render("isOk", {
                status: err
            })
        })
}

//确定用户状态
exports.keeoLog = async(ctx, next) => {
    if (ctx.session.isNew) {
        console.log(ctx.cookies)
        if (ctx.cookies.get("uid")) {
            ctx.session = {
                username: ctx.cookies.get("username"),
                uid: ctx.cookies.get("uid")
            }
        }
    }

    await next()
}

exports.logout = async ctx => {
    ctx.session = null
    ctx.cookies.set("uid", null, {
        maxAge: 0
    })
    ctx.cookies.set("username", null, {
        maxAge: 0
    })

    //重定向到首页
    ctx.redirect("/")
}
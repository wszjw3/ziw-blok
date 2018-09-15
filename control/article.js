const { db } = require('../Schema/config')
const ArticleSchema = require('../Schema/article')

const Article = db.model("articles", ArticleSchema)

//返回文章发表页面
exports.addPage = async(ctx) => {
    await ctx.render("add-article", {
        title: "文章发表页面",
        session: ctx.session

    })
}

//文章发表，保存到数据库
exports.add = async(ctx) => {

    if (ctx.session.isNew) {
        return ctx.body = {
            msg: "用户未登录",
            status: 0


        }
    }


    //用户登陆
    //接收数据
    const data = ctx.request.body
        //添加作者
    data.author = ctx.session.username
        //保存数据


    await new Promise((resolve, reject) => {
            new Article(data)
                .save((err, data) => {
                    if (err) return reject(err)

                    resolve(data)
                })
        })
        .then(data => {
            ctx.body = {
                msg: "发表成功",
                status: 1

            }
        })
        .catch(err => {
            ctx.body = {
                msg: "发表失败",
                status: 0

            }
        })




}
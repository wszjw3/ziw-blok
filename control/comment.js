const { db } = require('../Schema/config')
const ArticleSchema = require('../Schema/article')
const UserSchema = require('../Schema/user')
const CommentSchema = require('../Schema/comment')

const Article = db.model("articles", ArticleSchema)
const User = db.model("users", UserSchema)
const Comment = db.model("comments", CommentSchema)


exports.save = async(ctx) => {

    let message = {
            status: 0,
            msg: "登录才能发表"
        }
        //验证登录状态
    if (ctx.session.isNew) return ctx.body = message

    const data = ctx.request.body

    data.from = ctx.session.uid

    const _comment = new Comment(data)

    await _comment.save()
        .then(data => {
            message = {
                status: 1,
                msg: "评论成功"
            }

            //更新文章计数器
            Article
                .update({ _id: data.article }, { $inc: { commentNum: 1 } }, (err) => {
                    if (err) console.log(err)
                    console.log("文章计数器跟新成功")
                })

            //跟新用户计数器
            User
                .update({ _id: data.from }, { $inc: { commentNum: 1 } }, (err) => {
                    if (err) console.log(err)
                    console.log("用户计数器跟新成功")
                })


        })
        .catch(err => {
            console.log(err)
            message = {
                status: 1,
                msg: err
            }
        })

    ctx.body = message
}
const Article = require('../modles/articles')
const User = require('../modles/users')
const Comment = require('../modles/comments')

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
    data.author = ctx.session.uid
    data.commentNum = 0
        //保存数据


    await new Promise((resolve, reject) => {
            new Article(data)
                .save((err, data) => {
                    if (err) return reject(err)

                    //保存成功
                    //跟新用户文章计数器
                    User.update({ _id: data.author }, { $inc: { articleNum: 1 } }, err => {
                        if (err) return console.log(err)
                    })
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


exports.getList = async(ctx) => {


    //查询每篇文章对应作者头像
    //id ctx.params.id

    let page = ctx.params.id || 1
    page--
    const size = 2
    const maxNum = await Article.estimatedDocumentCount((err, num) => {
        err ? console.log(err) : num
    })


    const data = await Article.find().sort('-created')
        .skip(size * page)
        .limit(size)
        .populate({
            path: "author",
            select: "username _id avatar" //关联属性
        }) //连表查询
        .then(data => data)
        .catch(err => {
            console.log(err)
        })

    console.log(data)
    await ctx.render("index", {
        session: ctx.session,
        title: "首页",
        artList: data,
        maxNum
    })

}

exports.details = async(ctx) => {
    const _id = ctx.params.id

    const article = await Article.findById(_id)
        .populate("author", "username")

    .then(data => data)


    //查找评论
    const comment = await Comment.find({ article: _id })
        .sort("-created")
        .populate("from", "username avatar")
        .then(data => data)
        .catch(err => {
            console.log(err)
        })

    await ctx.render("article", {
        title: article.title,
        session: ctx.session,
        article,
        comment
    })
}


exports.artlist = async ctx => {
    const uid = ctx.session.uid

    const data = await Article.find({ author: uid })


    ctx.body = {
        code: 0,
        count: data.length,
        data

    }

}

exports.del = async ctx => {

    const articleId = ctx.params.id

    let res = {
        state: 1,
        message: "删除成功"
    }
    await Article.findById(articleId)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state: 0,
                message: err
            }
        })

    ctx.body = res



}
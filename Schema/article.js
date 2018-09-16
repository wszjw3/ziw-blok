const { Schema } = require('./config')
const ObjectId = Schema.Types.ObjectId


const ArticleSchema = new Schema({

    title: String,
    content: String,
    author: {
        type: ObjectId,
        ref: "users"
    },
    tips: String,
    commentNum: Number


}, {
    versionKey: false,
    timestamps: {
        createdAt: "created"
    }
})

//设置评论的remove钩子 4

ArticleSchema.post("remove", (doc) => {

    const Comment = require('../modles/comments')
    const User = require('../modles/users')
    const { _id: artId, author: authorId } = doc
    //文章评论所有评论删除
    Comment.find({ article: artId }).then(data => {

        data.forEach(v => v.remove())
    })

    //用户评论0-1

    User.findByIdAndUpdate({ _id: authorId }, { $inc: { commentNum: -1 } }).exec()

})

module.exports = ArticleSchema
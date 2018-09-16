const { Schema } = require('./config')
const ObjectId = Schema.Types.ObjectId


const CommentSchema = new Schema({

    content: String,
    from: {
        type: ObjectId,
        ref: "users"
    },
    article: {
        type: ObjectId,
        ref: "articles"
    }


}, {
    versionKey: false,
    timestamps: {
        createdAt: "created"
    }
})

//设置评论的remove钩子 4

CommentSchema.post("remove", (doc) => {

    const Article = require('../modles/articles')
    const User = require('../modles/users')
    const { from, article } = doc
    //文章评论-1
    Article.updateOne({ _id: article }, { $inc: { commentNum: -1 } }).exec()

    //用户评论0-1

    User.updateOne({ _id: from }, { $inc: { commentNum: -1 } }).exec()

})

module.exports = CommentSchema
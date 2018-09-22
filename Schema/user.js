const { Schema } = require('./config')

const UserSchema = new Schema({

    username: String,
    password: String,
    role: {
        type: String,
        default: "1"
    },
    avatar: {
        type: String,
        default: "/avatar/default.jpg"
    },
    articleNum: Number,
    commentNum: Number

}, { versionKey: false })

UserSchema.post("remove", (doc) => {

    const Comment = require('../modles/comments')
    const Article = require('../modles/articles')
    const { _id: uid } = doc

    //删除用户所有文章
    Article.find({ author: uid }).then(data => {

        data.forEach(v => v.remove())
    })

    //删除所有评论
    Comment.find({ from: uid }).then(data => {

        data.forEach(v => v.remove())
    })


})


module.exports = UserSchema
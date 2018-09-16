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

module.exports = ArticleSchema
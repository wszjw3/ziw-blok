const { db } = require('../Schema/config')
const ArticleSchema = require('../Schema/article')

const Article = db.model("articles", ArticleSchema)

exports.addPage = async(ctx) => {
    await ctx.render("add-article", {
        title: "文章发表页面",
        session: ctx.session

    })
}
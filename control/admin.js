const Article = require('../modles/articles')
const User = require('../modles/users')
const Comment = require('../modles/comments')

const fs = require('fs')
const { join } = require('path')

exports.index = async(ctx) => {

    if (ctx.session.isNew) {
        ctx.status = 404
        return await ctx.render("404", {
            title: "404"
        })
    }

    const id = ctx.params.id

    const arr = fs.readdirSync(join(__dirname, "../views/admin"))


    let flag = false

    arr.forEach(v => {
        const name = v.replace(/^(admin\-)|(\.pug)$/g, "")

        if (name === id) {
            flag = true
        }
    })


    if (flag) {
        await ctx.render("./admin/admin-" + id, {

            role: ctx.session.role
        })

    } else {
        ctx.status = 404
        await ctx.render("404", {
            title: "404"
        })
    }
}
//链接数据库，到处db Schema

const mongoose = require('mongoose')
const db = mongoose.createConnection("mongodb://localhost:27017/blogproject", { useNewUrlParser: true })

//用原生es6promise 

mongoose.Promise = global.Promise

const Schema = mongoose.Schema

db.on("err", () => {
    console.log("连接数据库失败")
})

db.on("open", () => {
    console.log("blogproject 数据库连接成功")
})




module.exports = {
    db,
    Schema
}
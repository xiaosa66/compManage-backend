var mysql = require('mysql');
var config = require('../config/default.js')

var pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE
});

let query = function (sql, values) {

  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {

          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })

}


let users =
  `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     pass VARCHAR(100) NOT NULL,
     avator VARCHAR(100) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let posts =
  `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     title TEXT(0) NOT NULL,
     content TEXT(0) NOT NULL,
     md TEXT(0) NOT NULL,
     uid VARCHAR(40) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     comments VARCHAR(200) NOT NULL DEFAULT '0',
     pv VARCHAR(40) NOT NULL DEFAULT '0',
     avator VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let comment =
  `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     content TEXT(0) NOT NULL,
     moment VARCHAR(40) NOT NULL,
     postid VARCHAR(40) NOT NULL,
     avator VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let createTable = function (sql) {
  return query(sql, [])
}

// 建表
createTable(users)
createTable(posts)
createTable(comment)

// 注册用户
let insertData = function (value) {
  let _sql = "insert into users set name=?,pass=?,avator=?,moment=?;"
  return query(_sql, value)
}
// 删除用户
let deleteUserData = function (name) {
  let _sql = `delete from users where name="${name}";`
  return query(_sql)
}
// 查找用户
let findUserData = function (name) {
  let _sql = `select * from users where name="${name}";`
  return query(_sql)
}
// 查询所有用户
let findAllUser = function () {
  let _sql = `select * from users;`
  return query(_sql)
}
// 查询所有用户数量
let findAllUserCount = function () {
  let _sql = `select count(*) from users;`
  return query(_sql)
}
// 发表文章
let insertPost = function (value) {
  let _sql = "insert into posts set name=?,title=?,content=?,md=?,uid=?,moment=?,avator=?;"
  return query(_sql, value)
}
// 发表评论
let insertComment = function (value) {
  let _sql = "insert into comment set name=?,content=?,moment=?,postid=?,avator=?;"
  return query(_sql, value)
}
// 通过名字查找用户
let findDataByName = function (name) {
  let _sql = `select * from users where name="${name}";`
  return query(_sql)
}
// 通过文章的名字查找用户
let findDataByUser = function (name) {
  let _sql = `select * from posts where name="${name}";`
  return query(_sql)
}
// 通过文章id查找
let findDataById = function (id) {
  let _sql = `select * from posts where id="${id}";`
  return query(_sql)
}
// 通过评论id查找
let findCommentById = function (id) {
  let _sql = `select * FROM comment where postid="${id}";`
  return query(_sql)
}

// 查询所有文章
let findAllPost = function () {
  let _sql = ` select * FROM posts;`
  return query(_sql)
}
// 查询所有文章数量
let findAllPostCount = function () {
  let _sql = ` select COUNT(*) FROM posts;`
  return query(_sql)
}
// 查询分页文章
let findPostByPage = function (page) {
  let _sql = ` select * FROM posts limit ${(page - 1) * 10},10;`
  return query(_sql)
}
// 删除文章
let deletePost = function (id) {
  let _sql = `delete from posts where id = ${id}`
  return query(_sql)
}
// 删除评论
let deleteComment = function (id) {
  let _sql = `delete from comment where id=${id}`
  return query(_sql)
}
// 删除所有评论
let deleteAllPostComment = function (id) {
  let _sql = `delete from comment where postid=${id}`
  return query(_sql)
}

module.exports = {
  query,
  createTable,
  insertData,
  deleteUserData,
  findUserData,
  findDataByName,
  insertPost,
  findAllPost,
  findAllPostCount,
  findPostByPage,
  findDataByUser,
  findDataById,
  insertComment,
  findAllUser,
  findAllUserCount,
  findCommentById,
  deletePost,
  deleteComment,
  deleteAllPostComment
}
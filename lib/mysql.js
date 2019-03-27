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


let admin =
  `create table if not exists admin(
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
createTable(admin)
createTable(posts)
createTable(comment)



/********************************      管理员相关    ****************************************/

// 判断管理员是否已经注册
exports.findDataCountByName = (name) => {
  let _sql = `select count(*) as count from admin where name="${name}";`
  return query(_sql)
}
// 通过名字查找管理员
let findDataByName = function (name) {
  let _sql = `select * from admin where name="${name}";`
  return query(_sql)
}

// 通过文章的名字查找管理员
let findDataByAdmin = function (name) {
  let _sql = `select * from posts where name="${name}";`
  return query(_sql)
}

// 注册管理员
let insertData = function (value) {
  let _sql = "insert into admin set name=?,pass=?,avator=?,moment=?;"
  return query(_sql, value)
}

// 删除管理员
let deleteAdminData = function (name) {
  let _sql = `delete from admin where name="${name}";`
  return query(_sql)
}

// 查找管理员
let findAdminData = function (name) {
  let _sql = `select * from admin where name="${name}";`
  return query(_sql)
}

// 查询所有管理员
let findAllAdmin = function () {
  let _sql = `select * from admin;`
  return query(_sql)
}

// 查询所有管理员数量
let findAllAdminCount = function () {
  let _sql = `select count(*) as count from admin;`
  return query(_sql)
}



/********************************      专家相关    ****************************************/



// 新建专家
let insertExpert = function (value) {
  let _sql = "insert into expert set expert_name=?,expert_pass=?,expert_class=?,expert_info=?,province_ID = ?,moment=?;"
  return query(_sql, value)
}

// 通过名字查找专家
let findExpertByName = function (name) {
  let _sql = `select * from expert where name="${name}";`
  return query(_sql)
}

// 通过名字查找专家数量
let findExpertCountByName = (name) => {
  let _sql = `select count(*) as count from expert where expert_name="${name}";`
  return query(_sql)
}

// 返回专家列表
let returnExpertList = () => {
  let _sql = `SELECT * FROM expert;`
  return query(_sql)
}

// 删除专家
let deleteExpert = function (ID) {
  let _sql = `delete from expert where expert_ID="${ID}";`
  return query(_sql)
}


/********************************      学校相关    ****************************************/



// 创建学校
let createSchool = function (value) {
  let _sql = "insert into school set school_name=?, city_ID=?, moment=?;"
  return query(_sql, value)
}
// 创建队伍
let createTeam = function (value) {
  let _sql = "insert into team set team_name=?, school_ID=?, moment=?;"
  return query(_sql, value)
}


// 返回学校列表
let returnSchoolList = () => {
  let _sql = `SELECT school.*, city.name as city_name FROM school,city
  WHERE (school.city_ID = city.ID);`
  return query(_sql)
}



// 查询所有学校数量
let returnSchoolCount = function () {
  let _sql = `select count(*) as count from school;`
  return query(_sql)
}
// 判断学校是否已经注册
let schoolExist = (name) => {
  let _sql = `select count(*) as count from school where school_name="${name}";`
  return query(_sql)
}
// 删除学校
let deleteSchool = function (ID) {
  let _sql = `delete from school where school_ID IN (${ID});`
  return query(_sql)
}

/********************************      队伍相关    ****************************************/


// 查询所有队伍数量
let returnTeamCount = function () {
  let _sql = `select count(*) as count from team;`
  return query(_sql)
}

// 返回队伍列表
let returnTeamList = () => {
  let _sql = `SELECT * FROM team;`
  return query(_sql)
}

/********************************     城市相关    ****************************************/
// 根据城市 ID 返回城市名称
let queryCityName = (ID) => {
  let _sql = `SELECT name FROM city WHERE id = "${ID}";`
  return query(_sql)
}


// 返回省份
let returnProvinceList = () => {
  let _sql = `SELECT * FROM province;`
  return query(_sql)
}
// 根据省份id 返回市列表
let returnCityList = (province_ID) => {
  let _sql = `SELECT * FROM city WHERE province_id = "${province_ID}";`
  return query(_sql)
}



// 判断队伍是否已经注册
let teamExist = (name) => {
  let _sql = `select count(*) as count from team where team_name="${name}";`
  return query(_sql)
}



// 
let findUserData = (name) => {
  let _sql = `select * from expert where expert_name="${name}";`
  return query(_sql)
}

/********************************      新闻(posts)相关    ****************************************/

// 发表文章
let insertPost = function (value) {
  let _sql = "insert into posts set name=?,title=?,content=?,uid=?,moment=?;"
  return query(_sql, value)
}
// 发表评论
let insertComment = function (value) {
  let _sql = "insert into comment set name=?,content=?,moment=?,postid=?,avator=?;"
  return query(_sql, value)
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
  schoolExist,
  queryCityName,
  createSchool,
  insertExpert,
  returnCityList,
  returnSchoolList,
  returnExpertList,
  returnSchoolCount,
  returnTeamList,
  returnProvinceList,
  teamExist,
  createTeam,
  deleteSchool,
  deleteExpert,
  findExpertByName,
  findExpertCountByName,
  deleteAdminData,
  findAdminData,
  findDataByName,
  insertPost,
  findUserData,
  findAllPost,
  returnTeamCount,
  findAllPostCount,
  findPostByPage,
  findDataByAdmin,
  findDataById,
  insertComment,
  findAllAdmin,
  findAllAdminCount,
  findAllAdmin,
  findAllAdminCount,
  findCommentById,
  deletePost,
  deleteComment,
  deleteAllPostComment
}

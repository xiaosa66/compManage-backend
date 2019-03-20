// 教程文件


const Koa=require('koa');
const path=require('path')
const bodyParser = require('koa-bodyparser');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config/default.js');
const views = require('koa-views')
const koaStatic = require('koa-static')
const staticCache = require('koa-static-cache')
const app = new Koa();




// 跨域操作
const cors = require('@koa/cors');

app.use(cors({
  origin: 'http://localhost:8002', // 前端站点的host
  allowedHeaders: 'Origin, x-requested-with, Content-Type, X-Token', //X-Token为自定义的头字段
  credentials: true //设置成true 请求中才会带上cookie信息，否则请求失败
}));



// session存储配置
const sessionMysqlConfig= {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}))


// 配置静态资源加载中间件
app.use(koaStatic(
  path.join(__dirname , './public')
))

// 缓存
app.use(staticCache(path.join(__dirname, './public'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}))
app.use(staticCache(path.join(__dirname, './images'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))
app.use(bodyParser({
  formLimit: '1mb'
}))

app.use(require('./routes/signin.js').routes())
app.use(require('./routes/signup.js').routes())
app.use(require('./routes/posts.js').routes())
app.use(require('./routes/signout.js').routes())
app.use(require('./routes/admin.js').routes())


app.listen(3000)

console.log(`listening on port ${config.port}`)

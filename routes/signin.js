
const router = require('koa-router')();
const userModel = require('../lib/mysql.js')
const md5 = require('md5')
const { checkNotLogin } = require('../middlewares/check.js');


//获取ejs模板
// router.get('/signin', async(ctx, next) => {
//     await checkNotLogin(ctx)
//     await ctx.render('signin', {
//         session: ctx.session,
//     })
// })


//登录接口
router.post('/admin/login', async (ctx, next) => {
    console.log(ctx.request.body)
    let name = ctx.request.body.name;
    let pass = ctx.request.body.password;

    await userModel.findDataByName(name)
        .then(result => {
            let res = result;
            console.log(res);
            if (name === res[0]['name'] && md5(pass) === res[0]['pass']) {
                ctx.set("Content-Type", "application/json")
                let post = { status: 1 };
                ctx.body = JSON.stringify(post);
                ctx.session.user = res[0]['name']
                ctx.session.id = res[0]['id']
                console.log('session', ctx.session)
                console.log('登录成功')
            } else {
                ctx.body = false
                console.log('用户名或密码错误!')
            }
        }).catch(err => {
            console.log(err)
        })
})
module.exports = router
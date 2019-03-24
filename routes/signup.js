const router = require('koa-router')();
const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
const moment = require('moment');
const fs = require('fs')
// 注册页面
router.get('/signup', async (ctx, next) => {
    await checkNotLogin(ctx)
    await ctx.render('signup', {
        session: ctx.session,
    })
})
// post 管理员注册
router.post('/signup', async (ctx, next) => {
    //console.log(ctx.request.body)
    let user = {
        name: ctx.request.body.name,
        pass: ctx.request.body.password,
        repeatpass: ctx.request.body.repeatpass,
        avator: ctx.request.body.avator
    }
    await userModel.findDataByName(user.name)
        .then(async (result) => {
            console.log('findDataByName:', result)
            if (result.length) {
                try {
                    throw Error('用户已经存在')
                } catch (error) {
                    //处理err
                    console.log(error)
                }
                // 用户存在
                ctx.body = {
                    data: 1
                };;

            } else if (user.pass !== user.repeatpass || user.pass === '') {
                ctx.body = {
                    data: 2,
                    message: '两次输入的密码不一样,请确认密码'
                };
            } else {
                // ctx.session.user=ctx.request.body.name   
                let base64Data = user.avator.replace(/^data:image\/\w+;base64,/, "");
                let dataBuffer = new Buffer(base64Data, 'base64');
                let getName = Number(Math.random().toString().substr(3)).toString(36) + Date.now()
                await fs.writeFile('./public/images/' + getName + '.png', dataBuffer, err => {
                    if (err) throw err;
                    console.log('头像上传成功')
                });
                await userModel.insertData([user.name, md5(user.pass), getName, moment().format('YYYY-MM-DD HH:mm:ss')])
                    .then(res => {
                        console.log('注册成功', res)
                        //注册成功
                        ctx.body = {
                            data: 3,
                            message: '注册成功'
                        };
                    })
            }
        })
})
// post 专家注册
router.post('/expSignup', async (ctx, next) => {
    let { expert_name, password, repeatpass, expert_class, expert_info, province_ID } = ctx.request.body
    await userModel.findExpertCountByName(expert_name)
        .then(async (result) => {
            console.log(result)
            if (result[0].count >= 1) {
                // 用户存在
                ctx.body = {
                    code: 500,
                    message: '用户存在'
                };
            } else if (password !== repeatpass || password.trim() === '') {
                ctx.body = {
                    code: 500,
                    message: '两次输入的密码不一致'
                };
            } else {
                await userModel.insertExpert([expert_name, md5(password), expert_class, expert_info, province_ID, moment().format('YYYY-MM-DD HH:mm:ss')])
                    .then(res => {
                        console.log('注册成功', res)
                        //注册成功
                        ctx.body = {
                            code: 200,
                            message: '注册成功'
                        };
                    })
            }
        })
})
// post 创建学校
router.post('/createSchool', async (ctx, next) => {
    let { school_name, city_ID } = ctx.request.body
    await userModel.schoolExist(school_name)
        .then(async (result) => {
            if (result[0].count >= 1) {
                // 用户存在
                ctx.body = {
                    code: 500,
                    message: '已存在学校'
                };
            } else {
                await userModel.createSchool([school_name, city_ID, moment().format('YYYY-MM-DD HH:mm:ss')])
                    .then(res => {
                        console.log('注册成功', res)
                        ctx.body = {
                            code: 200,
                            message: '注册成功'
                        };
                    })
            }
        })
})

router.get('/getProvince', async (ctx, next) => {
    // await checkNotLogin(ctx)
    await userModel.returnProvinceList()
        .then(async (result) => {
            ctx.body = {
                code: 200,
                data: result
            };
        })
})

router.get('/getCityList', async (ctx, next) => {
    // await checkNotLogin(ctx)
    let { province_ID } = ctx.query;
    if (province_ID) {
        await userModel.returnCityList(province_ID)
            .then(async (result) => {
                ctx.body = {
                    code: 200,
                    data: result
                };
            })
    }else {
        ctx.body = {
            code: 500,
            message:'请输入查询参数'
        };
    }
})


module.exports = router
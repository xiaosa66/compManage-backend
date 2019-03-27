const router = require('koa-router')();
const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const {whetherLogin} = require('../middlewares/check.js');
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
    // console.log(ctx.request.body)
    let user = ctx.request.body;
    if (!user) {
        ctx.body = {
            code: -1,
            message: '请输入参数'
        };
    }
    await userModel.findDataByName(user.name)
        .then(async (result) => {

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


/**************************** 专家相关 ****************************/


// post 专家注册
router.post('/expert', async (ctx) => {
    let { expert_name, password, repeatpass, expert_class, expert_info, province_ID } = ctx.request.body;
    if (!expert_name || !password || !repeatpass || !expert_class || !expert_info || !province_ID) {
        ctx.body = {
            code: -1,
            message: '请输入正确的参数'
        };
    }
    await userModel.findExpertCountByName(expert_name)
        .then(async (result) => {

            if (result[0].count >= 1) {
                // 用户存在
                ctx.body = {
                    code: -1,
                    message: '用户存在'
                };
            } else if (password !== repeatpass || password.trim() === '') {
                ctx.body = {
                    code: -1,
                    message: '两次输入的密码不一致'
                };
            } else {
                await userModel.insertExpert([expert_name, md5(password), expert_class, expert_info, province_ID, moment().format('YYYY-MM-DD HH:mm:ss')])
                    .then(res => {
                        console.log('注册成功', res)
                        //注册成功
                        ctx.body = {
                            code: 1,
                            message: '注册成功'
                        };
                    })
            }
        })
})

// 获取专家数量
router.get('/expertCount', async (ctx) => {
    await whetherLogin(ctx);
    await userModel.returnSchoolCount()
        .then(async (result) => {
            ctx.body = {
                code: 1,
                data: result
            };
        })
})

// 获取专家列表
router.get('/expert', async (ctx) => {
    await whetherLogin(ctx);
    await userModel.returnExpertList()
        .then(async (result) => {
            ctx.body = {
                code: 1,
                data: result
            };
        })
})

// 删除专家
router.post('/delExpert', async (ctx, next) => {
    // await checkNotLogin(ctx)
    let delArr = ctx.request.body;
    console.log('ctx.request.body:', ctx.request.body);
    if (!delArr) {
        ctx.body = {
            code: -1,
            message: '请输入正确参数',
        };
        return;
    }
    delArr = delArr.toString();
    console.log('delArr:', delArr);
    await userModel.deleteExpert(delArr)
        .then(async (result) => {
            if (result.affectedRows >= 1) {
                ctx.body = {
                    code: 1,
                };
            } else {
                ctx.body = {
                    code: -1,
                    message: result
                }
            }
        })
})


/**************************** 学校相关 ****************************/


// post 创建学校
router.post('/school', async (ctx, next) => {
    let { school_name, city_ID } = ctx.request.body
    await userModel.schoolExist(school_name)
        .then(async (result) => {
            if (!result) {
                ctx.body = {
                    code: -1,
                    message: '请输入参数'
                };
                return;
            }
            if (result[0].count >= 1) {
                // 用户存在
                ctx.body = {
                    code: -1,
                    message: '已存在学校'
                };
            } else {
                await userModel.createSchool([school_name, city_ID, moment().format('YYYY-MM-DD HH:mm:ss')])
                    .then(res => {
                        console.log('注册成功', res)
                        ctx.body = {
                            code: 1,
                            message: '注册成功'
                        };
                    })
            }
        })
})


// 获取学校数量
router.get('/schoolCount', async (ctx, next) => {
    // await checkNotLogin(ctx)
    await userModel.returnSchoolCount()
        .then(async (result) => {
            ctx.body = {
                code: 1,
                data: result
            };
        })
})

// 获取学校列表
router.get('/school', async (ctx, next) => {
    await whetherLogin(ctx);
    await userModel.returnSchoolList()
        .then(async (result) => {
            ctx.body = {
                code: 1,
                data: result
            };
        })
})
// 删除学校
router.post('/delSchool', async (ctx, next) => {
    // await checkNotLogin(ctx)
    let schoolArr = ctx.request.body;
    console.log('ctx.request.body:', ctx.request.body);
    if (!schoolArr) {
        ctx.body = {
            code: -1,
            message: '请输入正确参数',
        };
        return;
    }
    schoolArr = schoolArr.toString();
    console.log('schoolArr:', schoolArr);
    await userModel.deleteSchool(schoolArr)
        .then(async (result) => {
            if (result.affectedRows >= 1) {
                ctx.body = {
                    code: 1,
                };
            } else {
                ctx.body = {
                    code: -1,
                    message: result
                }
            }

        })
})

/**************************** 队伍相关 ****************************/


// post 创建队伍
router.post('/team', async (ctx, next) => {
    let { team_name, school_ID, expert_ID } = ctx.request.body;
    if (!team_name || !school_ID) {
        ctx.body = {
            code: -1,
            message: '请输入正确参数',
        };
        return;
    }
    await userModel.teamExist(team_name)
        .then(async (result) => {
            if (result[0].count >= 1) {
                ctx.body = {
                    code: -1,
                    message: '已存在队伍'
                };
            } else {
                // if(!expert_ID){

                // }
                await userModel.createTeam([team_name, school_ID, moment().format('YYYY-MM-DD HH:mm:ss')])
                    .then(res => {
                        ctx.body = {
                            code: 1,
                            message: '注册成功'
                        };
                    })
            }
        })
})
// 获取队伍数量
router.get('/teamCount', async (ctx, next) => {
    // await checkNotLogin(ctx)   
    await userModel.returnTeamCount()
        .then(async (result) => {
            ctx.body = {
                code: 1,
                data: result
            };
        })
})
// 获取队伍列表
router.get('/team', async (ctx, next) => {
    // await checkNotLogin(ctx)
    await userModel.returnTeamList()
        .then(async (result) => {
            ctx.body = {
                code: 1,
                data: result
            };
        })
})

/**************************** 省份相关 ****************************/
// 获取省份列表
router.get('/getProvince', async (ctx, next) => {
    // await checkNotLogin(ctx)
    await userModel.returnProvinceList()
        .then(async (result) => {
            ctx.body = {
                code: 1,
                data: result
            };
        })
})
// 根据 province_id 获取 citylist
router.get('/getCityList', async (ctx, next) => {
    // await checkNotLogin(ctx)
    let { province_ID } = ctx.query;
    if (province_ID) {
        await userModel.returnCityList(province_ID)
            .then(async (result) => {
                ctx.body = {
                    code: 1,
                    data: result
                };
            })
    } else {
        ctx.body = {
            code: -1,
            message: '请输入查询参数'
        };
    }
})

/**************************** 新闻相关 ****************************/
// 新建新闻
router.post('/posts', async (ctx) => {
    const { content,name,title } = ctx.request.body;
       // 获得客户端的Cookie
       var Cookies = {};
       ctx.headers.cookie && ctx.headers.cookie.split(';').forEach(function( Cookie ) {
           var parts = Cookie.split('=');
           Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
       });
       console.log('Cookies:',Cookies)
    if (!content) {
        ctx.body = {
            code: -1,
            message: '请输入正确参数',
        };
        return;
    }

                await userModel.insertPost([name,title,content,Cookies.USER_SID, moment().format('YYYY-MM-DD HH:mm:ss')])
                    .then(res => {
                        ctx.body = {
                            code: 1,
                            message: '注册成功'
                        };
                    })
            
        })

// 获取队伍数量
router.get('/postsCount', async (ctx, next) => {
    // await checkNotLogin(ctx)   
    await userModel.returnTeamCount()
        .then(async (result) => {
            ctx.body = {
                code: 1,
                data: result
            };
        })
})
// 获取队伍列表
router.get('/posts', async (ctx, next) => {
    // await checkNotLogin(ctx)
    await userModel.findAllPost()
        .then(async (result) => {
            ctx.body = {
                code: 1,
                data: result
            };
        })
})


module.exports = router
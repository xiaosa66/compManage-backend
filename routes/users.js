
const router = require('koa-router')();
const userModel = require('../lib/mysql.js')
const md5 = require('md5')
const { checkNotLogin } = require('../middlewares/check.js');



//获取用户数量接口
router.get('/user/count', async(ctx, next) => {
    await userModel.findAllUserCount() 
        .then(result => {
            if (result) {
                console.log('findAllUserCount', result);
                result = JSON.stringify(result);
                ctx.set("Content-Type", "application/json")

                ctx.body = {status:1,content:result}
            }else{
                ctx.set("Content-Type", "application/json")

                ctx.body = {status:-1,message:'no-data-found'}
                console.log('错误!未找到数据')
            }
        }).catch(err => {
            console.log(err)
        })
})  
//获取用户列表接口
router.get('/user/info', async(ctx, next) => {
    await userModel.findAllUser() 
        .then(result => {
            if (result) {
                body = {status:1,content:result};
                console.log('body:',body)
                body = JSON.stringify(body);
                ctx.set("Content-Type", "application/json")
                ctx.body = body;
            }else{
                ctx.body = {status:-1,message:'no-data-found'}
                console.log('错误!未找到数据')
            }
        }).catch(err => {
            console.log(err)
        })
})  
//获取管理员列表接口
router.get('/admin/info', async(ctx, next) => {
    await userModel.findAllUser() 
        .then(result => {
            if (result) {
                body = {status:1,content:result};
                console.log('body:',body)
                body = JSON.stringify(body);
                ctx.set("Content-Type", "application/json")
                ctx.body = body;
            }else{
                ctx.body = {status:-1,message:'no-data-found'}
                console.log('错误!未找到数据')
            }
        }).catch(err => {
            console.log(err)
        })
})  
//获取用户数量接口
router.get('/admin/count', async(ctx, next) => {
    await userModel.findAllUserCount() 
        .then(result => {
            if (result) {
                console.log(result);
                result = JSON.stringify(result);
                ctx.set("Content-Type", "application/json")
                ctx.body = {status:1,content:result}
            }else{
                ctx.set("Content-Type", "application/json")

                ctx.body = {status:-1,message:'no-data-found'}
                console.log('错误!未找到数据')
            }
        }).catch(err => {
            console.log(err)
        })
})  

module.exports=router
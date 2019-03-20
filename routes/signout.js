const router = require('koa-router')();

router.get('/admin/signout', async(ctx, next) => {
    ctx.session = null;
    console.log('登出成功')
    ctx.body = true
})

module.exports = router
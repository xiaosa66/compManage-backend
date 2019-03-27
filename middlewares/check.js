
module.exports ={
    // 已经登录了
    checkNotLogin: (ctx) => {
      if (ctx.session && ctx.session.user) {     
        // ctx.redirect('/posts');
        console.log('already logged session=:',ctx.session.user);
        return false;
      }
      return true;
    },

    // 已经登录了
    whetherLogin: (ctx) => {
      if (ctx.session && ctx.session.user) {     
        console.log('already logged session=:',ctx.session);
        return false;
      }else if (!ctx.session || !ctx.session.user) {
        console.log('!!!!-------have not logged , redirect to signin');
        ctx.redirect('/signin');
        return false;
      }
      return true;
    },

    //没有登录
    checkLogin: (ctx) => {
      if (!ctx.session || !ctx.session.user) {     
        ctx.redirect('/signin');
        return false;
      }
      return true;
    }
  }
  
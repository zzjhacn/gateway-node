#! /bin/node

const express = require('express')
const app = express()
const router = express.Router()

router.use(function(req, res, next) {
  //路由，类似于java中的拦截器功能，在请求到达后台之前，先在这里处理。
  //  some logic here ..
  req.query["name"] = "tom";
  console.info('进入路由，添加一个参数name=tom');
  //next的作用是将请求转发，这个必须有，如果没有，请求到这就挂起了。
  next();
});

//get('/login') 截取Get请求方式的url中含有/login的请求
router.get('/login', function(req, res, next) {
  console.log('进入路由，添加一个参数age=28');
  req.query["age"] = "28";
  next(); //请求转发
});

//加载路由，这里要放在下面原始监听/login的上面
app.get('/login', router);
app.get('/login', function(req, res) {
  console.log('打印参数', req.query);
  res.end('ok');
});

//all .对于一个路由，all方法可以添加多个逻辑方法，logic1，logic2，请求按照顺序转发，即logic1完了进入logic2，等价于
router.all('*', logic1, logic2);

function logic1(req, res, next) {
  req.query["logic1"] = "logic1";
  next();
}

function logic2(req, res, next) {
  req.query["logic2"] = "logic2";
  next();
}

// regex
router.get(/^\/login\/result1/, function(req, res) {
  console.log('打印参数result1 ', req.query);
  res.end('ok');
})
router.get(/^\/login\/result2/, function(req, res) {
  console.log('打印参数 result2 ', req.query);
  res.end('ok');
})
app.get('/login/*', router);

//params
//http://127.0.0.1:3000/user/:id方式，router对象的param方法用于路径参数的处理
router.param('id', function(req, res, next, id) {
  console.log('print id1 ' + id);
  next();
})

router.get('/user/:id', function(req, res, next) {
  console.log('print id2 ' + req.params.id);
  next();
});

router.get('/user/:id', function(req, res) {
  console.log('print id3 ' + req.params.id);
  res.end();
});
app.get('/*', router);

//路由以链式的方式依次处理get put post delete 等http请求
router.param('user_id', function(req, res, next, id) {
  // sample user, would actually fetch from DB, etc...
  req.user = {
    id: id,
    name: 'TJ'
  };
  next();
});

router.route('/users/:user_id')
  .all(function(req, res, next) {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
    next();
  })
  .get(function(req, res, next) {
    res.json(req.user);
  })
  .put(function(req, res, next) {
    // just an example of maybe updating the user
    req.user.name = req.params.name;
    // save user ... etc
    res.json(req.user);
  })
  .post(function(req, res, next) {
    next(new Error('not implemented'));
  })
  .delete(function(req, res, next) {
    next(new Error('not implemented'));
  })

app.listen(3000); //指定端口并启动express web服务

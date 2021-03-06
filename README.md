
# iuap 前端开发框架脚手架（React）


> 需要提前安装全局的 Node 环境

默认访问地址：
```
单表查询: http://127.0.0.1:3000/iuap_train_example/query#/
行内编辑: http://127.0.0.1:3000/iuap_train_example/inline#/
弹框编辑: http://127.0.0.1:3000/iuap_train_example/popup#/
多功能树: http://127.0.0.1:3000/iuap_train_example/tree#/
一主一子: http://127.0.0.1:3000/iuap_train_example/one#/
一主多子: http://127.0.0.1:3000/iuap_train_example/many#/
```

```
$ git clone git@github.com:lzp979822781/iuap_train_example.git
$ cd iuap_train_example
$ npm i
$ npm run dev
```


代理服务配置，打开`uba.config.js`：

```
const proxyConfig = [
  // 后台开发服务
  {
    enable: true,//启动开关
    headers: {
      // 这是之前网页的地址，从中可以看到当前请求页面的链接。
      "Referer": "http://0.0.0.0:0000"//后端服务校验的referer地址，和url地址一致
    },
    // context，如果不配置，默认就是代理全部。
    router: [
      '/allowances'//代理到对方服务器的路由
    ],
    url: 'http://0.0.0.0:0000'//修改为自己的后端服务地址
  }
];
```

关于服务配置启动的说明请参考：https://github.com/iuap-design/tinper-uba




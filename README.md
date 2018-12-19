糖果小镇(react)

1. `npm install` 或者 `yarn`
2. `cp config/config.sample.js config/config.js`
3. `npm start` 或者 `yarn start` 启动糖果小镇用户端
   `npm run start-admin` 或者 `yarn start-admin` 启动糖果小镇管理端 
4. `npm run start-candy` 启动糖果小镇PC端
5. `npm run build` 编译静态web文件，web目录为dist


config.js

```
const Config = {
  frontend: {
    host: '0.0.0.0',
    port: 3003
  },
  adminBaseUrl: '/live-not-to-eat-but-eat-to-live',
  backend: 'http://candytown.net'
}

module.exports = Config
```



nginx配置

```
	location / {
        try_files $uri $uri/ /index.html =404;
    }

    location ~ ^/live-not-to-eat-but-eat-to-live {
        rewrite (.*) /admin.html break;
    }

    location ~ ^/(ims|cms) {
        proxy_pass http://backend;
    }
```

打包app
1.下载安装HBuilder（注意不是HBuilderX） 下载地址 http://www.dcloud.io/
2.安装成功后打开HBuilder, 菜单栏点击 文件=>新建=>移动App
3.输入应用名称，模版选择Hello H5+
4.完成后项目管理器就能看到新建的项目，双击manifest.json。 
5.修改基本信息 应用名称:CandyTown  appid: H5EB9E052  版本号随意 页面入口为H5地址（如：http://candytown.io/） 应用描述随意
6.修改logo、启动图（在appSplash文件夹下），去除所有模块权限，减少App体积
7.点击菜单栏 发行=>云打包-打原生安装包
安卓
1.选择使用DCloud公用证书 包名: io.dcloud.H5EB9E052
2.去除勾选广告联盟和换量联盟
3.点击打包，即发送到云端打包，成功后点击下载
ios
1.根据提供的appid 生成证书和私钥
2.输入框中appid:com.net.candy 然后填入证书、密码、私钥 
3.去除勾选广告联盟和换量联盟，点击打包，成功后下载
小牛钱罐子 - 代码
---------------------------------------

###修改npm镜像源
npm config set registry "http://registry.npm.taobao.org/"

###安装
1. 下载安装node  
2. 安装fis3  npm install -g fis3  
3. 安装模块化组件 npm install -g fis3-hook-module  
4. 安装模块化依赖自动加载插件 npm install -g fis3-postpackager-loader

###调试方法
* 在应用程序根目录运行fis release -wd ../root 后，紧接着将目录切换至root外围目录运行www.py python脚本 做服务转发，并配置本地host 127.0.0.1 www.xiaoniuapp.com 在浏览器中打开http://www.xiaoniuapp.com:8081/index.html即可看到效果。

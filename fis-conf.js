

/*
****************fis3-hook-module配置启用模块化****************
{
    mode: 模块化类型(AMD,CDM, CommandJs)
    baseUrl: 基础路径
    path: 配置别名或者路径
}
*/
fis.hook('module', {
    mode: 'commonJs',
    baseUrl: "modules/",
    paths: {
      api: "common/api/",
      jquery: "libs/jquery/jquery-1.11.3.min.js"
    }
});

/*设置模块目录, 打包时自动包裹define*/
fis.match('modules/**.js', {
    isMod: true
});

/*设置打包时自动处理模块化依赖关系*/
fis.match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    })
});

/*基于页面的打包方式-设置零散资源自动打包*/
fis.match('::packager', {
  postpackager: fis.plugin('loader', {
    allInOne: true
  })
});

/*指定文件添加md5戳 去除缓存*/
fis.match('*.{js,css,png,jpg,gif}', {
  useHash: true
});

/*启用fis-spriter-csssprites插件*/
// fis.match('::package',{
//   spriter:fis.plugin('csssprites')
// });

/*fis-optimizer-clean-css进行资源压缩 并对图片进行合并*/
fis.match('*.css',{
  useSprite:true,
  optimizer:fis.plugin('clean-css')
});

/*第三方组件合并处理*/
// fis.match('libs/**.js', {
//   packTo: 'libs/libs.js'
// });
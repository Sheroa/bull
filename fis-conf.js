

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
    baseUrl: "./src/",
    paths: {
	}
});

/*设置模块目录, 打包时自动包裹define*/
fis.match('./src/**.js', {
    isMod: true
});

/*基于页面的打包方式-设置零散资源自动打包*/
fis.match('::packager', {
  postpackager: fis.plugin('loader', {
    allInOne: true
  })
});
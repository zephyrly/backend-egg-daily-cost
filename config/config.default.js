/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = (exports = {})

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1683802962805_7326'

    // add your middleware config here
    config.middleware = []

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    }

    config.jwt = {
        secret: 'okzfans',
    }

    config.security = {
        csrf: {
            enable: false,
            ignoreJSON: true,
        },
        domainWhiteList: ['*'], // 配置白名单
    }

    config.view = {
        mapping: { '.html': 'ejs' }, // 左边写成.html, 自动渲染.html文件
        // 指的是将 view 文件夹下的 .html 后缀的文件，识别为 .ejs
    }

    // 链接数据库
    exports.mysql = {
        client: {
            // host
            host: 'localhost',
            // 端口号
            port: '3306',
            // 用户名
            user: 'root',
            // 密码
            password: 'root',
            // 数据库
            database: 'daily_cost',
        },
        // 是否加载至app
        app: true,
        // 是否加载至agent上，默认关闭
        agent: false,
    }

    return {
        ...config,
        ...userConfig,
    }
}

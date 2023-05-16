/*
 * @Date: 2023-05-15 10:16:11
 * @LastEditors: okzfans
 * @LastEditTime: 2023-05-16 19:06:41
 * @Description: nothing
 * Copyright (c) 2023 by okzfans, All Rights Reserved.
 */
'use strict'

const Controller = require('egg').Controller
const defaultAvatar = 'https://43.139.225.225/doraemon.jpg'

class UserController extends Controller {
    async register() {
        const { ctx } = this
        const { username, password } = ctx.request.body // 获取注册需要的参数
        if (!username || !password) {
            ctx.body = {
                code: 500,
                msg: '账号密码不能为空',
                data: null,
            }
            return
        }

        const userInfo = await ctx.service.user.getUserByName(username) // 获取用户信息

        if (userInfo && userInfo.id) {
            ctx.body = {
                code: 500,
                msg: '该账户名已注册',
                data: null,
            }
            return
        }

        const result = await ctx.service.user.register({
            username,
            password,
            signature: 'The higher I got, the more amazed I was by the view.',
            avatar: defaultAvatar,
        })

        if (result) {
            ctx.body = {
                code: 200,
                msg: '注册成功',
                data: { userInfo, username },
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '注册失败',
                data: null,
            }
        }
    }

    async login() {
        // app 为全局属性，相当于所有方法植入到了app对象中
        const { ctx, app } = this
        const { username, password } = ctx.request.body

        // 查找用户
        const userInfo = await ctx.service.user.getUserByName(username)
        if (!userInfo || !userInfo.id) {
            ctx.body = {
                code: 500,
                msg: '账号不存在',
                data: null,
            }
            return
        }
        if (userInfo && password !== userInfo.password + '') {
            ctx.body = {
                code: 500,
                msg: '账号或者密码输入错误',
                data: null,
            }
            return
        }

        const token = app.jwt.sign(
            {
                id: userInfo.id,
                username: userInfo.username,
                exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // token 有效期为 24 小时
            },
            app.config.jwt.secret
        )

        ctx.body = {
            code: 200,
            message: '登录成功',
            data: {
                token,
            },
        }
    }

    // 验证方法
    async test() {
        const { ctx, app } = this
        // 通过 token 解析，拿到 user_id
        const token = ctx.request.header.authorization // 请求头获取 authorization 属性，值为 token
        // 通过 app.jwt.verify + 加密字符串 解析出 token 的值
        const decode = await app.jwt.verify(token, app.config.jwt.secret)
        // 响应接口
        ctx.body = {
            code: 200,
            message: '获取成功',
            data: {
                ...decode,
            },
        }
    }

    async getUserInfo() {
        const { ctx, app } = this
        const token = ctx.request.header.authorization
        const decode = await app.jwt.verify(token, app.config.jwt.secret)
        const userInfo = await ctx.service.user.getUserByName(decode.username)
        ctx.body = {
            code: 200,
            msg: '请求成功',
            data: {
                id: userInfo.id,
                username: userInfo.username,
                signature: userInfo.signature || '',
                avatar: userInfo.avatar || defaultAvatar,
            },
        }
    }

    async editUserInfo() {
        const { ctx, app } = this
        const { signature = '' , avatar = ''} = ctx.request.body
        try {
            let user_id
            const token = ctx.request.header.authorization
            const decode = await app.jwt.verify(token, app.config.jwt.secret)
            if (!decode) return
            user_id = decode.id
            const userinfo = await ctx.service.user.getUserByName(
                decode.username
            )
            const result = await ctx.service.user.editUserInfo({
                ...userinfo,
                signature,
                avatar
            })
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: {
                    id: user_id,
                    signature,
                    username: userinfo.username,
                    avatar
                },
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

module.exports = UserController

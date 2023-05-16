/*
 * @Date: 2023-05-15 10:27:49
 * @LastEditors: okzfans
 * @LastEditTime: 2023-05-15 18:16:45
 * @Description: nothing
 * Copyright (c) 2023 by okzfans, All Rights Reserved.
 */
// app/service/home.js

const { Service } = require('egg')

class UserController extends Service {
    async getUserByName(username) {
        const { ctx, app } = this
        try {
            const result = await app.mysql.get('user', { username })
            // 通过username获取用户所有信息
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async register(params) {
        const { app } = this
        try {
            const result = await app.mysql.insert('user', params)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async editUserInfo(params) {
        const { ctx, app } = this
        try {
            const result = await app.mysql.update(
                'user',
                {
                    ...params,
                },
                { id: params.id }
            )
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

module.exports = UserController

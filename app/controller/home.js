// app/controller/home.js
// 获取用户信息
'use strict'

const { Controller } = require('egg')

class HomeController extends Controller {
    async index() {
        const { ctx } = this
        await ctx.render('index.html', {
            title: 'the request from okzfans',
        })
    }

    // 获取用户信息
    async user() {
        const { ctx } = this
        const result = await ctx.service.home.user() // 通过 params 获取申明参数
        ctx.body = result
    }

    async addUser() {
        const { ctx } = this
        const { name } = ctx.request.body
        try {
            const result = await ctx.service.home.addUser(name)
            ctx.body = {
                code: 200,
                msg: '添加成功',
                data: null,
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '添加失败',
                data: null,
            }
        }
    }

    async editUser() {
        const { ctx } = this
        const { id, name } = ctx.request.body
        try {
            const result = await ctx.service.home.editUser(id, name)
            ctx.body = {
                code: 200,
                msg: '编辑成功',
                data: null,
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '编辑失败',
                data: null,
            }
        }
    }

    async deleteUser() {
        const { ctx } = this
        const { id } = ctx.request.body
        try {
            const result = ctx.service.home.deleteUser(id)
            ctx.body = {
                code: 200,
                msg: '删除成功',
                data: null,
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }

    async add() {
        const { ctx } = this
        const { title } = ctx.request.body // 通过 params 获取申明参数
        ctx.body = {
            title,
        }
    }
}

module.exports = HomeController

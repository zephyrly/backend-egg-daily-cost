/*
 * @Date: 2023-05-11 19:02:58
 * @LastEditors: okzfans
 * @LastEditTime: 2023-05-17 15:24:44
 * @Description: nothing
 * Copyright (c) 2023 by okzfans, All Rights Reserved.
 */
'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
    const { router, controller, middleware } = app

    router.get('/', controller.home.index)
    router.get('/user', controller.home.user)
    router.post('/add_user', controller.home.addUser)
    router.post('/edit_user', controller.home.editUser)
    router.post('/delete_user', controller.home.deleteUser)
    router.post('/add', controller.home.add)

    // user
    const _jwt = middleware.jwtErr(app.config.jwt.secret)
    router.post('/api/user/register', controller.user.register)
    router.post('/api/user/login', controller.user.login)
    router.post('/api/user/get_userinfo', _jwt, controller.user.getUserInfo) // 获取用户信息
    router.post('/api/user/edit_userinfo', _jwt, controller.user.editUserInfo)
    router.post('/api/upload', controller.upload.upload)

    router.get('/api/user/test', _jwt, controller.user.test)

    // bill
    router.post('/api/bill/add', _jwt, controller.bill.add)
    router.get('/api/bill/list', _jwt, controller.bill.list)
    router.get('/api/bill/detail', _jwt, controller.bill.detail); // 获取详情
    router.post('/api/bill/update', _jwt, controller.bill.update); // 账单更新
    router.post('/api/bill/delete', _jwt, controller.bill.delete); // 账单删除
    router.get('/api/bill/data', _jwt, controller.bill.data); // 获取数据


}

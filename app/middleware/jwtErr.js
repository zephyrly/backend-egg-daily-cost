/*
 * @Date: 2023-05-15 15:10:23
 * @LastEditors: okzfans
 * @LastEditTime: 2023-05-15 17:37:31
 * @Description: for jwt middleware of egg.js 
 * Copyright (c) 2023 by okzfans, All Rights Reserved. 
 */

'use strict'

function removeBearer(token){
    if(token.indexOf('Bearer') >= 0){
        console.log(typeof(token))
        token = token.replace('Bearer ', '')
    }
    return token
}

module.exports = (sercet) => {
    return async function jwtErr(ctx,next){
        let token = ctx.request.header.authorization; // 判断是否存在token
        token = removeBearer(token)
        // console.log('token----------------',token,ctx.request,sercet)
        let decode = ''
        if(token !== 'null' && token){
            try {
                decode = ctx.app.jwt.verify(token, sercet)  // 验证token
                await next()
            } catch (error) {
                console.log('error',error)
                ctx.status = 200
                ctx.body ={
                    msg: 'token已过期,请重新登录',
                    code: 401,
                }
                return
            }
        }else {
            ctx.status = 200
            ctx.body = {
                code: 401,
                msg: 'token 不存在'
            }
            return
        }
    }
}
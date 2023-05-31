/*
 * @Date: 2023-05-16 17:56:17
 * @LastEditors: okzfans
 * @LastEditTime: 2023-05-31 17:55:06
 * @Description: nothing
 * Copyright (c) 2023 by okzfans, All Rights Reserved.
 */

'use strict'

const fs = require('fs')
const moment = require('moment')
const mkdirp = require('mkdirp')
const fse = require('fs-extra')
const path = require('path')
const UPLOAD_DIR = path.resolve(__dirname, 'public')

const Controller = require('egg').Controller

class UploadBigFileController extends Controller {
    async checkfile() {
        const { ctx, app } = this

        const body = ctx.request.body
        const { ext, hash } = body
        const filePath = path.resolve(UPLOAD_DIR, `${hash}.${ext}`)
        let uploaded = false
        let uploadedList = []

        //fs.existsSync  检查文件中是否有值
        if (fse.existsSync(filePath)) {
            uploaded = true
        } else {
            uploadedList = await this.getUploadedList(
                path.resolve(UPLOAD_DIR, hash)
            )
        }
        ctx.body = {
            code: 200,
            msg: '查询成功',
            data: {
                uploaded,
                uploadedList,
            },
        }
    }

    async getUploadedList(dirPath) {
        return fse.existsSync(dirPath)
            ? (await fse.readdir(dirPath)).filter((name) => name[0] !== '.')
            : []
    }

    async uploadfile() {
        const { ctx, app } = this

        const body = ctx.request.body
        const file = ctx.request.files[0]
        const { hash, name, totalBlock } = body
        const chunkPath = path.resolve(UPLOAD_DIR, hash)

        if (!fse.existsSync(chunkPath)) {
            await fse.mkdir(chunkPath)
        }

        let uploadedList = await this.getUploadedList(chunkPath)

        if (uploadedList.length == totalBlock) {
            return (ctx.body = {
                code: -1,
                message: `所有切片已上传`,
            })
        }

        console.log('1231245234', file)

        await fse.move(file.filepath + '', `${chunkPath}/${name}`)

        ctx.body = {
            code: 200,
            message: `切片上传成功`,
            data: null,
        }
    }

    async mergeFile() {
        const { ctx, app } = this
        const body = ctx.request.body
        const { ext, size, hash } = body
        //文件最终路径
        const filePath = path.resolve(UPLOAD_DIR, `${hash}.${ext}`)
        await this._mergeFile(filePath, size, hash)
        ctx.body = {
            code: 200,
            message: '合并成功',
            data: {
                url: `/public/${hash}${ext}`,
            },
        }
    }

    async _mergeFile(filePath, size, hash) {
        const chunkDir = path.resolve(UPLOAD_DIR, hash)
        let chunks = await fse.readdir(chunkDir)
        chunks = chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1])
        chunks = chunks.map((cpath) => path.resolve(chunkDir, cpath))
        await this.mergeChunks(chunks, filePath, size)
    }

    mergeChunks(files, dest, CHUNK_SIZE) {
        const pipeStream = (filePath, writeStream) => {
            return new Promise((resolve, reject) => {
                const readStream = fse.createReadStream(filePath)
                readStream.on('end', () => {
                    fse.unlinkSync(filePath)
                    resolve()
                })
                readStream.pipe(writeStream)
            })
        }

        const pipes = files.map((file, index) => {
            return pipeStream(
                file,
                fse.createWriteStream(dest, {
                    start: index * CHUNK_SIZE,
                    end: (index + 1) * CHUNK_SIZE,
                })
            )
        })
        return Promise.all(pipes)
    }
}

module.exports = UploadBigFileController

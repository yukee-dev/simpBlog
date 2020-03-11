const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 用于处理 post data
const getPostData = req => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
}

const serverHandle = (req, res) => {
    // 1. 设置返回格式
    res.setHeader('Content-type', 'application/json')

    // 2. 获取 path
    const url = req.url // 获取完整的url地址

    // 3. 获取路由
    req.path = url.split('?')[0]
    // 4. 解析 query
    req.query = querystring.parse(url.split('?')[1])

    getPostData(req).then(postData => {
        req.body = postData

        // 处理 blog 路由
        const bolgData = handleBlogRouter(req, res)
        if (bolgData) {
            res.end(
                JSON.stringify(bolgData)
            )
            return
        }
        // 处理 user 路由
        const userData = handleUserRouter(req, res)
        console.log(userData)
        if (userData) {
            res.end(
                JSON.stringify(userData)
            )
            return
        }
        // 未命中路由，返回404
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.write('404 Not Found\n')
        res.end()
    })


}
module.exports = serverHandle


/**
 * 笔记1
 */
/* // 1. 设置请求头
res.setHeader('Content-type', 'application/json')

// 2. 打包数据
const resData = {
    name: 'yukee1',
    site: 'imooc',
    env: process.env.NODE_ENV
}

// 3. 返回数据
res.end(
    JSON.stringify(resData)
) */
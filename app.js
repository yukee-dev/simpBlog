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

    // 5. 解析 cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie.replace(/\s+/g, '') || ''
    cookieStr.split(';').forEach( item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0]
        const value = arr[1]
        req.cookie[key] = value
    })
    console.log('req.cookie is ...', req.cookie)

    getPostData(req).then(postData => {
        req.body = postData

        // 处理 blog 路由
        /* const bolgData = handleBlogRouter(req, res)
        if (bolgData) {
            res.end(
                JSON.stringify(bolgData)
            )
            return
        } */
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        // 处理 user 路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                res.end(
                    JSON.stringify(userData)
                )
            })
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
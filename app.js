const querystring = require('querystring')
const redis = require('./src/db/redis')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// session 数据
// const SESSION_DATA = {}

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

// 获取 cookie 的过期事件
const setCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
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
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const value = arr[1].trim()
        req.cookie[key] = value
    })
    console.log('req.cookie is ...', req.cookie)

    // 6. 解析 session
    // let needSetCookie = false
    // let userId = req.cookie.userId
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = Date.now() + "" + Math.random()
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    let needSetCookie = false
    let userId = req.cookie.userId
    if (!userId) {
        needSetCookie = true
        userId = Date.now() + "" + Math.random()
        // 初始化 redis 中的 session
        redis.set(userId, {})
    }
    // 获取 session
    req.sessionId = userId
    redis.get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 如果请求到的 req.cookie.userId 为 null, 则再次初始化 redis session
            redis.set(req.sessionId, {})
            // 设置 sessio
            req.session = {}
        } else {
            // 设置 session
            req.session = sessionData
        }
        console.log('req.session is ...', req.session)
        
        return getPostData(req)
    }).

    then(postData => {
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
                if (needSetCookie) {
                    // 操作 cookie
                    res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${setCookieExpires()};`)
    
                }
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
                if (needSetCookie) {
                    // 操作 cookie
                    res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${setCookieExpires()};`)
    
                }
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
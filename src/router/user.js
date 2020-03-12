const { login } = require('../controller/conUser')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 获取 cookie 的过期事件
const setCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
}

const handleUserRouter = (req, res) => {
    const method = req.method // GET POST

    // 登录
    if (method === 'GET' && req.path === '/api/user/login') {
        // const {username, password} = req.body
        const {username, password} = req.query
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // 操作 cookie
                res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${setCookieExpires()};`)

                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        })
    }

    // 登陆验证的测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.cookie.username) {
            return Promise.resolve(new SuccessModel())
        }
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}

module.exports = handleUserRouter
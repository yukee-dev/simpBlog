const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/conBlog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 统一的登录验证函数
const loginCheck = req => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登陆')
        )
    }
}

const handleBlogRouter = (req, res) => {
    const method = req.method // GET POST
    const id = parseInt(req.query.id) || '' // 获取 id

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || ''
        let keyword = req.query.keyword || ''
        // const listData = getList(author, keyword)
        // return new SuccessModel(listData)

        if (req.query.isadmin) {
            // 管理员界面
            const loginCheckResult = loginCheck(req)
            // 未登录
            if (loginCheckResult) return loginCheckResult
            // 强制查询自己的博客
            author = req.session.username
        }
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        if (typeof id === 'number') {
            console.log(id)
            const result = getDetail(id)
            return result.then( rows => {
                console.log(rows)
                return new SuccessModel(rows[0])
           })
        }
    }

    // 新建一篇博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) return loginCheckResult
        req.body.author = req.session.username
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) return loginCheckResult
        const result = updateBlog(id, req.body)
        return result.then(val => {
            if (val) return new SuccessModel()
            return new ErrorModel('更新失败')
        })
    }

    // 删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) return loginCheckResult
        const author = req.session.username
        const result = delBlog(id, author)
        return result.then(val => {
            if (val) return new SuccessModel()
            return new ErrorModel('删除失败')
        })
    }
}

module.exports = handleBlogRouter
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/conBlog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const handleBlogRouter = (req, res) => {
    const method = req.method // GET POST
    const id = req.query.id || '' // 获取 id

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // const listData = getList(author, keyword)
        // return new SuccessModel(listData)
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        if (id) {
           const result = getDetail(id)
           return result.then( rows => {
               console.log(rows)
               return new SuccessModel(rows[0])
           })
        }
    }

    // 新建一篇博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const result = updateBlog(id, req.body)
        return result.then(val => {
            if (val) return new SuccessModel()
            return new ErrorModel('更新失败')
        })
    }

    // 删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        const author = req.body.author || ''
        const result = delBlog(id, author)
        return result.then(val => {
            if (val) return new SuccessModel()
            return new ErrorModel('删除失败')
        })
    }
}

module.exports = handleBlogRouter
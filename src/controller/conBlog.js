const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    // 先返 promise
    return exec(sql)
}

const getDetail = id => {
    return {
        id: 2,
        title: '标题B',
        content: '内容B',
        createTime: 1546610491112,
        author: 'lisi'
    }
}

const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象，包含title content 属性
    console.log('newBlog blogData...', blogData)
    return {
        id: 3 // 表示新建博客，插入数据表里面的 id
    }
}

const updateBlog = (id, blogData) => {
    // id 就是要更新博客的 id
    // blogData 是一个博客对象，包含title content 属性
    console.log('update blog...', id, blogData)
    return true
}

const delBlog = id => {
    // id 删除博客的 id
    console.log('delete blog...', id)
    return true
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
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
    const sql = `select * from blogs where id=${id}`
    return exec(sql)
}

const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象，包含title content 属性
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createtime = Date.now()
    
    const sql = `
        insert into blogs (title, content, createtime, author)
        value ('${title}','${content}','${createtime}','${author}');
    `
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    // id 就是要更新博客的 id
    // blogData 是一个博客对象，包含title content 属性

    const title = blogData.title
    const content = blogData.content

    const sql = `
        update blogs set title='${title}',content='${content}' 
        where id='${id}';
    `

    return exec(sql).then(updateData => {
        console.log('updateData is...', updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, author) => {
    // id 删除博客的 id
    const sql = `
        delete from blogs where id='${id}' and author='${author}';
    `
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
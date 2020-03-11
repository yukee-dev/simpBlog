const env = process.env.NODE_ENV // 获取环境参数

// 配置
let MYSQL_CONF

if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'myblogone',
        password: 'testblog',
        port: '3306',
        database: 'my_blog_one'
    }
}

if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'myblogone',
        password: 'testblog',
        port: '3306',
        database: 'my_blog_one'
    }
}

module.exports = {
    MYSQL_CONF
}
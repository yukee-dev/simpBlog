function asyngg() {
    let i = 0
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            i++
            console.log(i)
            console.log(this);
            (function(){console.log(i)}())
            let b = 0
            show()
            resolve()
        }, 1500)
    })
}

asyngg().then(() => {
    console.log('o:'+b)
    console.log(this)
})

function show() {
    console('show:'+b)
}



var aa = new Promise((resolve, reject) => {
    setTimeout(reject, 1000);
})
aa.then(function () {
    console.log('resolve:成功回调函数')
}, function () {
    console.log('reject:失败回调函数')
})
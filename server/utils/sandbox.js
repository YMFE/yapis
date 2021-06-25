const Safeify = require('safeify').default;

module.exports = async function sandboxFn(context, script) {
    // 创建 safeify 实例
    const safeVm = new Safeify({
        timeout: 3000,
        asyncTimeout: 60000
    })

    // 执行动态代码
    const result = await safeVm.run(script, context)

    // 释放资源
    safeVm.destroy()
    return result
}

const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
const path = require('path')
const fs = require('fs')
const backendApp = new Koa()
const frontendApp = new Koa()
const backendRouter = new Router()
const frontendRouter = new Router()
const { createBundleRenderer } = require('vue-server-renderer')

const serverBundle = require(path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json'))
const clientManifest = require(path.resolve(__dirname, '../dist/vue-ssr-client-manifest.json'))
const template = fs.readFileSync(path.resolve(__dirname, '../dist/index.ssr.html'), 'utf-8')

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: template,
  clientManifest: clientManifest
})

// 后端Server
backendApp.use(serve(path.resolve(__dirname, '../dist')))

backendRouter.get('/index', async (ctx, next) => {
  try {
    const html = await new Promise((resolve, reject) => {
      // 这里直接使用 renderToString 的 Promise 模式，返回的 html 字符串没有样式和 __INITIAL_STATE__，原因暂时还没有查到
      // 所以，只能暂时先自己封装一个 Promise，用 renderToString 的 callback 模式
      renderer.renderToString((err, html) => {
        if (err) {
          reject(err)
        } else {
          resolve(html)
        }
      })
    })

    ctx.type = 'html'
    ctx.status = 200
    ctx.body = html
  } catch (err) {
    console.error(err)
    ctx.status = 500
    ctx.body = '服务器内部错误'
  }
  // const stream = renderer.renderToStream(ctx)
  // let html = ''
  //
  // stream.on('data', data => {
  //   html += data.toString()
  //   console.log('渲染中', data.toString(), html)
  // })
  //
  // stream.on('end', () => {
  //   console.log('渲染完成', html) // 渲染完成
  // })
  //
  // stream.on('error', () => {
  //   // handle error...
  // })
  // ctx.body = html
})

backendApp
  .use(backendRouter.routes())
  .use(backendRouter.allowedMethods())

backendApp.listen(8080, () => {
  console.log('服务器端渲染地址： http://localhost:8080')
})

// 前端Server
frontendApp.use(serve(path.resolve(__dirname, '../dist')))

frontendRouter.get('/index', (ctx, next) => {
  const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
  ctx.type = 'html'
  ctx.status = 200
  ctx.body = html
})

frontendApp
  .use(frontendRouter.routes())
  .use(frontendRouter.allowedMethods())

frontendApp.listen(8081, () => {
  console.log('浏览器端渲染地址： http://localhost:8081')
})

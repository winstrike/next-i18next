const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const nextI18NextMiddleware = require('next-i18next/middleware')

const nextI18Next = require('./i18n')

const port = process.env.PORT || 3000
const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler();

(async () => {
  await app.prepare()

  const server = new Koa()
  const router = new Router()

  nextI18NextMiddleware(nextI18Next).forEach((middleware) => {
    server.use(middleware)
  })

  server.use(router.routes())

  router.get('*', ctx => handle(ctx.req, ctx.res))

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line no-console
  })
})()

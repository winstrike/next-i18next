# next-i18next-koa
[![npm version](https://badge.fury.io/js/%40winstrike%2Fnext-i18next-koa.svg)](https://www.npmjs.com/package/@winstrike/next-i18next-koa)

**The easiest way to translate your NextJs apps. With Koa support only. Forked from [`next-i18next`](https://github.com/isaachinman/next-i18next/).**

## What is this?

`next-i18next-koa` is a fork of [`next-i18next`](https://github.com/isaachinman/next-i18next/) with Koa server support only. This fork uses [`koa-i18next-middleware-fixed`](https://github.com/janealter/koa-i18next-middleware-fixed) instead of [`i18next-express-middleware`](https://github.com/i18next/i18next-express-middleware).

## Project setup (server.js)

`nextI18NextMiddleware()` returns an array of middleware. You should use all of them, as in this example:

```js
const Koa = require("koa");
const Router = require("koa-router");
const serve = require("koa-static");
const mount = require("koa-mount");
const nextApp = require("next");
const nextI18NextMiddleware = require("@winstrike/next-i18next-koa/middleware");

const nextI18Next = require("./lib/i18n");

const app = nextApp({
  dev: process.env.NODE_ENV !== "production",
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  // Access to locales for preloading them from client-side i18next
  server.use(mount("/locales", serve("./locales")));

  router.get("*", async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  // Use all of middlewares
  const middlewares = nextI18NextMiddleware(nextI18Next);
  middlewares.forEach((middleware) => {
    server.use(middleware);
  });

  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
```

## Other information

You can find other information about `next-i18next` in the [original readme](https://github.com/isaachinman/next-i18next#readme).

## Notes

- [isaachinman cannot support koa until a 1:1 replacement for `i18next-express-middleware` exists](https://github.com/isaachinman/next-i18next/issues/9).

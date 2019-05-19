/* eslint-env jest */

import i18nextMiddleware from 'koa-i18next-middleware'
import { forceTrailingSlash, lngPathDetector } from '../../src/utils'
import testI18NextConfig from '../test-i18next-config'

import nextI18nextMiddleware from '../../src/middlewares/next-i18next-middleware'
import { localeSubpathOptions } from '../../src/config/default-config'

jest.mock('koa-i18next-middleware', () => ({
  getHandler: jest.fn(() => jest.fn()),
}))

jest.mock('../../src/utils', () => ({
  forceTrailingSlash: jest.fn(),
  lngPathDetector: jest.fn(),
}))

describe('next-18next middleware', () => {
  let nexti18next
  const ctx = {
    request: null,
    response: null,
  }
  let next

  beforeEach(() => {
    nexti18next = {
      config: testI18NextConfig.options,
      i18n: 'i18n',
    }

    ctx.request = {
      url: '/myapp.com/',
    }
    ctx.response = {}
    next = jest.fn()
  })

  afterEach(() => {
    i18nextMiddleware.getHandler.mockClear()

    forceTrailingSlash.mockReset()
    lngPathDetector.mockReset()
  })

  const callAllMiddleware = () => {
    const middlewareFunctions = nextI18nextMiddleware(nexti18next)

    middlewareFunctions.forEach((middleware) => {
      middleware(ctx, next)
    })
  }

  it('sets up i18nextMiddleware handle on setup', () => {
    callAllMiddleware()

    expect(i18nextMiddleware.getHandler)
      .toBeCalledWith('i18n',
        expect.objectContaining({
          ignoreRoutes: expect.arrayContaining(['/_next', '/static']),
        }))
  })

  it(`does not call any next-i18next middleware if localeSubpaths is "${localeSubpathOptions.NONE}"`, () => {
    nexti18next.config.localeSubpaths = localeSubpathOptions.NONE

    callAllMiddleware()

    expect(forceTrailingSlash).not.toBeCalled()
    expect(lngPathDetector).not.toBeCalled()
  })

  describe(`localeSubpaths = "${localeSubpathOptions.FOREIGN}"`, () => {
    beforeEach(() => {
      nexti18next.config.localeSubpaths = localeSubpathOptions.FOREIGN
    })

    it('does not call middleware, if route to ignore', () => {
      ctx.request.url = '/_next/route'

      callAllMiddleware()

      expect(forceTrailingSlash).not.toBeCalled()
      expect(lngPathDetector).not.toBeCalled()

      expect(next).toBeCalled()
    })

    it('calls forceTrailingSlash if root locale route without slash', () => {
      ctx.request.url = '/de'

      callAllMiddleware()

      expect(forceTrailingSlash).toBeCalledWith(ctx.request, ctx.response, 'de')

      expect(next).not.toBeCalled()
    })

    it('does not call forceTrailingSlash if root locale route with slash', () => {
      ctx.request.url = '/de/'

      callAllMiddleware()

      expect(forceTrailingSlash).not.toBeCalled()

      expect(next).toBeCalled()
    })

    it('calls lngPathDetector if not a route to ignore', () => {
      ctx.request.url = '/page/'

      callAllMiddleware()

      expect(lngPathDetector).toBeCalledWith(ctx.request, ctx.response)

      expect(next).toBeCalled()
    })

    it('does not call lngPathDetector if a route to ignore', () => {
      ctx.request.url = '/static/locales/en/common.js'

      callAllMiddleware()

      expect(lngPathDetector).not.toBeCalled()

      expect(next).toBeCalled()
    })
  })
})

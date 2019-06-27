import { send, sendError } from 'micro'
import { UAParser } from 'ua-parser-js'
import parseVersion from 'vparse'
import isBot from 'isbot'
import * as Joi from '@hapi/joi'
import defaultsdeep from 'lodash.defaultsdeep'
import * as platform from 'platform'
import * as useragent from 'useragent'

import validate from './utils/validate'
import errors from './utils/errors'

const defaultData = {
  ua: null,
  browser: {
    name: null,
    version: null,
    major: null,
    version_major: null,
    version_minor: null,
    version_patch: null,
    version_build: null,
  },
  engine: {
    name: null,
    version: null,
  },
  os: {
    name: null,
    version: null,
  },
  device: {
    model: null,
    type: null,
    vendor: null,
  },
  cpu: {
    architecture: null
  },
  crawler: {
    is_crawler: false
  }
}

const schema = Joi.object({
  ua: Joi.string().required(),
})

interface queryData {
  ua: string;
}

export default errors(validate<queryData>((req, res, query) => {
  try {
    const statusCode = 200

    // uaParserJs
    const parser = new UAParser(query.ua);
    const uaParserJs: { [key: string]: any } = defaultsdeep(parser.getResult(), defaultData)

    if (uaParserJs.browser.version) {
      const browserVersion = parseVersion(uaParserJs.browser.version)

      uaParserJs.browser.version_major = browserVersion.major
      uaParserJs.browser.version_minor = browserVersion.minor
      uaParserJs.browser.version_patch = browserVersion.patch
      uaParserJs.browser.version_build = browserVersion.build
    }

    uaParserJs.crawler = {
      is_crawler: isBot(query.ua)
    }

    // platform
    const platformJs = platform.parse(query.ua)

    // useragent
    const useragentData = useragent.parse(query.ua)

    const data = {
      uaParserJs,
      platformJs,
      useragent: useragentData.toJSON()
    }

    send(res, statusCode, data)
  } catch (err) {
    console.log(err)
    sendError(req, res, err)
  }
}, schema))

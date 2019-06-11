import { send, sendError } from 'micro'
import { UAParser } from 'ua-parser-js'
import parseVersion from 'vparse'
import isBot from 'isbot'
import * as Joi from '@hapi/joi'
import defaultsdeep from 'lodash.defaultsdeep'

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
    const parser = new UAParser(query.ua);

    const data: { [key: string]: any } = defaultsdeep(parser.getResult(), defaultData)

    if (data.browser.version) {
      const browserVersion = parseVersion(data.browser.version)

      data.browser.version_major = browserVersion.major
      data.browser.version_minor = browserVersion.minor
      data.browser.version_patch = browserVersion.patch
      data.browser.version_build = browserVersion.build
    }

    data.crawler = {
      is_crawler: isBot(query.ua)
    }

    send(res, statusCode, data)
  } catch (err) {
    console.log(err)
    sendError(req, res, err)
  }
}, schema))

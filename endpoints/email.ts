import { send } from 'micro'
import * as Joi from '@hapi/joi'

const domains = require('disposable-email-domains')

import validate from './utils/validate'
import errors from './utils/errors'

const schema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required()
})

interface queryData {
  email: string;
}

export default errors(validate<queryData>((req, res, query) => {
  const domain = query.email.split('@')[1]

  try {
    const data = {
      email: query.email,
      disposable: domains.findIndex(d => d === domain)
    }

    send(res, 200, data)
  } catch (err) {
    console.log(err)

    err.statusCode = 400
    throw err
  }
}, schema))

import { send, sendError } from 'micro'

const domains = require('disposable-email-domains')

import validate from './utils/validate'

export default validate((req, res, query) => {
  const domain = (query.email as string).split('@')[1]

  try {
    const statusCode = 200
    const data = {
      disposable: domains.findIndex(d => d === domain)
    }

    send(res, statusCode, data)
  } catch (err) {
    console.log(err)
    sendError(req, res, err)
  }
}, ['GET'])

import { IncomingMessage, ServerResponse } from 'http'
import * as url from 'url'
import * as Joi from '@hapi/joi'

type TheFunction<T> = (req: IncomingMessage, res: ServerResponse, query: T) => void

export default <T>(fn: TheFunction<T>, schema: Joi.ObjectSchema) => async (req: IncomingMessage, res: ServerResponse) => {
  const queryParameters = url.parse(req.url, true).query;

  // validate schema
  const result = Joi.validate(queryParameters, schema);

  if (result.error) {
    const err = new Error(result.error.details[0].message) as any
    err.statusCode = 400
    throw err
  }

  const queryData: T = Object.assign(result.value)

  fn(req, res, queryData)
}

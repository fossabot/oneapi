import { IncomingMessage, ServerResponse } from 'http'
import * as url from 'url'
import { send } from 'micro'

type TheFunction = (req: IncomingMessage, res: ServerResponse, query: url.UrlWithParsedQuery['query']) => void

export default (fn: TheFunction, methods: string[]) => async (req: IncomingMessage, res: ServerResponse) => {
  if (methods.includes(req.method)) {
    const queryData = url.parse(req.url, true).query;

    fn(req, res, queryData)
  } else {
    send(res, 404, { message: 'Method Not Allowed' })
  }
}

import { send } from 'micro'

export default fn => async (req, res) => {
  try {
    return await fn(req, res)
  } catch (err) {
    const error = err as Error
    const statusCode: number = err.statusCode || err.status || 500

    send(res, statusCode, {
      error: true,
      statusCode,
      message: error.message
    })
  }
}

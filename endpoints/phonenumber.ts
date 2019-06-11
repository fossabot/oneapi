import { send, sendError } from 'micro'
import * as Joi from '@hapi/joi'
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js/max'

import validate from './utils/validate'
import errors from './utils/errors'

const schema = Joi.object({
  number: Joi.number().integer().required(),
  country: Joi.string().length(2)
})

interface queryData {
  number: string;
  country?: string;
}

export default errors(validate<queryData>((req, res, query) => {
  const number = `+${query.number}`
  const country = query.country as CountryCode

  try {
    const statusCode = 200
    const phoneNumber = parsePhoneNumberFromString(number, country)

    const data = {
      isPossible: phoneNumber.isPossible(),
      isValid: phoneNumber.isValid(),
      country: phoneNumber.country,
      number: phoneNumber.number,
      getType: phoneNumber.getType(),
      nationalNumber: phoneNumber.nationalNumber,
      ext: phoneNumber.ext,
      carrierCode: phoneNumber.carrierCode,
      countryCallingCode: phoneNumber.countryCallingCode,

      format: {
        international: phoneNumber.formatInternational(),
        national: phoneNumber.formatNational(),
        rfc3966: phoneNumber.getURI(),
        e164: phoneNumber.format('E.164'),
        idd: phoneNumber.format('IDD'),
      }
    }

    send(res, statusCode, data)
  } catch (err) {
    console.log(err)
    sendError(req, res, err)
  }
}, schema))

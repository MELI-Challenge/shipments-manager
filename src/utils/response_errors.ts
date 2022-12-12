import { HttpStatusCode } from './httpStatusCodes'

export enum ErrorsResponseCodes {
  ValidateSchemaError = HttpStatusCode.BadRequest,
  GetShipmentError = HttpStatusCode.InternalServerError,
  ShipmentNotFound = HttpStatusCode.NotFound,
  Unknown = HttpStatusCode.InternalServerError
}

type ErrorCodes = 'ValidateSchemaError' | 'GetShipmentError' | 'ShipmentNotFound' | 'Unknown'

export const getErrorStatusCode = (code: ErrorCodes) => {
  return ErrorsResponseCodes[code as keyof typeof ErrorsResponseCodes]
}

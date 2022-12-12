import { ApiError, ApiResponse } from '@src/utils/interfaces'
import { Request, Response, Router } from 'express'
import { MakeMockDBOperations } from '../../database'
import { tryToMapShipment } from '../../input/shipment'
import {
  handleDatabaseOperationError,
  mappingSuccessHandler,
  mappingErrorHandler
} from '../../input/utils/api-responses-handlers'

const getUserShipmentsHandler = async (req: Request, res: Response, databaseOperations: MakeMockDBOperations) => {
  const { shipmentId } = req.params
  return databaseOperations
    .getShipment(shipmentId)
    .thenMapFailure<ApiError>(handleDatabaseOperationError)
    .thenBindAsync<ApiResponse>((foundShipment) => {
      return tryToMapShipment(foundShipment)
        .thenMap<ApiResponse>(mappingSuccessHandler)
        .thenMapFailure(mappingErrorHandler)
    })
    .then((r) =>
      r.either(
        (apiResponse) => {
          return res.status(apiResponse.status).send(apiResponse.payload)
        },
        (e) => {
          return res.status(e.status).send({
            type: e.type,
            code: e.code
          })
        }
      )
    )
}

export const getUserShipmentsRoute = (router: Router, databaseOperations: MakeMockDBOperations): Router => {
  return router.get('/shipments/:shipmentId', (req, res) => getUserShipmentsHandler(req, res, databaseOperations))
}

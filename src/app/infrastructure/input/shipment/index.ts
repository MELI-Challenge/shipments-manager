import { Shipment } from '@src/app/domain/entities/shipment'
import { ResultPromise } from '@src/utils/result'
import { validateSchema, ValidateSchemaError } from '@src/utils/schema'
import { ShipmentModel } from './interfaces'
import { shipmentValidateSchema } from './schemas'

export const tryToMapShipment = (shipmentModel: ShipmentModel): ResultPromise<Shipment, ValidateSchemaError> => {
  return ResultPromise.fromResult(
    validateSchema(shipmentValidateSchema, shipmentModel)
      .mapFailure((e) => e)
      .map<Shipment>((r) => ({
        id: r.id_envio,
        status: r.estado
      }))
  )
}

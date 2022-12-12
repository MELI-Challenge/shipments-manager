import joi from '@hapi/joi'
import { ShipmentModel } from './interfaces'

export const shipmentValidateSchema = joi.object<ShipmentModel>({
  id_envio: joi.number().required(),
  estado: joi.string().required()
})

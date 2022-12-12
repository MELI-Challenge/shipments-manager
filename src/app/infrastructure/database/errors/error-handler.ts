import { DatabaseOperationError } from './interfaces'

export const databaseOperationErrorHandler = {
  onGetShipmentError: (): DatabaseOperationError => {
    console.error('[InfrastructureFailure] GetShipmentError')
    return {
      type: 'InfrastructureFailure',
      code: 'GetShipmentError'
    }
  },
  onShipmentNotFound: (): DatabaseOperationError => {
    console.error('[InfrastructureFailure] ShipmentNotFound')
    return {
      type: 'InfrastructureFailure',
      code: 'ShipmentNotFound'
    }
  }
}

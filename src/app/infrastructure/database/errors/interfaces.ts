type BaseError<TCode extends string> = {
  readonly type: 'InfrastructureFailure'
  readonly code: TCode
  readonly message?: string
}

type GetShipmentError = BaseError<'GetShipmentError'>
type ShipmentNotFound = BaseError<'ShipmentNotFound'>

export type DatabaseOperationError = GetShipmentError | ShipmentNotFound

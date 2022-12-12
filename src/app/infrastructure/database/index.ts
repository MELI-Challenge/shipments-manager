import { Failure, Result, ResultPromise, Success } from '@src/utils/result'
import { get, isEmpty } from 'lodash'
import { ShipmentModel } from '../input/shipment/interfaces'
import { databaseOperationErrorHandler } from './errors/error-handler'
import { DatabaseOperationError } from './errors/interfaces'
import MockUtils from './mocks'

export interface MakeMockDBOperations {
  getShipment: (shipmentId: string) => ResultPromise<ShipmentModel, DatabaseOperationError>
}

export const loadMockDBClient = (): Result<MockUtils, unknown> => {
  const mockUtils = new MockUtils()
  return Success(mockUtils)
}

const handleDatabaseSuccess = <T>(r: any, notFoundHandler: () => DatabaseOperationError) => {
  return isEmpty(r) ? Failure<T, DatabaseOperationError>(notFoundHandler()) : Success<T, DatabaseOperationError>(r)
}

const handleDatabaseError = <T>(
  e: any,
  notFoundHandler: () => DatabaseOperationError,
  errorHandler: () => DatabaseOperationError
) => {
  const status = get(e, 'status')
  const error = status === 404 ? notFoundHandler() : errorHandler()
  return Failure<T, DatabaseOperationError>(error)
}

export const makeMockDBOperations = (mockUtils: MockUtils): MakeMockDBOperations => {
  const getShipment = (shipmentId: string): ResultPromise<ShipmentModel, DatabaseOperationError> => {
    return ResultPromise.fromPromise<ShipmentModel, DatabaseOperationError>(
      Promise.resolve(
        mockUtils
          .getShipment(shipmentId)
          .then((r) => handleDatabaseSuccess<ShipmentModel>(r, databaseOperationErrorHandler.onShipmentNotFound))
          .catch((e) =>
            handleDatabaseError<ShipmentModel>(
              e,
              databaseOperationErrorHandler.onShipmentNotFound,
              databaseOperationErrorHandler.onGetShipmentError
            )
          )
      )
    )
  }

  return {
    getShipment
  }
}

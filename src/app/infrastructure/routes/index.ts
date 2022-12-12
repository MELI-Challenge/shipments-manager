import MockUtils from '@src/app/infrastructure/database/mocks'
import { Router } from 'express'
import { makeMockDBOperations } from '../database'
import { getUserShipmentsRoute } from './shipments'

export const routes = (router: Router, mockClient: MockUtils) => {
  const databaseOperations = makeMockDBOperations(mockClient)
  return [getUserShipmentsRoute(router, databaseOperations)]
}

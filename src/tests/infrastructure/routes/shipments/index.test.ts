import { loadApp } from '@src/app'
import express from 'express'
import supertest from 'supertest'
import { mock } from 'jest-mock-extended'
import MockUtils from '@src/app/infrastructure/database/mocks'
import { ShipmentModel } from '@src/app/infrastructure/input/shipment/interfaces'
import { Shipment } from '@src/app/domain/entities/shipment'
import { cloneDeep, set } from 'lodash'
import { HttpStatusCode } from '@src/utils/httpStatusCodes'

const dummyShipmentModel: ShipmentModel = {
  id_envio: 1000010191,
  estado: 'entregado'
}
const dummyShipmentDomain: Shipment = {
  id: 1000010191,
  status: 'entregado'
}

const setAPIRoute = (shipmentId: string) => `/api/v1/shipments/${shipmentId}`

describe('Client route', () => {
  const app = express()
  const router = express.Router()
  const mockClient = mock<MockUtils>()
  const server = loadApp(app, router, mockClient)

  beforeEach(() => {})

  afterEach(() => {})
  it('Should return payment data and status 200', async () => {
    const apiRoute = setAPIRoute('1')
    mockClient.getShipment.mockImplementation(() => Promise.resolve(dummyShipmentModel))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(dummyShipmentDomain)
      })
  })
  it('Should return an error and 404 if no payment found', async () => {
    const apiRoute = setAPIRoute('1')
    let error = new Error()
    mockClient.getShipment.mockImplementation(() => Promise.resolve({} as any))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(404)
      .then((response) => {
        expect(response.body.code).toBe('ShipmentNotFound')
      })
  })
  it('Should return an error and 500 if error is thrown and no status is set', async () => {
    const apiRoute = setAPIRoute('1')
    let error = new Error()
    mockClient.getShipment.mockImplementation(() => Promise.reject(error))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.InternalServerError)
      .then((response) => {
        expect(response.body.code).toBe('GetShipmentError')
      })
  })

  it('Should return an error and 500 if schema validation fails', async () => {
    const apiRoute = setAPIRoute('1')
    const dummyShipmentBadFormat = cloneDeep(dummyShipmentModel)
    dummyShipmentBadFormat.estado = undefined as any
    mockClient.getShipment.mockImplementation(() => Promise.resolve(dummyShipmentBadFormat))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.BadRequest)
      .then((response) => {
        expect(response.body.code).toBe('ValidateSchemaError')
      })
  })

  it('Should return the error code if not found', async () => {
    const apiRoute = setAPIRoute('1')
    let error = new Error('Not found')
    set(error, 'status', 404)
    mockClient.getShipment.mockImplementation(() => Promise.reject(error))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.NotFound)
      .then((response) => {
        expect(response.body.code).toBe('ShipmentNotFound')
      })
  })
})

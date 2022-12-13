import { ShipmentModel } from '../../input/shipment/interfaces'

export default class MockUtils {
  private _readJSON(
    jsonFile: Record<string, any>,
    parameter: string | null,
    timeout: number,
    notFoundErrorMessage: string
  ): Promise<any>
  getShipment(shipmentId: string): Promise<ShipmentModel>
}

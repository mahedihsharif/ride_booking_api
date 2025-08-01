export enum VehicleType {
  CAR = "CAR",
  BIKE = "BIKE",
  CNG = "CNG",
  VAN = "VAN",
}

export interface IVehicle {
  type: VehicleType;
  model?: string;
  licensePlate?: string;
  color?: string;
}

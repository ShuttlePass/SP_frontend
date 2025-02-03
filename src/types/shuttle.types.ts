export type ShuttleType = "pickup" | "dropoff";

export interface Passenger {
  name: string;
  contact: string;
  address: string;
  boardingLocation: string;
}

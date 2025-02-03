export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface ShuttleRoute {
  id: string;
  name: string;  // 예: "1호차", "2호차"
  capacity: number;
  stops: Location[];
  departureTime: string;
}

export interface ShuttleAssignment {
  studentId: string;
  routeId: string;
  pickupLocation: Location;
  pickupTime: string;
} 
export interface ScheduleData {
  [date: string]: ScheduleType;
}

export interface ScheduleType {
  pickup: BusRoute[];
  dropoff: BusRoute[];
}

export interface BusRoute {
  id: string;
  carName: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  peopleCount: number;
  passengers?: Passenger[];
}

export interface Passenger {
  name: string;
  contact: string;
  address: string;
  boardingLocation: string;
}

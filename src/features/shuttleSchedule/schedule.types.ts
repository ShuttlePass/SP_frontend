import { Passenger } from "@/types/shuttle.types";

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
  passengers: Passenger[];
  passengerCount: number;
}

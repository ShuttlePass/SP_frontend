export type ClassType = '기능 교육' | '필기 시험' | '학과 교육';

export interface Schedule {
  day: string;
  time: string;
}
export interface BaseClassInfo {
  id: string;
  type: string;
  name: string;
  schedule: Schedule[];
  startDate: string;
  endDate: string;
  instructor: string;
  notes?: string;
}

export type ClassInfo = BaseClassInfo;

export interface Course extends BaseClassInfo {
  maxStudents: number;
  fixedTimes?: string[];
}

export interface StudentRow {
  id: string;
  name: string;
  phone: string;
  address: string;
  courses?: Course[];
  classes?: ClassInfo[];
  showCourseDetail?: boolean;
  registeredClasses?: ClassInfo[];
  shuttle?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface CourseUpdateData {
  id?: string;
  type: string;
  dayOfWeek: string;
  timeSlots: TimeSlot[];
}

export interface CourseSchedule {
  weekday: string[];
  monWedThu: string[];
  weekend?: string[];
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  address: string;
  area_idx: number;
}
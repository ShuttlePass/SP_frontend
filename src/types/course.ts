export interface Course {
  id: string;
  name: string;
  maxStudents: number;
  schedule?: {
    day: string;
    time: string;
  }[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface CourseManagerProps {
  mode: 'management' | 'assignment';
  studentId?: string;
  studentName?: string;
  onClose: () => void;
}

export interface AssignedCourse {
  id: string;
  type: string;
  date: string;
  startTime: string;
  maxStudents?: number;
} 
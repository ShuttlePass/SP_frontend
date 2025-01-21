// 타입들을 별도 파일로 분리하면 좋을 것 같습니다
export type ClassType = '기능 교육' | '필기 시험' | '학과 교육';

export interface Course {
  id: string;
  name: string;
  type: ClassType;
  fixedTimes: string[] | CourseSchedule;
  maxStudents: number;
}

export interface CourseSchedule {
  weekday: string[];
  monWedThu: string[];
  weekend?: string[];
}

// ... 기타 인터페이스들 
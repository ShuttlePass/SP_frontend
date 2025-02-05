export interface StudentApiResponse {
  message: string;
  code: number;
  data: Student[];
  pageInfo: PageInfo;
}

export interface Student {
  st_idx: number;
  company_idx: number;
  area_idx: number;
  st_name: string;
  st_contact: string;
  st_address: string;
  st_address_x: number | null;
  st_address_y: number | null;
  created_at: string;
  updated_at: string;
}

export interface PageInfo {
  size: number;
  page: number;
  total_count: number;
}

export interface ClassEnrollmentApiResponse {
  message: string;
  code: number;
  data: ClassEnrollment[];
  pageInfo: PageInfo;
}

export interface ClassEnrollment {
  ce_idx: number;
  student_idx: number;
  ce_date: string;
  classes_day_idx: number;
  created_at: string;
  updated_at: string;
  classes_idx: number;
  cd_day: string;
  cl_max_num: number;
  cl_start_at: string;
  cl_end_at: string;
  cn_idx: number;
  cn_name: string;
}

export interface StudentWithClasses extends Student {
  classes?: ClassEnrollment[];
} 
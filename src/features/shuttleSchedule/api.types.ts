export interface ShuttleApiResponse {
  message: string;
  code: number;
  data: ShuttleData[];
}

export interface ShuttleData {
  sh_idx: number;
  sh_name: string;
  sh_state: number;
  sh_max_cnt: number;
  times: ShuttleTime[];
}

export interface ShuttleTime {
  st_idx: number;
  st_type: number; // 1: 등원, 2: 하원
  st_time: string;
  cnt: string;
  sr_idx: number | null;
  sh_idx: number;
}

export interface ShuttleReservationResponse {
  message: string;
  code: number;
  data: {
    data: ShuttleReservation[];
    pageInfo: PageInfo;
  };
}

export interface ShuttleReservation {
  student_idx: number;
  st_name: string;
  st_contact: string;
  st_type: number;
  st_time: string;
  sr_meet_time: string | null;
  sr_meet_date: string;
  sr_address: string;
  sr_address_memo: string | null;
  sr_address_x: number | null;
  sr_address_y: number | null;
  sr_state: number;
}

export interface ShuttleReservationRequest {
  shuttle_idx: number;
  shuttle_time_idx: number;
  sr_meet_date: string;
  student_idx: number;
  sr_address?: string;
  classes_enrollment_idxs: number[];
} 
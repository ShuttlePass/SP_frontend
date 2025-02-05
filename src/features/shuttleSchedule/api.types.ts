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